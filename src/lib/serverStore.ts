import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface SiteContent {
  hero: {
    badgeText: string;
    headlineTitle: string;
    headlineGradient: string;
    subheadline: string;
    uploadButtonText: string;
    chatButtonText: string;
    dropzoneTitle: string;
    dropzoneSubtitle: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    stat4Value: string;
    stat4Label: string;
  };
  announcements: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    active: boolean;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    company: string;
    avatar: string;
    text: string;
    rating: number;
  }>;
  customerLogos: Array<{
    id: string;
    name: string;
    logoUrl: string;
  }>;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
    category: string;
  }>;
  banners: Array<{
    id: string;
    title: string;
    subtitle: string;
    buttonText: string;
    active: boolean;
  }>;
  general: {
    companyName: string;
    tagline: string;
    contactEmail: string;
    supportPhone: string;
  };
}

export interface StoredUserAccount {
  id: string;
  fullName: string;
  usn: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
  role: 'User' | 'Admin';
  createdAt: string;
  lastLogin?: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface VersionSnapshot {
  id: string;
  timestamp: string;
  author: string;
  description: string;
  content: SiteContent;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'siteContent.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const AUDIT_FILE = path.join(DATA_DIR, 'auditLogs.json');
const VERSIONS_FILE = path.join(DATA_DIR, 'versionHistory.json');

// Memory store fallbacks
let memoryContent: SiteContent | null = null;
let memoryUsers: StoredUserAccount[] = [];
let memoryAuditLogs: AdminAuditLog[] = [];
let memoryVersions: VersionSnapshot[] = [];

// Admin Login Rate Limiting & Lockout Memory
export interface AdminLockoutRecord {
  failedAttempts: number;
  lockedUntil: number;
  lastAttemptAt: number;
}
declare global {
  var adminLockoutStore: Record<string, AdminLockoutRecord> | undefined;
}

if (!globalThis.adminLockoutStore) {
  globalThis.adminLockoutStore = {};
}

export const adminLockoutStore = globalThis.adminLockoutStore;

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Read-only filesystem fallback
  }
}

// High-security Password Hashing with 100,000 PBKDF2 iterations and per-password salt
export function hashPassword(password: string, userSalt?: string): string {
  const salt = userSalt || crypto.createHash('sha256').update(password + '_rag_salt_2026').digest('hex').slice(0, 32);
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (storedHash.includes(':')) {
      const [salt, originalHash] = storedHash.split(':');
      const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
      return crypto.timingSafeEqual(Buffer.from(originalHash), Buffer.from(testHash));
    }
    // Fallback for legacy 10,000 iteration hashes
    const legacySalt = 'rag_app_salt_2026_x900';
    const testLegacy = crypto.pbkdf2Sync(password, legacySalt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(testLegacy));
  } catch (err) {
    return false;
  }
}

const DEFAULT_CONTENT: SiteContent = {
  hero: {
    badgeText: 'Next-Generation Vector Indexing & Hybrid RAG Platform',
    headlineTitle: 'Enterprise AI',
    headlineGradient: 'Knowledge Platform',
    subheadline: 'Upload company documents and ask intelligent questions powered by Retrieval-Augmented Generation. Every answer is grounded with verifiable document citations.',
    uploadButtonText: 'Upload Documents',
    chatButtonText: 'Start Chatting',
    dropzoneTitle: 'Click to upload or drag enterprise files here',
    dropzoneSubtitle: 'PDF, DOCX, PPTX, CSV, Markdown up to 100MB',
    stat1Value: '99.4%',
    stat1Label: 'MRR@10 Recall Accuracy',
    stat2Value: '< 1.2s',
    stat2Label: 'Avg Hybrid Retrieval Latency',
    stat3Value: '100%',
    stat3Label: 'Verifiable Grounded Citations',
    stat4Value: 'SOC 2',
    stat4Label: 'Type II Security Certified'
  },
  announcements: [
    {
      id: 'ann-1',
      title: 'Platform Upgrade v3.4',
      message: 'Added support for direct file uploads in AI RAG Chat and HNSW vector index speedups.',
      type: 'info',
      active: true
    }
  ],
  testimonials: [
    {
      id: 'test-1',
      name: 'Dr. Aris Thorne',
      role: 'VP of Engineering',
      company: 'QuantScale AI Solutions',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'Track Report transformed our internal knowledge retrieval. Finding exact citations across 50,000 PDF pages takes less than a second now.',
      rating: 5
    },
    {
      id: 'test-2',
      name: 'Elena Rostova',
      role: 'Chief Compliance Officer',
      company: 'Apex Financial Holdings',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Zero hallucination guarantees and verifiable page-level citations made SOC 2 compliance sign-off effortless for our legal team.',
      rating: 5
    }
  ],
  customerLogos: [
    { id: 'logo-1', name: 'Acme Enterprise', logoUrl: '🏢 Acme Corp' },
    { id: 'logo-2', name: 'Vertex Systems', logoUrl: '⚡ Vertex' },
    { id: 'logo-3', name: 'CloudScale', logoUrl: '☁️ CloudScale' },
    { id: 'logo-4', name: 'BioTech Labs', logoUrl: '🧬 BioTech' },
    { id: 'logo-5', name: 'Nexus Cyber', logoUrl: '🛡️ Nexus Security' }
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'How does Retrieval-Augmented Generation (RAG) eliminate AI hallucinations?',
      answer: 'Our RAG engine retrieves exact semantic chunks from your indexed documents using HNSW vector graphs and forces the LLM to synthesize answers strictly grounded in cited text.',
      category: 'Security & RAG'
    },
    {
      id: 'faq-2',
      question: 'What document formats are supported for instant parsing?',
      answer: 'We support PDF, DOCX, PPTX, CSV, XLSX, Markdown (.md), JSON, and plain text files with automatic OCR and table layout preservation.',
      category: 'Ingestion'
    }
  ],
  banners: [
    {
      id: 'ban-1',
      title: 'SOC2 Type II & ISO 27001 Certified Security',
      subtitle: 'Your documents and vector embeddings are encrypted with dedicated AES-256 keys at rest and TLS 1.3 in transit.',
      buttonText: 'Read Architecture Specs',
      active: true
    }
  ],
  general: {
    companyName: 'Track Report PRO',
    tagline: 'Enterprise Engine Technologies',
    contactEmail: 'support@trackreport.ai',
    supportPhone: '+1 (800) 555-0199'
  }
};

