import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { EnokiFlowProvider } from "@mysten/enoki/react"
import CustomWalletProvider from './providers/CustomWalletProvider'
import UserRoleProvider from './providers/UserRoleProvider'
import RoleSelectionModal from './components/RoleSelectionModal'
import AccessControlPage from './pages/AccessControlPage'
import AIMonetizationPage from './pages/AIMonetizationPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import RecordsPage from './pages/RecordsPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import IntroPage from './pages/IntroPage'
import InsuranceClaimsPage from './pages/InsuranceClaimsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
}

const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') })

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">

        {/* <EnokiFlowProvider
          apiKey={import.meta.env.VITE_ENOKI_API_KEY}
        > */}
          <Router>

            <WalletProvider autoConnect>
              <UserRoleProvider>
                {/* <CustomWalletProvider> */}
                  <Routes>
                    {/* <Route path="/" element={<IntroPage />} /> */}
                    {/* Insurance users can only access insurance-claims page */}
                    <Route 
                      path="/insurance-claims" 
                      element={
                        <ProtectedRoute allowedRoles={['user', 'insurance']}>
                          <Layout><InsuranceClaimsPage /></Layout>
                        </ProtectedRoute>
                      } 
                    />
                    {/* User-only routes - insurance users will be redirected to insurance-claims */}
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRoute allowedRoles={['user']}>
                          <Layout><HomePage /></Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['user']}>
                          <Layout><DashboardPage /></Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/records" 
                      element={
                        <ProtectedRoute allowedRoles={['user']}>
                          <Layout><RecordsPage /></Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/access" 
                      element={
                        <ProtectedRoute allowedRoles={['user']}>
                          <Layout><AccessControlPage /></Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/ai-monetization" 
                      element={
                        <ProtectedRoute allowedRoles={['user']}>
                          <Layout><AIMonetizationPage /></Layout>
                        </ProtectedRoute>
                      } 
                    />
                    {/* Auth callback is accessible to all */}
                    <Route path="/auth" element={<Layout><AuthCallbackPage /></Layout>} />
                  </Routes>
                  {/* Role Selection Modal - shows when wallet is connected but no role selected */}
                  <RoleSelectionModal />
                {/* </CustomWalletProvider> */}
              </UserRoleProvider>
            </WalletProvider>
          </Router>
        {/* </EnokiFlowProvider> */}

      </SuiClientProvider>
    </QueryClientProvider >
  )
}

export default App
