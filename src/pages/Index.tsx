import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseSelector } from '@/components/CourseSelector';
import { LoginModal } from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Settings, BookOpen, CreditCard, Zap } from 'lucide-react';
import { Course, Flashcard } from '@/types/flashcard';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Index = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', [
    {
      id: '1',
      name: 'Matemática',
      subjects: [
        {
          id: '1',
          name: 'Álgebra',
          flashcards: [
            {
              id: '1',
              question: 'O que é uma equação de segundo grau?',
              answer: 'Uma equação de segundo grau é uma equação polinomial onde o maior expoente da variável é 2. Sua forma geral é ax² + bx + c = 0, onde a ≠ 0.',
              isFavorited: false
            },
            {
              id: '2',
              question: 'Como resolver uma equação do tipo x² - 5x + 6 = 0?',
              answer: 'Usando a fórmula de Bhaskara: x = (-b ± √(b²-4ac))/2a. Para x² - 5x + 6 = 0: x = (5 ± √(25-24))/2 = (5 ± 1)/2. Soluções: x = 3 ou x = 2.',
              isFavorited: false
            }
          ]
        },
        {
          id: '2',
          name: 'Geometria',
          flashcards: [
            {
              id: '3',
              question: 'Qual é a fórmula da área de um círculo?',
              answer: 'A área de um círculo é calculada pela fórmula A = πr², onde r é o raio do círculo e π ≈ 3,14159.',
              isFavorited: false
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'História',
      subjects: [
        {
          id: '3',
          name: 'Brasil Colonial',
          flashcards: [
            {
              id: '4',
              question: 'Quando foi o descobrimento do Brasil?',
              answer: 'O Brasil foi descoberto em 22 de abril de 1500 por Pedro Álvares Cabral durante uma expedição portuguesa às Índias.',
              isFavorited: false
            }
          ]
        }
      ]
    }
  ]);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [favoriteCards] = useLocalStorage<string[]>('favoriteCards', []);

  const handleStartStudy = (courseId: string, subjectIds: string[]) => {
    const params = new URLSearchParams({
      courseId,
      subjectIds: subjectIds.join(',')
    });
    navigate(`/study?${params.toString()}`);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    navigate('/admin');
  };

  const totalCards = courses.reduce((total, course) => 
    total + course.subjects.reduce((subTotal, subject) => 
      subTotal + subject.flashcards.length, 0
    ), 0
  );

  const totalSubjects = courses.reduce((total, course) => 
    total + course.subjects.length, 0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              FlashCards Pro
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Aprenda de forma inteligente com flashcards interativos. 
              Estude em qualquer lugar, a qualquer hora.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Cursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-sm text-muted-foreground">cursos disponíveis</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Cards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCards}</div>
              <p className="text-sm text-muted-foreground">flashcards total</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Favoritos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favoriteCards.length}</div>
              <p className="text-sm text-muted-foreground">cards favoritados</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <Button 
            onClick={() => navigate('/favorites')} 
            variant="outline" 
            size="lg"
            className="flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Meus Favoritos
          </Button>
          
          <Button 
            onClick={() => setIsLoginModalOpen(true)} 
            variant="outline" 
            size="lg"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Gerenciar Sistema
          </Button>
        </div>

        {/* Course Selection */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Escolha o que deseja estudar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CourseSelector 
              courses={courses} 
              onStartStudy={handleStartStudy} 
            />
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-8">Recursos do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Flipagem 3D</h3>
              <p className="text-sm text-muted-foreground">Cards com animação suave e efeito 3D</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Controle Rápido</h3>
              <p className="text-sm text-muted-foreground">Navegação por teclado e touch</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Favoritos</h3>
              <p className="text-sm text-muted-foreground">Marque e revise cards importantes</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Gerenciamento</h3>
              <p className="text-sm text-muted-foreground">Adicione e edite seus próprios cards</p>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Index;
