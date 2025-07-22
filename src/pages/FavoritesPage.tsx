import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlashcardComponent } from '@/components/FlashcardComponent';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Heart } from 'lucide-react';
import { Course, Flashcard } from '@/types/flashcard';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface FavoritesPageProps {
  courses: Course[];
}

export const FavoritesPage = ({ courses }: FavoritesPageProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favoriteCards, setFavoriteCards] = useLocalStorage<string[]>('favoriteCards', []);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const cards: Flashcard[] = [];
    
    courses.forEach(course => {
      course.subjects.forEach(subject => {
        subject.flashcards.forEach(card => {
          if (favoriteCards.includes(card.id)) {
            cards.push({
              ...card,
              isFavorited: true
            });
          }
        });
      });
    });

    setStudyCards(cards);
    setCurrentIndex(0);
  }, [courses, favoriteCards]);

  const handleFavorite = (cardId: string) => {
    const newFavorites = favoriteCards.filter(id => id !== cardId);
    setFavoriteCards(newFavorites);
    
    setStudyCards(prev => prev.filter(card => card.id !== cardId));
    
    if (currentIndex >= studyCards.length - 1) {
      setCurrentIndex(Math.max(0, studyCards.length - 2));
    }
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

  const progress = studyCards.length > 0 ? ((currentIndex + 1) / studyCards.length) * 100 : 0;

  if (studyCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Nenhum card favorito</h1>
          <p className="text-muted-foreground">
            Favorite alguns cards durante o estudo para vê-los aqui.
          </p>
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
          
          <div className="text-center">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-current" />
              Cards Favoritos
            </h1>
          </div>
          
          <div></div> {/* Spacer for center alignment */}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progresso</span>
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