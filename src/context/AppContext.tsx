'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DocumentItem,
  CollectionItem,
  ChatThread,
  Citation,
  SearchResult,
  ModelProviderConfig,
  UserProfile,
  ChatMessage
} from '@/types';
import {
  INITIAL_DOCUMENTS,
  INITIAL_COLLECTIONS,
  INITIAL_THREADS,
  CURRENT_USER,
  DEFAULT_MODEL_CONFIG
} from '@/lib/mockData';
import {
  createIngestedDocument,
  searchVectorDatabase,
  generateRAGResponse
} from '@/lib/ragEngine';
import { answerDocumentQuery } from '@/lib/documentIntelligenceEngine';

export type AppView =
  | 'home'
  | 'dashboard'
  | 'documents'
  | 'collections'
  | 'search'
  | 'chat'
  | 'ai-tools'
  | 'analytics'
  | 'admin'
  | 'settings';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Documents & Collections
  documents: DocumentItem[];
  collections: CollectionItem[];
  addDocument: (fileName: string, fileSize: number, content?: string, dept?: any) => DocumentItem;
  deleteDocument: (id: string) => void;
  updateDocumentTags: (id: string, tags: string[]) => void;
  addCollection: (name: string, description: string, department: any, color?: string) => void;
  deleteCollection: (id: string) => void;
  activePreviewDoc: DocumentItem | null;
  setActivePreviewDoc: (doc: DocumentItem | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  executeSearch: (query: string, filters?: any) => void;

  // Chat & Citations
  chatThreads: ChatThread[];
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  activeThread: ChatThread | undefined;
  createNewThread: (title?: string) => string;
  sendMessageInThread: (userText: string) => void;
  deleteThread: (id: string) => void;
  activeCitation: Citation | null;
  setActiveCitation: (citation: Citation | null) => void;

  // Model & System Config
  modelConfig: ModelProviderConfig;
  updateModelConfig: (newConfig: Partial<ModelProviderConfig>) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  
  // Real-Time Site Content Sync
  siteContent: any;
  fetchSiteContent: () => Promise<void>;

  // Modals & UI
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  logoutUser: () => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  notifications: AppNotification[];
  dismissNotification: (id: string) => void;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme from system/localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('omni_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('omni_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('omni_theme', 'light');
      }
      return next;
    });
  };

  // Real-Time Site Content Sync
  const [siteContent, setSiteContent] = useState<any>(null);

  const fetchSiteContent = async () => {
    try {
      const res = await fetch('/api/site-content');
      const data = await res.json();
      if (data.success && data.content) {
        setSiteContent(data.content);
      }
    } catch (err) {
      // Ignore sync errors
    }
  };

  useEffect(() => {
    fetchSiteContent();
    const interval = setInterval(fetchSiteContent, 4000); // 4-second real-time sync polling
    return () => clearInterval(interval);
  }, []);

  // State initialization
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [collections, setCollections] = useState<CollectionItem[]>(INITIAL_COLLECTIONS);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>('th-1');
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [activePreviewDoc, setActivePreviewDoc] = useState<DocumentItem | null>(null);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  const [modelConfig, setModelConfig] = useState<ModelProviderConfig>(DEFAULT_MODEL_CONFIG);
  const [userProfile, setUserProfile] = useState<UserProfile>(CURRENT_USER);

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
    addNotification('Profile Updated', 'Your profile details have been saved.', 'success');
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);

  const logoutUser = () => {
    setIsAuthenticated(false);
    addNotification('Logged Out', 'You have been safely signed out.', 'info');
    setCurrentView('home');
  };

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Vector Index Synced',
      message: 'Q3 Financial Earnings Report vector embeddings successfully indexed in Qdrant.',
      type: 'success',
      timestamp: '10 min ago'
    },
    {
      id: 'notif-2',
      title: 'SOC2 Audit Compliance',
      message: 'Semi-annual security key rotation completed.',
      type: 'info',
      timestamp: '1 hour ago'
    }
  ]);

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Document actions
  const addDocument = (fileName: string, fileSize: number, content?: string, dept: any = 'Finance') => {
    const newDoc = createIngestedDocument(fileName, fileSize, content, dept);
    setDocuments(prev => [newDoc, ...prev]);
    addNotification('Document Processed', `${fileName} chunked and indexed into Vector DB.`, 'success');
    return newDoc;
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    addNotification('Document Deleted', 'Document removed from vector store.', 'warning');
  };

  const updateDocumentTags = (id: string, tags: string[]) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, tags } : d));
  };

  // Collection actions
  const addCollection = (name: string, description: string, department: any, color: string = 'from-blue-600 to-indigo-700') => {
    const newCol: CollectionItem = {
      id: `col-${Date.now()}`,
      name,
      description,
      department,
      documentCount: 0,
      totalSizeBytes: 0,
      createdAt: new Date().toISOString().split('T')[0],
      color,
      iconName: 'Folder'
    };
    setCollections(prev => [newCol, ...prev]);
    addNotification('Collection Created', `Workspace ${name} initialized.`, 'success');
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
  };

  // Search trigger
  const executeSearch = (query: string, filters?: any) => {
    setSearchQuery(query);
    const results = searchVectorDatabase(query, documents, filters);
    setSearchResults(results);
  };

  // Chat Actions
  const activeThread = chatThreads.find(t => t.id === activeThreadId) || chatThreads[0];

  const createNewThread = (title: string = 'New Conversation') => {
    const newTh: ChatThread = {
      id: `th-${Date.now()}`,
      title,
      updatedAt: new Date().toISOString(),
      messages: []
    };
    setChatThreads(prev => [newTh, ...prev]);
    setActiveThreadId(newTh.id);
    return newTh.id;
  };

  const sendMessageInThread = (userText: string) => {
    if (!userText.trim()) return;

    let threadId = activeThreadId;
    if (!activeThread) {
      threadId = createNewThread(userText.slice(0, 30) + '...');
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update thread title if it's new
    setChatThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const isFirst = t.messages.length === 0;
        return {
          ...t,
          title: isFirst ? (userText.length > 35 ? userText.slice(0, 35) + '...' : userText) : t.title,
          updatedAt: new Date().toISOString(),
          messages: [...t.messages, userMsg]
        };
      }
      return t;
    }));

    // Perform Grounded Document Intelligence Q&A
    const docQueryRes = answerDocumentQuery(userText, documents[0] || null, documents);

    // Simulate real-time streaming delay
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: docQueryRes.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: docQueryRes.citations,
        suggestedFollowUps: docQueryRes.suggestedFollowUps,
        modelUsed: modelConfig.defaultModel,
        retrievalLatencyMs: Math.floor(Math.random() * 200 + 150)
      };

      setChatThreads(prev => prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            updatedAt: new Date().toISOString(),
            messages: [...t.messages, assistantMsg]
          };
        }
        return t;
      }));
    }, 600);
  };

  const deleteThread = (id: string) => {
    setChatThreads(prev => prev.filter(t => t.id !== id));
    if (activeThreadId === id && chatThreads.length > 1) {
      const remaining = chatThreads.filter(t => t.id !== id);
      setActiveThreadId(remaining[0].id);
    }
  };

  const updateModelConfig = (newConfig: Partial<ModelProviderConfig>) => {
    setModelConfig(prev => ({ ...prev, ...newConfig }));
    addNotification('Settings Saved', 'Model and vector database parameters updated.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        isDarkMode,
        toggleDarkMode,
        documents,
        collections,
        addDocument,
        deleteDocument,
        updateDocumentTags,
        addCollection,
        deleteCollection,
        activePreviewDoc,
        setActivePreviewDoc,
        searchQuery,
        setSearchQuery,
        searchResults,
        executeSearch,
        chatThreads,
        activeThreadId,
        setActiveThreadId,
        activeThread,
        createNewThread,
        sendMessageInThread,
        deleteThread,
        activeCitation,
        setActiveCitation,
        modelConfig,
        updateModelConfig,
        userProfile,
        updateUserProfile,
        siteContent,
        fetchSiteContent,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAuthenticated,
        setIsAuthenticated,
        logoutUser,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        notifications,
        dismissNotification,
        addNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
