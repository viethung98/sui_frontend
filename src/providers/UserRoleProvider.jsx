import { createContext, useContext, useEffect, useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'

const UserRoleContext = createContext({
  role: null, // 'user' | 'insurance' | null
  setRole: () => {},
  isLoading: true,
})

export const useUserRole = () => {
  return useContext(UserRoleContext)
}

export default function UserRoleProvider({ children }) {
  const currentAccount = useCurrentAccount()
  const [role, setRoleState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load role from localStorage when account changes
  useEffect(() => {
    if (currentAccount?.address) {
      const storedRole = localStorage.getItem(`user_role_${currentAccount.address}`)
      if (storedRole && (storedRole === 'user' || storedRole === 'insurance')) {
        setRoleState(storedRole)
      } else {
        setRoleState(null) // No role selected yet
      }
      setIsLoading(false)
    } else {
      // No wallet connected, clear role and localStorage
      setRoleState(null)
      setIsLoading(false)
      
      // Clear all role entries from localStorage when wallet disconnects
      // This ensures clean state for next connection
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('user_role_')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }
  }, [currentAccount?.address])

  const setRole = (newRole) => {
    if (newRole === 'user' || newRole === 'insurance') {
      setRoleState(newRole)
      if (currentAccount?.address) {
        localStorage.setItem(`user_role_${currentAccount.address}`, newRole)
      }
    } else {
      setRoleState(null)
      if (currentAccount?.address) {
        localStorage.removeItem(`user_role_${currentAccount.address}`)
      }
    }
  }

  return (
    <UserRoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  )
}
