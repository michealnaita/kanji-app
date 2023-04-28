import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'tailwindcss/tailwind.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages';
import Search from './pages/search';
import { AppProvider } from './context/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import HouseholdPage from './pages/household';
import SignInPage from './pages/signin';
import RegisterPage from './pages/register';
import ErrorPage from './pages/500';
import NotFoundErrorPage from './pages/404';
import 'react-toastify/dist/ReactToastify.css';
import RechargePage from './pages/recharge';
import AboutPage from './pages/about';
import BadRequestErrorPage from './pages/400';
import ResetPasswordPage from './pages/reset-password';
import VerifyEmailPage from './pages/verify-email';
import FlutterWaveRedirect from './pages/flutterwave';
import ProfilePage from './pages/profile';
import ServicePage from './pages/services';
import SignOutPage from './pages/signout';
import AuthProvider from './context/auth';
import { AdminProvider } from './context/admin';
import AdminPage from './pages/admin';
import ProtectedRoute from './components/shared/protected-route';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute page={Home} />,
    errorElement: <NotFoundErrorPage />,
  },
  { path: '/search', element: <ProtectedRoute page={Search} /> },
  { path: '/signin', element: <SignInPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/recharge', element: <ProtectedRoute page={RechargePage} /> },
  { path: '/500', element: <ErrorPage /> },
  { path: '/404', element: <NotFoundErrorPage /> },
  { path: '/400', element: <BadRequestErrorPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/password', element: <ResetPasswordPage /> },
  { path: '/services', element: <ProtectedRoute page={ServicePage} /> },
  { path: '/verifyEmail', element: <ProtectedRoute page={VerifyEmailPage} /> },
  { path: '/signout', element: <ProtectedRoute page={SignOutPage} /> },
  { path: '/profile', element: <ProtectedRoute page={ProfilePage} /> },
  { path: '/admin', element: <ProtectedRoute page={AdminPage} /> },
  {
    path: '/flutterwaveRedirect',
    element: <ProtectedRoute page={FlutterWaveRedirect} />,
  },
]);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <AdminProvider>
            <RouterProvider router={router} />
          </AdminProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
