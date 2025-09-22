// Merged imports from both type systems
import {
  EnrolledCourse,
  SuggestedCourse,
  LearningProgress as StudentLearningProgress,
} from "../types/learning";
import {
  LearningProgress as CourseLearningProgress,
  Topic,
  TopicRecommendation,
} from "../types/courseContent";

// Course-related utility functions
export const getDifficultyColor = (
  difficulty: EnrolledCourse["difficulty"] | SuggestedCourse["difficulty"],
): string => {
  switch (difficulty) {
    case "beginner":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "intermediate":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "advanced":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export const getProgressColor = (progress: number): string => {
  if (progress < 40) {
    return "bg-rose-500";
  }
  if (progress < 70) {
    return "bg-amber-400";
  }
  return "bg-emerald-500";
};

// Course progress calculations
export const calculateCompletionRate = (
  progress: StudentLearningProgress[],
): number => {
  if (!progress.length) return 0;
  const totalLessons = progress.reduce((acc, course) => acc + course.totalLessons, 0);
  const completedLessons = progress.reduce((acc, course) => acc + course.lessonsCompleted, 0);
  return totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
};

export const calculateTotalCertificates = (progress: StudentLearningProgress[]): number =>
  progress.reduce((acc, course) => acc + course.certificates.length, 0);

export const calculateAverageQuizScore = (progress: StudentLearningProgress[]): number => {
  const allScores = progress.flatMap((course) => course.quiz_scores);
  if (!allScores.length) return 0;
  const averageScore = allScores.reduce((acc, score) => acc + score, 0) / allScores.length;
  return Math.round(averageScore);
};

export const calculateAveragePace = (progress: StudentLearningProgress[]): number => {
  if (!progress.length) return 0;
  const totalTime = progress.reduce((acc, course) => acc + course.timeSpent, 0);
  const totalLessons = progress.reduce((acc, course) => acc + course.lessonsCompleted, 0);
  if (!totalLessons) return 0;
  return Math.round(totalTime / totalLessons);
};

// Time formatting utilities
export const formatHours = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }
  if (hours % 1 === 0) {
    return `${hours} hr${hours === 1 ? "" : "s"}`;
  }
  return `${hours.toFixed(1)} hrs`;
};

export const formatMinutes = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hrs) return `${mins} min`;
  if (!mins) return `${hrs} hr${hrs === 1 ? "" : "s"}`;
  return `${hrs} hr${hrs === 1 ? "" : "s"} ${mins} min`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes === 0 ? `${hours} hr` : `${hours} hr ${remainingMinutes} min`;
};

export const formatTimeFromSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Course navigation utilities
export const getNextLessonLabel = (course: EnrolledCourse): string =>
  course.nextLesson ? `Next: ${course.nextLesson}` : "Resume learning";

export const buildCourseBreadcrumb = (course: EnrolledCourse): string[] => [
  "Dashboard",
  course.category,
  course.name,
];

// Topic-based learning utilities
export const calculateTopicProgress = (topics: Topic[]): number => {
  if (topics.length === 0) {
    return 0;
  }
  const completed = topics.filter((topic) => topic.isCompleted).length;
  return Math.round((completed / topics.length) * 100);
};

export const getRecommendedTopics = (topics: Topic[], currentTopicId: string): TopicRecommendation[] => {
  const currentTopic = topics.find((topic) => topic.id === currentTopicId);

  const baseRecommendations: TopicRecommendation[] = topics
    .filter((topic) => topic.id !== currentTopicId && !topic.isCompleted && !topic.isLocked)
    .slice(0, 3)
    .map((topic) => ({
      topicId: topic.id,
      reason: "Reinforces foundational concepts",
      priority: "medium" as const,
    }));

  if (!currentTopic || !currentTopic.relatedTopics) {
    return baseRecommendations;
  }

  const relatedRecommendations = currentTopic.relatedTopics
    .map((topicId) => topics.find((topic) => topic.id === topicId))
    .filter((topic): topic is Topic => Boolean(topic))
    .map((topic) => ({
      topicId: topic.id,
      reason: "Suggested based on your current progress",
      priority: "high" as const,
    }));

  return [...relatedRecommendations, ...baseRecommendations].slice(0, 4);
};

export const getNextTopic = (topics: Topic[], currentTopicId: string): Topic | undefined => {
  const currentIndex = topics.findIndex((topic) => topic.id === currentTopicId);
  if (currentIndex === -1) {
    return undefined;
  }
  return topics
    .slice(currentIndex + 1)
    .find((topic) => !topic.isLocked);
};

export const getPreviousTopic = (topics: Topic[], currentTopicId: string): Topic | undefined => {
  const currentIndex = topics.findIndex((topic) => topic.id === currentTopicId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return topics
    .slice(0, currentIndex)
    .reverse()
    .find((topic) => !topic.isLocked);
};

export const aggregateProgress = (
  progressEntries: CourseLearningProgress[],
): CourseLearningProgress | null => {
  if (progressEntries.length === 0) {
    return null;
  }

  const [firstEntry, ...rest] = progressEntries;

  return rest.reduce<CourseLearningProgress>(
    (acc, entry) => ({
      ...acc,
      topicId: entry.topicId,
      timeSpent: acc.timeSpent + entry.timeSpent,
      lastPosition: entry.lastPosition,
      completionPercentage: Math.max(acc.completionPercentage, entry.completionPercentage),
      notesCount: acc.notesCount + entry.notesCount,
      bookmarks: [...acc.bookmarks, ...entry.bookmarks],
      quizScores: [...acc.quizScores, ...entry.quizScores],
      streakCount: entry.streakCount ?? acc.streakCount,
      achievements: entry.achievements ?? acc.achievements,
    }),
    { ...firstEntry },
  );
};

export const summarizeQuizPerformance = (progress: CourseLearningProgress): string => {
  if (progress.quizScores.length === 0) {
    return "No quizzes completed yet.";
  }

  const averageScore =
    progress.quizScores.reduce((total, result) => total + result.score, 0) /
    progress.quizScores.length;

  return `Average quiz score: ${Math.round(averageScore)}%.`;
};