"use client";

import ForgotPasswordLayout from "@/components/forgot-password/ForgotPasswordLayout";
import PasswordRecoveryForm from "@/components/forgot-password/PasswordRecoveryForm";

const ForgotPasswordPage = () => {
  return (
    <ForgotPasswordLayout>
      <PasswordRecoveryForm />
    </ForgotPasswordLayout>
  );
};

export default ForgotPasswordPage;
