import { useAuth } from '@clerk/clerk-react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import HomePage from '@/pages/home'
import { SignInPage, SignUpPage } from '@/pages/auth'
import DashboardLayout from '@/pages/dashboard-layout'
import DashboardOverview from '@/pages/dashboard-overview'
import AutomationsPage from '@/pages/automations'
import AutomationDetailPage from '@/pages/automation-detail'
import IntegrationsPage from '@/pages/integrations'
import SettingsPage from '@/pages/settings'
import InstagramCallbackPage from '@/pages/instagram-callback'
import PaymentPage from '@/pages/payment'

function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth()
  if (!isLoaded) return <div className="h-screen flex items-center justify-center">Loading…</div>
  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  return <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Navigate to="/dashboard/workspace" replace />} />
        <Route path="/dashboard/:slug" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="automations" element={<AutomationsPage />} />
          <Route path="automations/:id" element={<AutomationDetailPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/callback/instagram" element={<InstagramCallbackPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
