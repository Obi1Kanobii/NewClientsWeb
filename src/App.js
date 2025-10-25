import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import KnowledgePage from './pages/KnowledgePage';
import RecipesPage from './pages/RecipesPage';
import PricingPage from './pages/PricingPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { StripeProvider } from './context/StripeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StripeProvider>
          <LanguageProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/knowledge" element={<KnowledgePage />} />
                  <Route path="/recipes" element={<RecipesPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/payment-success" element={<PaymentSuccessPage />} />
                  <Route path="/payment-cancel" element={<PaymentCancelPage />} />
                </Routes>
              </div>
            </Router>
          </LanguageProvider>
        </StripeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
