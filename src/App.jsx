import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { EnokiFlowProvider } from "@mysten/enoki/react"
import CustomWalletProvider from './providers/CustomWalletProvider'
import AccessControlPage from './pages/AccessControlPage'
import AIMonetizationPage from './pages/AIMonetizationPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import RecordsPage from './pages/RecordsPage'
import AuthCallbackPage from './pages/AuthCallbackPage'

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
        <WalletProvider autoConnect>
          <EnokiFlowProvider
            apiKey={import.meta.env.VITE_ENOKI_API_KEY}
          >
            <Router>
              <CustomWalletProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/records" element={<RecordsPage />} />
                    <Route path="/access" element={<AccessControlPage />} />
                    <Route path="/ai-monetization" element={<AIMonetizationPage />} />
                    <Route path="/auth" element={<AuthCallbackPage />} />
                  </Routes>
                </Layout>
              </CustomWalletProvider>
            </Router>
          </EnokiFlowProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}

export default App
