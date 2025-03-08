import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Pricing from './pages/Pricing';
import LinkedIn from './pages/platforms/LinkedIn';
import Twitter from './pages/platforms/Twitter';
import Instagram from './pages/platforms/Instagram';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import BrandVoices from './pages/dashboard/BrandVoices';
import ContentGeneration from './pages/dashboard/ContentGeneration';
import ContentRevival from './pages/dashboard/ContentRevival';
import ContentLibrary from './pages/dashboard/ContentLibrary';
import IdeasContent from './pages/dashboard/IdeasContent';
import Templates from './pages/dashboard/Templates';
import HooksLibrary from './pages/dashboard/HooksLibrary';
import SocialFlipHooks from './pages/dashboard/SocialFlipHooks';
import HooksContent from './pages/dashboard/HooksContent';
import Ideas from './pages/dashboard/Ideas';
import UserProfile from './components/profile/UserProfile';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import TokenHistory from './pages/dashboard/TokenHistory';
import DocumentationDashboard from './pages/docs/DocumentationDashboard';
import ContentGenerationDocs from './pages/docs/ContentGenerationDocs';
import ContentRevivalDocs from './pages/docs/ContentRevivalDocs';
import ContentLibraryDocs from './pages/docs/ContentLibraryDocs';
import TemplatesDocs from './pages/docs/TemplatesDocs';
import HooksLibraryDocs from './pages/docs/HooksLibraryDocs';
import ContentIdeasDocs from './pages/docs/ContentIdeasDocs';
import IdeasContentDocs from './pages/docs/IdeasContentDocs';
import TokenHistoryDocs from './pages/docs/TokenHistoryDocs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          
          <Route path="/pricing" element={<><Navbar /><Pricing /><Footer /></>} />
          
          <Route path="/platforms/linkedin" element={<><Navbar /><LinkedIn /><Footer /></>} />
          
          <Route path="/platforms/twitter" element={<><Navbar /><Twitter /><Footer /></>} />
          
          <Route path="/platforms/instagram" element={<><Navbar /><Instagram /><Footer /></>} />
          
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="brand-voices" element={<BrandVoices />} />
            <Route path="generation" element={<ContentGeneration />} />
            <Route path="revival" element={<ContentRevival />} />
            <Route path="library" element={<ContentLibrary />} />
            <Route path="ideas-content" element={<IdeasContent />} />
            <Route path="ideas" element={<Ideas />} />
            <Route path="templates" element={<Templates />} />
            <Route path="hooks" element={<HooksLibrary />} />
            <Route path="hooks/socialflip" element={<SocialFlipHooks />} />
            <Route path="hooks/content" element={<HooksContent />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="tokens" element={<TokenHistory />} />
            
            {/* Documentation Routes */}
            <Route path="docs" element={<DocumentationDashboard />} />
            <Route path="docs/content-generation" element={<ContentGenerationDocs />} />
            <Route path="docs/content-revival" element={<ContentRevivalDocs />} />
            <Route path="docs/content-library" element={<ContentLibraryDocs />} />
            <Route path="docs/templates" element={<TemplatesDocs />} />
            <Route path="docs/hooks-library" element={<HooksLibraryDocs />} />
            <Route path="docs/content-ideas" element={<ContentIdeasDocs />} />
            <Route path="docs/ideas-content" element={<IdeasContentDocs />} />
            <Route path="docs/token-history" element={<TokenHistoryDocs />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;