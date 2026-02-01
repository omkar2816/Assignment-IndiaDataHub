// IndiaDataHub Assignment - Catalogue Page Component

'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DataTable from '@/components/DataTable';

export default function CataloguePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-collapse sidebar on mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setSidebarCollapsed(true);
      }
    };

    // Check initial screen size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleMobileSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearMobileSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50">
      {/* Header */}
      <Header onSearch={handleSearch} searchTerm={searchTerm} />
      
      {/* Mobile/Tablet Search Section */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-slate-200/50 px-4 py-3">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm text-base"
            placeholder="Search products, categories, sources..."
            value={searchTerm}
            onChange={handleMobileSearch}
          />
          {searchTerm && (
            <button
              onClick={clearMobileSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-slate-50 rounded-r-xl transition-colors"
            >
              <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
        
        {/* Main Panel */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <main className="flex-1 overflow-hidden p-4 lg:p-6 min-h-0">
            <div className="h-full">
              <DataTable searchTerm={searchTerm} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}