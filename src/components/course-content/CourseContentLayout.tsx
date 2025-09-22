"use client";

import { DiscussionThread, LearningProgress, Resource, Topic, TopicRecommendation, CourseContent, VideoContent } from "../../types/courseContent";
import { calculateTopicProgress, getNextTopic, getPreviousTopic } from "@/utils/learningAnalytics";
import { ContentSection } from "./ContentSection";
import { CourseOutline } from "./CourseOutline";
import { MediaPlayer } from "./MediaPlayer";
import { ProgressTracker } from "./ProgressTracker";
import { TopicNavigator } from "./TopicNavigator";

interface CourseContentLayoutProps {
  course?: CourseContent;
  topics: Topic[];
  currentTopic?: Topic;
  videoContent?: VideoContent;
  resources: Resource[];
  progress?: LearningProgress;
  recommendations: TopicRecommendation[];
  discussion?: DiscussionThread;
  loading?: boolean;
  onSelectTopic?: (topicId: string) => void;
  onTimeIncrement?: (seconds: number) => void;
  onPositionChange?: (seconds: number) => void;
  onCompletion?: () => void;
  onBookmark?: (bookmark: { label: string; note: string; timestamp: number }) => void;
  onCreateNote?: (note: string) => void;
}

const sidebarLinks = [
  { label: "Dashboard", href: "#" },
  { label: "Courses", href: "#" },
  { label: "Subject 1", href: "#", isActive: true },
  { label: "Subject 2", href: "#" },
  { label: "Course Catalog", href: "#" },
];

const supportLinks = [
  { label: "Settings", href: "#" },
  { label: "Log out", href: "#" },
  { label: "Help", href: "#" },
];

export const CourseContentLayout = ({
  course,
  topics,
  currentTopic,
  videoContent,
  resources,
  progress,
  recommendations,
  discussion,
  loading,
  onSelectTopic,
  onTimeIncrement,
  onPositionChange,
  onCompletion,
  onBookmark,
  onCreateNote,
}: CourseContentLayoutProps) => {
  const topicProgress = calculateTopicProgress(topics);
  const nextTopic = getNextTopic(topics, currentTopic?.id ?? "");
  const previousTopic = getPreviousTopic(topics, currentTopic?.id ?? "");

  return (
    <div className="min-h-screen w-full bg-slate-100/80">
      <div className="mx-auto flex min-h-screen max-w-[1440px] gap-6 bg-gradient-to-br from-sky-200/60 via-white to-white p-6">
        <aside className="flex w-full max-w-[260px] flex-col justify-between rounded-3xl bg-sky-500/90 p-6 text-white shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-2xl bg-white/15 p-3 backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-lg font-semibold">IV</div>
              <div>
                <p className="text-sm font-semibold">Infoverse</p>
                <p className="text-xs text-white/70">Digital-Ed</p>
              </div>
            </div>
            <nav className="space-y-2">
              {sidebarLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    link.isActive
                      ? "bg-white text-sky-600 shadow"
                      : "text-white/90 hover:bg-white/20"
                  }`}
                >
                  {link.label}
                  {link.isActive && <span className="inline-flex h-2 w-2 rounded-full bg-sky-500" aria-hidden />}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-2 text-sm">
            {supportLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center justify-between rounded-2xl px-4 py-2 text-white/90 transition hover:bg-white/20"
              >
                {link.label}
              </a>
            ))}
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="flex flex-wrap items-start justify-between gap-4 rounded-3xl bg-white/80 p-6 shadow-lg">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">Course Content</p>
              <h1 className="text-3xl font-bold text-slate-900">{course?.title ?? "Course title"}</h1>
              <p className="text-sm text-slate-600">{course?.instructor ?? "Instructor"}</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Overall progress</p>
                <p className="text-lg font-semibold text-slate-900">{topicProgress}%</p>
              </div>
              <div className="h-12 w-px bg-slate-200" aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Current topic</p>
                <p className="text-sm font-semibold text-slate-700">{currentTopic?.title ?? "Select a topic"}</p>
              </div>
            </div>
          </header>

          <TopicNavigator
            courseTitle={course?.title ?? "Course"}
            currentTopicTitle={currentTopic?.title}
            previousTopic={previousTopic}
            nextTopic={nextTopic}
            onNavigate={(topicId) => onSelectTopic?.(topicId)}
          />

          <div className="grid gap-6 xl:grid-cols-[380px,1fr]">
            <div className="space-y-6">
              <CourseOutline
                topics={topics}
                currentTopicId={currentTopic?.id}
                onSelectTopic={onSelectTopic}
                progressPercentage={topicProgress}
              />

              <ProgressTracker
                course={course}
                topics={topics}
                progress={progress}
                recommendations={recommendations}
              />
            </div>

            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
                {loading && (
                  <p className="text-sm text-slate-500">Loading immersive learning experience...</p>
                )}

                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <h2 className="text-2xl font-semibold text-slate-900">{currentTopic?.title ?? "Topic title"}</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {currentTopic?.description ?? "Select a topic from the outline to begin learning."}
                    </p>
                  </div>

                  <MediaPlayer
                    video={videoContent}
                    progress={progress ?? {
                      courseId: course?.id ?? "course",
                      topicId: currentTopic?.id ?? "topic",
                      timeSpent: 0,
                      lastPosition: 0,
                      completionPercentage: 0,
                      notesCount: 0,
                      bookmarks: [],
                      quizScores: [],
                    }}
                    onTimeIncrement={onTimeIncrement}
                    onPositionChange={onPositionChange}
                    onCompletion={onCompletion}
                    onBookmark={onBookmark}
                  />

                  <ContentSection
                    topic={currentTopic}
                    resources={resources}
                    discussion={discussion}
                    onLaunchInteractive={(id) => console.info("Launching interactive experience", id)}
                    onOpenResource={(id) => console.info("Opening resource", id)}
                    onStartQuiz={(id) => console.info("Starting quiz", id)}
                    onCreateNote={onCreateNote}
                  />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseContentLayout;
