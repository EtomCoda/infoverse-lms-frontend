import type { CourseDetail } from '@/types/course';
import { getStructuredData } from '@/utils/course';

interface CourseStructuredDataProps {
  course: CourseDetail;
}

const CourseStructuredData = ({ course }: CourseStructuredDataProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData(course)) }}
  />
);

export default CourseStructuredData;
