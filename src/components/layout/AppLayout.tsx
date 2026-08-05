'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import GlobalSearchModal from './GlobalSearchModal';
import AuthModal from './AuthModal';
import LandingNavbar from '../landing/Navbar';
import HeroSection from '../landing/HeroSection';
import LiveDemoSection from '../landing/LiveDemoSection';
import FeaturesSection from '../landing/FeaturesSection';
import CustomerLogos from '../landing/CustomerLogos';
import TestimonialsSection from '../landing/TestimonialsSection';
import Footer from '../landing/Footer';

// View imports
import DashboardView from '../views/DashboardView';
import DocumentsView from '../views/DocumentsView';
import CollectionsView from '../views/CollectionsView';
import SearchView from '../views/SearchView';
import ChatView from '../views/ChatView';
import AiToolsView from '../views/AiToolsView';
import AnalyticsView from '../views/AnalyticsView';
import AdminView from '../views/AdminView';
import SettingsView from '../views/SettingsView';

export default function AppLayout() {
  const { currentView } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState<boolean>(false);

  // If home, render full landing page layout
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white transition-colors">
        <LandingNavbar />
        <main className="flex-1">
          <HeroSection />
          <CustomerLogos />
          <LiveDemoSection />
          <FeaturesSection />
          <TestimonialsSection />
        </main>
        <Footer />
        <AuthModal />
        <GlobalSearchModal />
      </div>
    );
  }

  // Otherwise, render full App Layout with Sidebar + Header
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex transition-colors overflow-hidden relative">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpenMobile={isMobileSidebarOpen} 
        onCloseMobile={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'documents' && <DocumentsView />}
          {currentView === 'collections' && <CollectionsView />}
          {currentView === 'search' && <SearchView />}
          {currentView === 'chat' && <ChatView />}
          {currentView === 'ai-tools' && <AiToolsView />}
          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'admin' && <AdminView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals & Overlays */}
      <GlobalSearchModal />
      <AuthModal />
    </div>
  );
}
