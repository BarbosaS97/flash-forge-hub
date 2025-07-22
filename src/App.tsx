import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { StudyPage } from "./pages/StudyPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { AdminPage } from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import { Course } from "./types/flashcard";
import { useLocalStorage } from "./hooks/useLocalStorage";

const queryClient = new QueryClient();

const AppContent = () => {
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route 
        path="/study" 
        element={
          <StudyPage 
            courses={courses} 
            onUpdateCourses={setCourses} 
          />
        } 
      />
      <Route 
        path="/favorites" 
        element={<FavoritesPage courses={courses} />} 
      />
      <Route 
        path="/admin" 
        element={
          <AdminPage 
            courses={courses} 
            onCoursesUpdate={setCourses} 
          />
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
