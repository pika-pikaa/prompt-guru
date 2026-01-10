import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Main pages
import { DashboardPage } from '@/pages/DashboardPage';
import { CreatePromptPage } from '@/pages/CreatePromptPage';
import { OptimizePage } from '@/pages/OptimizePage';
import { QuickRecipesPage } from '@/pages/QuickRecipesPage';
import { PromptDetailPage } from '@/pages/PromptDetailPage';

// Error page
import { NotFoundPage } from '@/pages/NotFoundPage';

const routes: RouteObject[] = [
  // Auth routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Root redirect
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },

  // Protected routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/create',
    element: (
      <ProtectedRoute>
        <CreatePromptPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/optimize',
    element: (
      <ProtectedRoute>
        <OptimizePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/recipes',
    element: (
      <ProtectedRoute>
        <QuickRecipesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/prompt/:id',
    element: (
      <ProtectedRoute>
        <PromptDetailPage />
      </ProtectedRoute>
    ),
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
