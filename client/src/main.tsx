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
import ProtectedRoute from './components/shared/protected-route';
import 'react-toastify/dist/ReactToastify.css';
import RechargePage from './pages/recharge';
import PromoPage from './pages/promo';
import AboutPage from './pages/about';
import BadRequestErrorPage from './pages/400';
import ResetPasswordPage from './pages/reset-password';
import VerifyEmailPage from './pages/verify-email';
import FlutterWaveRedirect from './pages/flutterwave';

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
    element: <ProtectedRoute Route={Home} />,
    errorElement: <NotFoundErrorPage />,
  },
  { path: '/search', element: <ProtectedRoute Route={Search} /> },
  {
    path: '/house/:householdId',
    element: <ProtectedRoute Route={HouseholdPage} partial />,
  },
  { path: '/signin', element: <SignInPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/recharge', element: <ProtectedRoute Route={RechargePage} /> },
  { path: '/promo', element: <ProtectedRoute Route={PromoPage} /> },
  { path: '/500', element: <ErrorPage /> },
  { path: '/404', element: <NotFoundErrorPage /> },
  { path: '/400', element: <BadRequestErrorPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/password', element: <ResetPasswordPage /> },
  { path: '/verifyEmail', element: <ProtectedRoute Route={VerifyEmailPage} /> },
  {
    path: '/flutterwaveRedirect',
    element: <ProtectedRoute Route={FlutterWaveRedirect} />,
  },
]);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AppProvider>
  </React.StrictMode>
);
