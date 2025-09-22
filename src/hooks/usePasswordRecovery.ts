import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { requestPasswordReset } from "../lib/api/passwordRecovery";
import {
  PasswordResetRequest,
  RecoveryResponse,
  SecuritySettings,
} from "../types/passwordRecovery";
import {
  calculateProgressiveDelay,
  defaultSecuritySettings,
  deriveRateLimitMessage,
  formatEstimatedDelivery,
  getCooldownTarget,
  shouldTriggerCaptcha,
} from "../utils/security";
import { normalizeEmailForRequest } from "../utils/emailValidation";

export interface PasswordRecoveryState {
  isSubmitting: boolean;
  error: string | null;
  response: RecoveryResponse | null;
  cooldownRemaining: number;
  attemptsRemaining: number;
  captchaRequired: boolean;
  deliveryStatus: "idle" | "queued" | "sent" | "delivered" | "delayed";
  estimatedDeliveryCopy: string | null;
  rateLimitMessage: string | null;
}

export const usePasswordRecovery = (
  settings: SecuritySettings = defaultSecuritySettings,
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<RecoveryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attemptsWithinWindow, setAttemptsWithinWindow] = useState(0);
  const [windowStartedAt, setWindowStartedAt] = useState<Date | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<Date | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [deliveryStatus, setDeliveryStatus] = useState<
    "idle" | "queued" | "sent" | "delivered" | "delayed"
  >("idle");
  const [estimatedDeliveryMinutes, setEstimatedDeliveryMinutes] = useState<number>();
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
  const lastRequestRef = useRef<PasswordResetRequest | null>(null);

  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownRemaining(0);
      return;
    }

    const updateRemaining = () => {
      const diff = cooldownUntil.getTime() - Date.now();
      setCooldownRemaining(diff > 0 ? diff : 0);
    };

    updateRemaining();
    const interval = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(interval);
  }, [cooldownUntil]);

  useEffect(() => {
    if (!windowStartedAt) return;
    const interval = window.setInterval(() => {
      if (Date.now() - windowStartedAt.getTime() >= 60 * 60 * 1000) {
        setAttemptsWithinWindow(0);
        setWindowStartedAt(null);
      }
    }, 10_000);

    return () => window.clearInterval(interval);
  }, [windowStartedAt]);

  useEffect(() => {
    if (!response?.success || !settings.enableDeliveryTracking) {
      if (!response?.success) {
        setDeliveryStatus("idle");
      }
      return;
    }

    setDeliveryStatus("queued");
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setDeliveryStatus("sent"), 1500));

    const etaMs = Math.max((estimatedDeliveryMinutes ?? 2) * 60_000, 30_000);
    timers.push(
      window.setTimeout(
        () => setDeliveryStatus(estimatedDeliveryMinutes && estimatedDeliveryMinutes > 8 ? "delayed" : "delivered"),
        etaMs,
      ),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [estimatedDeliveryMinutes, response, settings.enableDeliveryTracking]);

  useEffect(() => {
    setRateLimitMessage(deriveRateLimitMessage(response ?? undefined, cooldownRemaining));
  }, [cooldownRemaining, response]);

  const attemptsRemaining = useMemo(() => {
    return Math.max(settings.maxAttemptsPerHour - attemptsWithinWindow, 0);
  }, [attemptsWithinWindow, settings.maxAttemptsPerHour]);

  const captchaRequired = useMemo(
    () => shouldTriggerCaptcha(attemptsWithinWindow, settings),
    [attemptsWithinWindow, settings],
  );

  const estimatedDeliveryCopy = useMemo(
    () => formatEstimatedDelivery(estimatedDeliveryMinutes),
    [estimatedDeliveryMinutes],
  );

  const resetStates = useCallback(() => {
    setResponse(null);
    setError(null);
    setDeliveryStatus("idle");
    setEstimatedDeliveryMinutes(undefined);
    setRateLimitMessage(null);
  }, []);

  const submitRequest = useCallback(
    async (email: string, honeypotValue?: string): Promise<RecoveryResponse | null> => {
      const now = new Date();

      if (honeypotValue) {
        setError("Suspicious activity detected. If you are human, please try again in a moment.");
        return null;
      }

      if (cooldownUntil && cooldownUntil.getTime() > now.getTime()) {
        setError("Too many recovery attempts. Please wait before trying again.");
        return null;
      }

      if (!windowStartedAt || now.getTime() - windowStartedAt.getTime() >= 60 * 60 * 1000) {
        setWindowStartedAt(now);
        setAttemptsWithinWindow(0);
      }

      if (attemptsWithinWindow >= settings.maxAttemptsPerHour) {
        const cooldownTarget = getCooldownTarget(now, settings);
        setCooldownUntil(cooldownTarget);
        setError("Recovery temporarily locked due to repeated attempts. Try again later.");
        return null;
      }

      const normalizedEmail = normalizeEmailForRequest(email);
      const requestPayload: PasswordResetRequest = {
        email: normalizedEmail,
        timestamp: now,
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      };

      const delay = calculateProgressiveDelay(attemptsWithinWindow + 1);
      if (delay > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, delay));
      }

      setAttemptsWithinWindow((previous) => previous + 1);
      setIsSubmitting(true);
      setError(null);
      setResponse(null);
      setDeliveryStatus("idle");

      try {
        const result = await requestPasswordReset(requestPayload);
        setResponse(result);
        setEstimatedDeliveryMinutes(result.estimatedDeliveryTime);
        lastRequestRef.current = requestPayload;

        if (result.rateLimitInfo?.resetTime) {
          setCooldownUntil(new Date(result.rateLimitInfo.resetTime));
        } else if (attemptsWithinWindow + 1 >= settings.maxAttemptsPerHour) {
          const target = getCooldownTarget(now, settings);
          setCooldownUntil(target);
        }

        return result;
      } catch (submissionError) {
        const fallbackMessage =
          submissionError instanceof Error
            ? submissionError.message
            : "Password recovery request could not be completed.";
        setError(fallbackMessage);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [attemptsWithinWindow, cooldownUntil, settings, windowStartedAt],
  );

  const resendRequest = useCallback(async () => {
    const lastRequest = lastRequestRef.current;
    if (!lastRequest) {
      setError("There is no recent recovery request to resend.");
      return null;
    }

    return submitRequest(lastRequest.email);
  }, [submitRequest]);

  const state: PasswordRecoveryState = {
    isSubmitting,
    error,
    response,
    cooldownRemaining,
    attemptsRemaining,
    captchaRequired,
    deliveryStatus,
    estimatedDeliveryCopy,
    rateLimitMessage,
  };

  return {
    state,
    submitRequest,
    resendRequest,
    resetStates,
  };
};
