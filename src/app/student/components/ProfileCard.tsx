"use client";

import { StudentProfile } from "@/types/learning";

interface ProfileCardProps {
  profile: StudentProfile;
}

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=3&w=160&h=160&q=80";

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <aside
      className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-labelledby="profile-title"
    >
      <header className="flex items-start justify-between">
        <div>
          <p id="profile-title" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Profile
          </p>
          <h2 className="text-xl font-semibold text-slate-900">{profile.fullName}</h2>
          <p className="text-sm text-slate-500">{profile.email}</p>
        </div>
        <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-200">
          <img
            src={profile.avatar ?? FALLBACK_AVATAR}
            alt={`${profile.fullName}'s avatar`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-4 text-sm text-slate-600">
        <div>
          <dt className="font-medium text-slate-500">Learning streak</dt>
          <dd className="text-lg font-semibold text-slate-900">{profile.learningStreak} days</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Courses completed</dt>
          <dd className="text-lg font-semibold text-slate-900">{profile.totalCoursesCompleted}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Current level</dt>
          <dd className="text-base font-medium text-slate-900">{profile.currentLevel}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Member since</dt>
          <dd className="text-base font-medium text-slate-900">
            {profile.joinDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3">
        <button className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
          View profile
        </button>
        <button className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
          Learning preferences
        </button>
      </div>
    </aside>
  );
};
