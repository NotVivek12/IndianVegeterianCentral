import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import Nearby from './pages/Nearby';
import PlaceDetail from './pages/PlaceDetail';
import CountryIndex from './pages/CountryIndex';
import CountryDetail from './pages/CountryDetail';
import Scan from './pages/Scan';
import Cook from './pages/Cook';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/layout/MainLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/nearby" element={<Nearby />} />
              <Route path="/place/:id" element={<PlaceDetail />} />
              <Route path="/countries" element={<CountryIndex />} />
              <Route path="/country/:code" element={<CountryDetail />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/cook" element={<Cook />} />
            </Routes>
          </MainLayout>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
