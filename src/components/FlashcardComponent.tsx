import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, RotateCcw } from 'lucide-react';
import { Flashcard } from '@/types/flashcard';
import { cn } from '@/lib/utils';

interface FlashcardComponentProps {
  flashcard: Flashcard;
  onFavorite: (id: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCards: number;
  className?: string;
}

export const FlashcardComponent = ({
  flashcard,
  onFavorite,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
  className
}: FlashcardComponentProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    setIsFlipped(false);
  }, [flashcard.id]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(!isFlipped);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onPrevious();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped, onNext, onPrevious]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrevious();
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className="mb-4 text-center">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} de {totalCards}
        </span>
      </div>
      
      <div
        className={cn(
          "flashcard relative w-full h-96 sm:h-80 md:h-96 lg:h-[400px]",
          isFlipped && "flashcard-flipped"
        )}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flashcard-inner w-full h-full relative">
          <Card
            className="flashcard-front absolute inset-0 w-full h-full bg-gradient-card shadow-card border-border/50 cursor-pointer"
            onClick={handleCardClick}
          >
            <div className="h-full flex flex-col justify-center items-center p-8 text-center">
              <div className="mb-4">
                <RotateCcw className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Toque para virar</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-card-foreground leading-relaxed">
                  {flashcard.question}
                </h2>
              </div>
            </div>
          </Card>

          <Card
            className="flashcard-back absolute inset-0 w-full h-full bg-gradient-card shadow-card border-border/50 cursor-pointer"
            onClick={handleCardClick}
          >
            <div className="h-full flex flex-col justify-center items-center p-8 text-center">
              <div className="mb-4">
                <RotateCcw className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Toque para virar</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-base sm:text-lg md:text-xl text-card-foreground leading-relaxed">
                  {flashcard.answer}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="flex-1 mr-2"
        >
          Anterior
        </Button>
        
        <Button
          variant="outline"
          onClick={() => onFavorite(flashcard.id)}
          className={cn(
            "mx-2 px-4",
            flashcard.isFavorited && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Heart className={cn("w-4 h-4", flashcard.isFavorited && "fill-current")} />
        </Button>
        
        <Button
          variant="outline"
          onClick={onNext}
          disabled={currentIndex === totalCards - 1}
          className="flex-1 ml-2"
        >
          Próximo
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p className="hidden sm:block">Use as setas ← → para navegar e espaço para virar</p>
        <p className="sm:hidden">Arraste para navegar e toque para virar</p>
      </div>
    </div>
  );
};