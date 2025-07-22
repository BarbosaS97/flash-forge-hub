import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Course, Subject, Flashcard } from '@/types/flashcard';
import { Plus, Edit, Trash2, Save, X, Book, FileText, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  courses: Course[];
  onCoursesUpdate: (courses: Course[]) => void;
}

export const AdminPanel = ({ courses, onCoursesUpdate }: AdminPanelProps) => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [newCourseName, setNewCourseName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const { toast } = useToast();

  const generateId = () => Date.now().toString();

  const addCourse = () => {
    if (!newCourseName.trim()) return;
    
    const newCourse: Course = {
      id: generateId(),
      name: newCourseName.trim(),
      subjects: []
    };
    
    onCoursesUpdate([...courses, newCourse]);
    setNewCourseName('');
    setIsAddingCourse(false);
    toast({ title: "Curso adicionado com sucesso!" });
  };

  const deleteCourse = (courseId: string) => {
    onCoursesUpdate(courses.filter(c => c.id !== courseId));
    setSelectedCourse(null);
    toast({ title: "Curso removido com sucesso!" });
  };

  const addSubject = () => {
    if (!newSubjectName.trim() || !selectedCourse) return;
    
    const newSubject: Subject = {
      id: generateId(),
      name: newSubjectName.trim(),
      flashcards: []
    };
    
    const updatedCourses = courses.map(course => 
      course.id === selectedCourse 
        ? { ...course, subjects: [...course.subjects, newSubject] }
        : course
    );
    
    onCoursesUpdate(updatedCourses);
    setNewSubjectName('');
    setIsAddingSubject(false);
    toast({ title: "Matéria adicionada com sucesso!" });
  };

  const deleteSubject = (subjectId: string) => {
    const updatedCourses = courses.map(course => 
      course.id === selectedCourse 
        ? { ...course, subjects: course.subjects.filter(s => s.id !== subjectId) }
        : course
    );
    
    onCoursesUpdate(updatedCourses);
    setSelectedSubject(null);
    toast({ title: "Matéria removida com sucesso!" });
  };

  const addFlashcard = () => {
    if (!newQuestion.trim() || !newAnswer.trim() || !selectedSubject) return;
    
    const newCard: Flashcard = {
      id: generateId(),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      isFavorited: false
    };
    
    const updatedCourses = courses.map(course => 
      course.id === selectedCourse 
        ? {
            ...course, 
            subjects: course.subjects.map(subject => 
              subject.id === selectedSubject 
                ? { ...subject, flashcards: [...subject.flashcards, newCard] }
                : subject
            )
          }
        : course
    );
    
    onCoursesUpdate(updatedCourses);
    setNewQuestion('');
    setNewAnswer('');
    setIsAddingCard(false);
    toast({ title: "Card adicionado com sucesso!" });
  };

  const updateFlashcard = (cardId: string) => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    
    const updatedCourses = courses.map(course => 
      course.id === selectedCourse 
        ? {
            ...course, 
            subjects: course.subjects.map(subject => 
              subject.id === selectedSubject 
                ? {
                    ...subject, 
                    flashcards: subject.flashcards.map(card => 
                      card.id === cardId 
                        ? { ...card, question: newQuestion.trim(), answer: newAnswer.trim() }
                        : card
                    )
                  }
                : subject
            )
          }
        : course
    );
    
    onCoursesUpdate(updatedCourses);
    setEditingCard(null);
    setNewQuestion('');
    setNewAnswer('');
    toast({ title: "Card atualizado com sucesso!" });
  };

  const deleteFlashcard = (cardId: string) => {
    const updatedCourses = courses.map(course => 
      course.id === selectedCourse 
        ? {
            ...course, 
            subjects: course.subjects.map(subject => 
              subject.id === selectedSubject 
                ? { ...subject, flashcards: subject.flashcards.filter(c => c.id !== cardId) }
                : subject
            )
          }
        : course
    );
    
    onCoursesUpdate(updatedCourses);
    toast({ title: "Card removido com sucesso!" });
  };

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const selectedSubjectData = selectedCourseData?.subjects.find(s => s.id === selectedSubject);

  const startEdit = (card: Flashcard) => {
    setEditingCard(card.id);
    setNewQuestion(card.question);
    setNewAnswer(card.answer);
  };

  const cancelEdit = () => {
    setEditingCard(null);
    setNewQuestion('');
    setNewAnswer('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground mt-2">Gerencie cursos, matérias e flashcards</p>
      </div>

      {/* Courses Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Cursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isAddingCourse ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do curso"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCourse()}
                />
                <Button onClick={addCourse} size="icon">
                  <Save className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => setIsAddingCourse(false)} 
                  variant="outline" 
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsAddingCourse(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Curso
              </Button>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedCourse === course.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedCourse(course.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.subjects.length} matéria(s)
                      </p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCourse(course.id);
                      }}
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Section */}
      {selectedCourseData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Matérias de {selectedCourseData.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isAddingSubject ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome da matéria"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                  />
                  <Button onClick={addSubject} size="icon">
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => setIsAddingSubject(false)} 
                    variant="outline" 
                    size="icon"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsAddingSubject(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Matéria
                </Button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCourseData.subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedSubject === subject.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedSubject(subject.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{subject.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {subject.flashcards.length} card(s)
                        </p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSubject(subject.id);
                        }}
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flashcards Section */}
      {selectedSubjectData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Cards de {selectedSubjectData.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add/Edit Card Form */}
              {(isAddingCard || editingCard) && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <div>
                    <Label htmlFor="question">Pergunta</Label>
                    <Textarea
                      id="question"
                      placeholder="Digite a pergunta..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="answer">Resposta</Label>
                    <Textarea
                      id="answer"
                      placeholder="Digite a resposta..."
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => editingCard ? updateFlashcard(editingCard) : addFlashcard()}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingCard ? 'Atualizar' : 'Adicionar'} Card
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsAddingCard(false);
                        cancelEdit();
                      }}
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {!isAddingCard && !editingCard && (
                <Button onClick={() => setIsAddingCard(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Card
                </Button>
              )}
              
              <div className="space-y-3">
                {selectedSubjectData.flashcards.map((card) => (
                  <div key={card.id} className="p-4 border rounded-lg hover:bg-muted/30">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Q:</span>
                          <p className="mt-1">{card.question}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">R:</span>
                          <p className="mt-1 text-muted-foreground">{card.answer}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button
                          onClick={() => startEdit(card)}
                          variant="ghost"
                          size="icon"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => deleteFlashcard(card.id)}
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};