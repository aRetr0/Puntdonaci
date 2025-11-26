import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginPage } from '@/components/LoginPage';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { HomePage } from '@/components/HomePage';
import { CalendariPage } from '@/components/CalendariPage';
import { RecompensesPage } from '@/components/RecompensesPage';
import { PerfilPage } from '@/components/PerfilPage';
import { ProtectedRoute } from './ProtectedRoute';

/**
 * Main application router
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute requireOnboarding={false}>
        <OnboardingFlow />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/home" replace />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'calendari',
        element: <CalendariPage />,
      },
      {
        path: 'recompenses',
        element: <RecompensesPage />,
      },
      {
        path: 'perfil',
        element: <PerfilPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
