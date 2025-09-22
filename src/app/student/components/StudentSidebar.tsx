"use client";

import { useState } from "react";
import { EnrolledCourse } from "@/types/learning";

interface StudentSidebarProps {
  enrolledCourses: EnrolledCourse[];
  activeCourseId: string | null;
  activeNavId?: string;
  onSelectCourse?: (courseId: string) => void;
  onNavigate?: (destination: string) => void;
}

const baseNavItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "courses", label: "Courses" },
];

const supportNavItems = [
  { id: "settings", label: "Settings" },
  { id: "logout", label: "Log out" },
  { id: "help", label: "Help" },
];

export const StudentSidebar = ({
  enrolledCourses,
  activeCourseId,
  activeNavId = "dashboard",
  onSelectCourse,
  onNavigate,
}: StudentSidebarProps) => {
  const [isCoursesOpen, setIsCoursesOpen] = useState(true);

  return (
    <aside
      className="flex h-full w-full max-w-xs flex-col justify-between rounded-3xl border border-slate-200 bg-sky-500/10 p-6 backdrop-blur"
      aria-label="Student navigation"
    >
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-700">Student Hub</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Learning Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Track progress, resume classes, and discover new skills tailored for you.
          </p>
        </div>

        <nav className="space-y-6" aria-label="Primary">
          <ul className="space-y-2">
            {baseNavItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate?.(item.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                    activeNavId === item.id
                      ? "bg-white text-sky-600 shadow"
                      : "text-slate-700 hover:bg-white hover:text-sky-600"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div>
            <button
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              onClick={() => setIsCoursesOpen((prev) => !prev)}
              aria-expanded={isCoursesOpen}
              aria-controls="enrolled-courses"
            >
              <span>My Courses</span>
              <span aria-hidden="true">{isCoursesOpen ? "–" : "+"}</span>
            </button>
            {isCoursesOpen && (
              <ul id="enrolled-courses" className="mt-2 space-y-1 pl-6">
                {enrolledCourses.map((course) => (
                  <li key={course.id}>
                    <button
                      onClick={() => onSelectCourse?.(course.id)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-2 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                        course.id === activeCourseId
                          ? "bg-white text-sky-600 shadow"
                          : "text-slate-600 hover:bg-white hover:text-sky-600"
                      }`}
                    >
                      <span>{course.name}</span>
                      <span className="text-xs text-slate-500">{course.progress}%</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
      </div>

      <nav aria-label="Support">
        <ul className="space-y-1">
          {supportNavItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate?.(item.id)}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-white hover:text-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
