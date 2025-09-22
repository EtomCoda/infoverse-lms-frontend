"use client";

import { useCallback, useEffect, useState } from "react";
import { CourseProgressCard } from "../../student/components/CourseProgressCard";
import { LearningAnalytics } from "../../student/components/LearningAnalytics";
import { ProfileCard } from "../../student/components/ProfileCard";
import { StudentSidebar } from "../../student/components/StudentSidebar";
import { SuggestedCourseCard } from "../../student/components/SuggestedCourseCard";
import { useLearningDashboardData } from "@/hooks/useLearningDashboardData";

const quickActions = [
  { id: "resume", label: "Resume last course" },
  { id: "bookmarks", label: "View bookmarks" },
  { id: "calendar", label: "Study calendar" },
  { id: "notes", label: "Learning notes" },
];

const LearningDashboardPage = () => {
  const {
    profile,
    enrolledCourses,
    suggestedCourses,
    learningProgress,
    activeCourseId,
    recentlyAccessed,
    setActiveCourseId,
  } = useLearningDashboardData();

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const syncConnectionStatus = () => {
      if (typeof navigator !== "undefined") {
        setIsOffline(!navigator.onLine);
      }
    };

    syncConnectionStatus();
    window.addEventListener("online", syncConnectionStatus);
    window.addEventListener("offline", syncConnectionStatus);
    return () => {
      window.removeEventListener("online", syncConnectionStatus);
      window.removeEventListener("offline", syncConnectionStatus);
    };
  }, []);

  const handleSelectCourse = useCallback(
    (courseId: string) => {
      const isNavRoute = ["dashboard", "courses", "settings", "logout", "help"].includes(courseId);
      if (isNavRoute) return;
      setActiveCourseId(courseId);
    },
    [setActiveCourseId],
  );

  const handleResume = useCallback((courseId: string) => {
    setActiveCourseId(courseId);
  }, [setActiveCourseId]);

  const handleNavigate = useCallback((destination: string) => {
    if (destination === "logout") {
      window.alert("Logging out is disabled in the demo experience.");
      return;
    }

    if (destination === "help") {
      window.alert("Reach out to your mentor or join the discussion forums for quick help.");
      return;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-slate-100 p-4 sm:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <StudentSidebar
          enrolledCourses={enrolledCourses}
          activeCourseId={activeCourseId}
          activeNavId="dashboard"
          onSelectCourse={handleSelectCourse}
          onNavigate={handleNavigate}
        />

        <main className="space-y-6">
          <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-widest text-sky-700">Dashboard</p>
              <h1 className="text-3xl font-bold text-slate-900">Welcome back, {profile.fullName.split(" ")[0]}!</h1>
              <p className="text-sm text-slate-600">
                Continue your learning journey, explore new courses, and celebrate your achievements.
              </p>
              {isOffline && (
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                  Offline mode enabled · Your progress will sync when you reconnect
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <LearningAnalytics courses={enrolledCourses} progress={learningProgress} />
            <ProfileCard profile={profile} />
          </div>

          <section aria-labelledby="continue-learning" className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="continue-learning" className="text-2xl font-semibold text-slate-900">
                  My Courses
                </h2>
                <p className="text-sm text-slate-600">Continue learning</p>
              </div>
              {recentlyAccessed.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium uppercase tracking-wide text-sky-700">Recently accessed:</span>
                  {recentlyAccessed.map((courseId) => {
                    const course = enrolledCourses.find((item) => item.id === courseId);
                    return course ? <span key={courseId}>{course.name}</span> : null;
                  })}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {enrolledCourses.map((course) => (
                <CourseProgressCard
                  key={course.id}
                  course={course}
                  progress={learningProgress.find((item) => item.courseId === course.id)}
                  onResume={() => handleResume(course.id)}
                  onOpenCourse={() => handleResume(course.id)}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="suggested-courses" className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <h2 id="suggested-courses" className="text-2xl font-semibold text-slate-900">
                Suggested new courses
              </h2>
              <p className="text-sm text-slate-600">
                Discover programs curated by our AI mentor to expand your skills and unlock new opportunities.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {suggestedCourses.map((course) => (
                <SuggestedCourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LearningDashboardPage;
