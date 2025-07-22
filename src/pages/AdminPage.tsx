import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPanel } from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Course } from '@/types/flashcard';

interface AdminPageProps {
  courses: Course[];
  onCoursesUpdate: (courses: Course[]) => void;
}

export const AdminPage = ({ courses, onCoursesUpdate }: AdminPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>
        
        <AdminPanel 
          courses={courses} 
          onCoursesUpdate={onCoursesUpdate} 
        />
      </div>
    </div>
  );
};