import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FlashcardComponent } from '@/components/FlashcardComponent';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Course, Flashcard } from '@/types/flashcard';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface StudyPageProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
}

export const StudyPage = ({ courses, onUpdateCourses }: StudyPageProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [favoriteCards, setFavoriteCards] = useLocalStorage<string[]>('favoriteCards', []);

  useEffect(() => {
    const courseId = searchParams.get('courseId');
    const subjectIds = searchParams.get('subjectIds')?.split(',') || [];
    
    if (!courseId || subjectIds.length === 0) {
      navigate('/');
      return;
    }

    const course = courses.find(c => c.id === courseId);
    if (!course) {
      navigate('/');
      return;
    }

    const cards: Flashcard[] = [];
    course.subjects
      .filter(subject => subjectIds.includes(subject.id))
      .forEach(subject => {
        cards.push(...subject.flashcards.map(card => ({
          ...card,
          isFavorited: favoriteCards.includes(card.id)
        })));
      });

    setStudyCards(cards);
    setCurrentIndex(0);
  }, [searchParams, courses, navigate, favoriteCards]);

  const handleFavorite = (cardId: string) => {
    const newFavorites = favoriteCards.includes(cardId)
      ? favoriteCards.filter(id => id !== cardId)
      : [...favoriteCards, cardId];
    
    setFavoriteCards(newFavorites);
    
    setStudyCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, isFavorited: !card.isFavorited }
        : card
    ));
  };

  const handleNext = () => {
    if (currentIndex < studyCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
  };

  const progress = studyCards.length > 0 ? ((currentIndex + 1) / studyCards.length) * 100 : 0;

  if (studyCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Nenhum card encontrado</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleRestart}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progresso do Estudo</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex items-center justify-center">
        <FlashcardComponent
          flashcard={studyCards[currentIndex]}
          onFavorite={handleFavorite}
          onNext={handleNext}
          onPrevious={handlePrevious}
          currentIndex={currentIndex}
          totalCards={studyCards.length}
          className="landscape:h-[calc(100vh-12rem)]"
        />
      </div>
    </div>
  );
};