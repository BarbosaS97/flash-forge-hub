import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Course, Subject } from '@/types/flashcard';
import { BookOpen, Play } from 'lucide-react';

interface CourseSelectorProps {
  courses: Course[];
  onStartStudy: (courseId: string, subjectIds: string[]) => void;
}

export const CourseSelector = ({ courses, onStartStudy }: CourseSelectorProps) => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedSubjects([]);
  };

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleStart = () => {
    if (selectedCourse && selectedSubjects.length > 0) {
      onStartStudy(selectedCourse, selectedSubjects);
    }
  };

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const totalCards = selectedCourseData?.subjects
    .filter(s => selectedSubjects.includes(s.id))
    .reduce((total, subject) => total + subject.flashcards.length, 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">Selecione um Curso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card
              key={course.id}
              className={`cursor-pointer transition-all hover:shadow-glow ${
                selectedCourse === course.id ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => handleCourseSelect(course.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {course.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {course.subjects.length} matéria(s)
                </p>
                <div className="mt-2">
                  <Badge variant="secondary">
                    {course.subjects.reduce((total, subject) => total + subject.flashcards.length, 0)} cards
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedCourseData && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Matérias de {selectedCourseData.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedCourseData.subjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center space-x-3 p-3 rounded-lg border bg-card"
              >
                <Checkbox
                  id={subject.id}
                  checked={selectedSubjects.includes(subject.id)}
                  onCheckedChange={() => handleSubjectToggle(subject.id)}
                />
                <label
                  htmlFor={subject.id}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium">{subject.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {subject.flashcards.length} cards
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSubjects.length > 0 && (
        <div className="text-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-lg font-medium">
              {totalCards} cards selecionados
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedSubjects.length} matéria(s) de {selectedCourseData?.name}
            </p>
          </div>
          <Button onClick={handleStart} size="lg" className="px-8">
            <Play className="w-4 h-4 mr-2" />
            Começar Estudo
          </Button>
        </div>
      )}
    </div>
  );
};