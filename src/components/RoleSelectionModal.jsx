import { Shield, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit'
import { useUserRole } from '../providers/UserRoleProvider'

/**
 * Modal for selecting user role (User or Insurance)
 * Forces user to choose a role after wallet connection and signing is complete
 */
export default function RoleSelectionModal() {
  const currentAccount = useCurrentAccount()
  const { connectionStatus } = useCurrentWallet()
  const { role, setRole, isLoading } = useUserRole()
  const [showModal, setShowModal] = useState(false)
  const previousAddressRef = useRef(null)
  const hasShownForCurrentAddressRef = useRef(false)

  // Track when a new wallet connects (after signing is complete)
  useEffect(() => {
    const currentAddress = currentAccount?.address
    
    // If wallet is connected and account exists
    if (currentAddress && connectionStatus === 'connected') {
      // Check if this is a new connection (different address)
      const isNewConnection = previousAddressRef.current !== currentAddress
      
      // Reset the "has shown" flag if it's a new address
      if (isNewConnection) {
        hasShownForCurrentAddressRef.current = false
        previousAddressRef.current = currentAddress
      }

      // Show modal if:
      // - Connection is complete (connected status)
      // - No role selected yet
      // - Haven't shown modal for this address yet
      // - Not loading
      if (
        !isLoading &&
        !role &&
        !hasShownForCurrentAddressRef.current
      ) {
        // Small delay to ensure signing process is fully complete
        const timer = setTimeout(() => {
          setShowModal(true)
          hasShownForCurrentAddressRef.current = true
        }, 500) // 500ms delay after connection

        return () => clearTimeout(timer)
      }
    } else {
      // Reset when wallet disconnects
      previousAddressRef.current = null
      hasShownForCurrentAddressRef.current = false
      setShowModal(false)
    }
  }, [currentAccount?.address, connectionStatus, role, isLoading])

  // Don't show modal if conditions aren't met
  if (!showModal || !currentAccount?.address || role || isLoading || connectionStatus !== 'connected') {
    return null
  }

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-heading font-semibold text-text-light dark:text-text-dark">
              Select Your Role
            </h2>
          </div>
          <p className="text-sm text-text-muted">
            Please choose your role to continue using MedNG
          </p>
          <p className="text-xs text-text-muted mt-1">
            Choose "Patient" if you're a user managing your medical records, or "Insurance" if you're reviewing claims
          </p>
        </div>

        {/* Role Options */}
        <div className="p-6 space-y-4">
          {/* User Role */}
          <button
            onClick={() => handleRoleSelect('user')}
            className="w-full p-6 border-2 border-border-light dark:border-border-dark rounded-xl hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-1">
                  Patient
                </h3>
                <p className="text-sm text-text-muted">
                  Access your medical records, submit claims, and manage your health data
                </p>
              </div>
            </div>
          </button>

          {/* Insurance Role */}
          <button
            onClick={() => handleRoleSelect('insurance')}
            className="w-full p-6 border-2 border-border-light dark:border-border-dark rounded-xl hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-1">
                  Insurance
                </h3>
                <p className="text-sm text-text-muted">
                  Review and process insurance claims with ZK proof verification
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer Note */}
        <div className="p-6 border-t border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-900/50">
          <p className="text-xs text-text-muted text-center">
            You can change your role later in settings
          </p>
        </div>
      </div>
    </div>
  )
}
