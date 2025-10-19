import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Home from './pages/Home';
import Nearby from './pages/Nearby';
import PlaceDetail from './pages/PlaceDetail';
import CountryIndex from './pages/CountryIndex';
import CountryDetail from './pages/CountryDetail';
import Scan from './pages/Scan';
import Cook from './pages/Cook';
import Login from './pages/Login';
import Register from './pages/Register';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/layout/MainLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, 
      gcTime: 1000 * 60 * 30, 
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          {/* Public Routes - Login/Register */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route
              path="/*"
              element={
                <>
                  <SignedIn>
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
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
