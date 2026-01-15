import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AccessControlPage from './pages/AccessControlPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import RecordsPage from './pages/RecordsPage'

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/records" element={<RecordsPage />} />
                <Route path="/access" element={<AccessControlPage />} />
              </Routes>
            </Layout>
          </Router>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}

export default App
