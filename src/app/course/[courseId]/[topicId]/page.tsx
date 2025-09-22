"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CourseContentLayout from "@/components/course-content/CourseContentLayout";
import { useCourseContent } from "@/hooks/useCourseContent";
import { useProgressTracker } from "@/hooks/useProgressTracker";
import { getNextTopic } from "@/utils/learningAnalytics";
import { Topic } from "@/types/courseContent";

type PageProps = {
  params: {
    courseId: string;
    topicId: string;
  };
};

const CourseTopicPage = ({ params }: PageProps) => {
  const { courseId, topicId } = params;
  const [activeTopicId, setActiveTopicId] = useState<string>(topicId);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [unlockedTopics, setUnlockedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setActiveTopicId(topicId);
  }, [topicId]);

  const {
    course,
    topics,
    currentTopic,
    videoContent,
    resources,
    discussion,
    recommendations,
    progressSnapshot,
    loading,
  } = useCourseContent(courseId, activeTopicId);

  const trackerTopicId = currentTopic?.id ?? activeTopicId;
  const {
    progress,
    updateTimeSpent,
    updateLastPosition,
    toggleCompletion,
    addBookmark,
    incrementNotes,
  } = useProgressTracker({ courseId, topicId: trackerTopicId, initialProgress: progressSnapshot });

  useEffect(() => {
    if (currentTopic) {
      setUnlockedTopics((previous) => ({ ...previous, [currentTopic.id]: true }));
    }
  }, [currentTopic?.id]);

  useEffect(() => {
    if (progressSnapshot?.completionPercentage === 100 && trackerTopicId) {
      setCompletedTopics((previous) => ({ ...previous, [trackerTopicId]: true }));
    }
  }, [progressSnapshot?.completionPercentage, trackerTopicId]);

  const resolvedTopics = useMemo(() => {
    return topics.map((topic) => {
      const isCompleted = completedTopics[topic.id] ?? topic.isCompleted;
      const isUnlocked = unlockedTopics[topic.id] ?? !topic.isLocked;
      return {
        ...topic,
        isCompleted,
        isLocked: !isUnlocked,
      };
    });
  }, [topics, completedTopics, unlockedTopics]);

  const handleTopicSelect = useCallback(
    (id: string) => {
      const targetTopic = resolvedTopics.find((topic) => topic.id === id);
      if (!targetTopic || targetTopic.isLocked) {
        return;
      }
      setActiveTopicId(id);
    },
    [resolvedTopics]
  );

  const handleCompletion = useCallback(() => {
    toggleCompletion(true);
    setCompletedTopics((previous) => ({ ...previous, [trackerTopicId]: true }));
    const nextTopic = getNextTopic(resolvedTopics as Topic[], trackerTopicId);
    if (nextTopic) {
      setUnlockedTopics((previous) => ({ ...previous, [nextTopic.id]: true }));
    }
  }, [resolvedTopics, toggleCompletion, trackerTopicId]);

  const handleBookmark = useCallback(
    (bookmark: { label: string; note: string; timestamp: number }) => {
      addBookmark(bookmark);
    },
    [addBookmark]
  );

  const handleCreateNote = useCallback(
    (note: string) => {
      incrementNotes();
      console.info("Note captured", note);
    },
    [incrementNotes]
  );

  return (
    <CourseContentLayout
      course={course}
      topics={resolvedTopics}
      currentTopic={resolvedTopics.find((topic) => topic.id === trackerTopicId)}
      videoContent={videoContent}
      resources={resources}
      progress={progress}
      recommendations={recommendations}
      discussion={discussion}
      loading={loading}
      onSelectTopic={handleTopicSelect}
      onTimeIncrement={(seconds) => updateTimeSpent(seconds)}
      onPositionChange={(seconds) => updateLastPosition(seconds)}
      onCompletion={handleCompletion}
      onBookmark={handleBookmark}
      onCreateNote={handleCreateNote}
    />
  );
};

export default CourseTopicPage;