// Initial Seed Users
const DEFAULT_USERS: StoredUserAccount[] = [
  {
    id: 'usr-hasim',
    fullName: 'Hasim Admin',
    usn: '1MS21CS001',
    email: 'hasim@enterprise.ai',
    phoneNumber: '+91 9876543210',
    passwordHash: hashPassword('hasim2602'),
    role: 'Admin',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-student1',
    fullName: 'Alexandra Wright',
    usn: '1MS21CS045',
    email: 'alexandra.wright@enterprise.ai',
    phoneNumber: '5550192831',
    passwordHash: hashPassword('Password123!'),
    role: 'User',
    createdAt: '2026-02-10T10:00:00Z'
  }
];

export function getSiteContent(): SiteContent {
  if (memoryContent) return memoryContent;
  ensureDataDir();
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
      memoryContent = JSON.parse(data);
      return memoryContent!;
    }
  } catch (e) {
    // Ignore read errors
  }
  memoryContent = DEFAULT_CONTENT;
  return memoryContent;
}

export function saveSiteContent(newContent: SiteContent, author: string = 'Admin'): void {
  memoryContent = newContent;
  ensureDataDir();
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(newContent, null, 2), 'utf-8');
  } catch (e) {
    // Ignore write errors
  }

  // Create version snapshot automatically
  addVersionSnapshot(newContent, author, 'Content published from Admin Panel');
}

export function getUsers(): StoredUserAccount[] {
  if (memoryUsers.length > 0) return memoryUsers;
  ensureDataDir();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      memoryUsers = JSON.parse(data);
      return memoryUsers;
    }
  } catch (e) {
    // Ignore
  }
  memoryUsers = DEFAULT_USERS;
  return memoryUsers;
}

export function saveUsers(users: StoredUserAccount[]): void {
  memoryUsers = users;
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    // Ignore
  }
}

export function getAuditLogs(): AdminAuditLog[] {
  if (memoryAuditLogs.length > 0) return memoryAuditLogs;
  ensureDataDir();
  try {
    if (fs.existsSync(AUDIT_FILE)) {
      const data = fs.readFileSync(AUDIT_FILE, 'utf-8');
      memoryAuditLogs = JSON.parse(data);
      return memoryAuditLogs;
    }
  } catch (e) {
    // Ignore
  }
  memoryAuditLogs = [
    {
      id: 'log-seed-1',
      timestamp: new Date().toISOString(),
      adminUser: 'System',
      action: 'Initial Setup',
      details: 'Secure Hidden Admin Panel initialized with default Hasim admin credentials.',
      ipAddress: '127.0.0.1'
    }
  ];
  return memoryAuditLogs;
}

export function addAuditLog(adminUser: string, action: string, details: string, ipAddress: string = '127.0.0.1'): void {
  const logs = getAuditLogs();
  const newLog: AdminAuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    adminUser,
    action,
    details,
    ipAddress
  };
  const updated = [newLog, ...logs];
  memoryAuditLogs = updated;
  ensureDataDir();
  try {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (e) {
    // Ignore
  }
}

export function getVersionHistory(): VersionSnapshot[] {
  if (memoryVersions.length > 0) return memoryVersions;
  ensureDataDir();
  try {
    if (fs.existsSync(VERSIONS_FILE)) {
      const data = fs.readFileSync(VERSIONS_FILE, 'utf-8');
      memoryVersions = JSON.parse(data);
      return memoryVersions;
    }
  } catch (e) {
    // Ignore
  }
  return memoryVersions;
}

export function addVersionSnapshot(content: SiteContent, author: string, description: string): void {
  const history = getVersionHistory();
  const snapshot: VersionSnapshot = {
    id: `ver-${Date.now()}`,
    timestamp: new Date().toISOString(),
    author,
    description,
    content: JSON.parse(JSON.stringify(content))
  };
  const updated = [snapshot, ...history].slice(0, 20); // Keep last 20 snapshots
  memoryVersions = updated;
  ensureDataDir();
  try {
    fs.writeFileSync(VERSIONS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (e) {
    // Ignore
  }
}
