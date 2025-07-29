import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from './ErrorBoundary';
import { Loader } from './Loader';

// Lazy load pages
const MainLayout = lazy(() => import('../layout/MainLayout'));
const Index = lazy(() => import('../../pages/Index'));
const CoursesPage = lazy(() => import('../pages/CoursesPage'));
const AILiteracyIntro = lazy(() => import('../courses/AILiteracyIntro'));
const SolutionsPage = lazy(() => import('../pages/SolutionsPage'));
const NotFound = lazy(() => import('../../pages/NotFound'));
const SmartslateDifference = lazy(() => import('../pages/SmartslateDifference'));
const CollaboratePage = lazy(() => import('../pages/CollaboratePage'));
const UserSettings = lazy(() => import('../../pages/UserSettings'));
const AdminDashboard = lazy(() => import('../../pages/AdminDashboard'));

export const Router = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/ai-literacy" element={<AILiteracyIntro />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/smartslate-difference" element={<SmartslateDifference />} />
              <Route path="/collaborate" element={<CollaboratePage />} />
              <Route path="/settings" element={<UserSettings />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};