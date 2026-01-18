import { Navigate, useLocation } from 'react-router-dom'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useUserRole } from '../providers/UserRoleProvider'
import { Loader2 } from 'lucide-react'

/**
 * ProtectedRoute - Restricts access based on user role
 * Insurance users can only access the insurance-claims page
 * User role can access all pages
 */
export default function ProtectedRoute({ children, allowedRoles = ['user', 'insurance'] }) {
  const currentAccount = useCurrentAccount()
  const { role, isLoading } = useUserRole()
  const location = useLocation()

  // Show loading while checking role
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  // If no wallet connected, allow access (wallet connection will be handled elsewhere)
  if (!currentAccount?.address) {
    return children
  }

  // If no role selected yet, allow access (role selection modal will handle it)
  if (!role) {
    return children
  }

  // Insurance users can only access insurance-claims page
  if (role === 'insurance') {
    // If trying to access insurance-claims page, allow it
    if (location.pathname === '/insurance-claims') {
      return children
    }
    // Otherwise, redirect to insurance-claims page
    return <Navigate to="/insurance-claims" replace />
  }

  // User role can access all pages except if explicitly restricted
  if (role === 'user') {
    // Check if this route is allowed for user role
    if (allowedRoles.includes('user')) {
      return children
    }
    // If not allowed, redirect to home
    return <Navigate to="/" replace />
  }

  // Default: allow access
  return children
}
