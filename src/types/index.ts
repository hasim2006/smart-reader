export type FileType = 'pdf' | 'docx' | 'pptx' | 'txt' | 'md' | 'csv' | 'xlsx';

export type SecurityLevel = 'Public' | 'Internal' | 'Confidential' | 'Restricted';

export type Department = 'Executive' | 'Finance' | 'Legal' | 'Engineering' | 'HR' | 'Sales' | 'R&D';

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  pageNumber?: number;
  sectionHeader?: string;
  tokenCount: number;
  vectorId: string;
  embeddingSnippet?: number[];
}

export interface IntelligentSummaries {
  oneLineSummary: string;
  executiveSummary: string;
  detailedSummary: string;
  sectionWiseSummary: { section: string; summary: string }[];
  chapterWiseSummary: { chapter: string; summary: string }[];
  keyTakeaways: string[];
  importantPoints: string[];
  conclusion: string;
  actionItems: string[];
  importantDates: { date: string; event: string }[];
  importantNames: { name: string; roleOrContext: string }[];
  importantNumbers: { metric: string; value: string }[];
  importantDefinitions: { term: string; definition: string }[];
}

export interface InsightsEngineData {
  keyInsights: string[];
  hiddenInsights: string[];
  trends: string[];
  risks: string[];
  opportunities: string[];
  recommendations: string[];
  importantStatistics: string[];
  keywords: string[];
  timeline: { time: string; details: string }[];
  technicalTerms: string[];
  definitions: { term: string; definition: string }[];
  frequentlyDiscussedTopics: { topic: string; mentionCount: number }[];
}

export interface ResearchPaperAnalysis {
  title: string;
  authors: string[];
  abstract: string;
  problemStatement: string;
  objectives: string[];
  methodology: string;
  dataset: string;
  algorithms: string[];
  results: string;
  limitations: string;
  futureScope: string;
  novelContributions: string[];
  referencesCount: number;
}

export interface CompanyDocumentAnalysis {
  executiveSummary: string;
  kpis: { name: string; value: string; trend: 'up' | 'down' | 'stable' }[];
  revenueHighlights: string;
  businessRisks: string[];
  growthOpportunities: string[];
  decisionsTaken: string[];
  deadlines: { date: string; task: string }[];
  financialInsights: string[];
  complianceIssues: string[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  fileType: FileType;
  sizeBytes: number;
  uploadedAt: string;
  author: string;
  department: Department;
  collection: string;
  securityLevel: SecurityLevel;
  status: 'indexing' | 'ready' | 'error';
  progress: number;
  chunksCount: number;
  tokensCount: number;
  pagesCount: number;
  version: string;
  tags: string[];
  summary?: string;
  keyInsights?: string[];
  rawText?: string;
  chunks?: DocumentChunk[];
  intelligentSummaries?: IntelligentSummaries;
  insightsEngineData?: InsightsEngineData;
  researchAnalysis?: ResearchPaperAnalysis;
  companyAnalysis?: CompanyDocumentAnalysis;
  flashcards?: Flashcard[];
  mcqs?: MCQ[];
}

export interface CollectionItem {
  id: string;
  name: string;
  description: string;
  department: Department;
  documentCount: number;
  totalSizeBytes: number;
  createdAt: string;
  color: string;
  iconName: string;
}

export interface SearchResult {
  id: string;
  documentId: string;
  documentName: string;
  fileType: FileType;
  department: Department;
  author: string;
  pageNumber: number;
  sectionHeader: string;
  snippet: string;
  score: number; // Cosine similarity e.g. 0.948
  chunkId: string;
  highlights: string[];
  createdAt: string;
}

export interface Citation {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber?: number;
  sectionHeader?: string;
  chunkContent: string;
  similarityScore: number;
  vectorId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: Citation[];
  suggestedFollowUps?: string[];
  modelUsed?: string;
  retrievalLatencyMs?: number;
  isStreaming?: boolean;
}

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
  collectionId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Analyst' | 'Editor' | 'Viewer';
  department: Department;
  avatarUrl: string;
  twoFactorEnabled: boolean;
  apiKeyCount: number;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Denied';
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  createdDate: string;
  lastUsed: string;
  environment: 'Production' | 'Staging' | 'Development';
  status: 'Active' | 'Revoked';
}

export interface ModelProviderConfig {
  defaultModel: string;
  openaiKeyConfigured: boolean;
  anthropicKeyConfigured: boolean;
  geminiKeyConfigured: boolean;
  vectorDbProvider: 'Pinecone' | 'Qdrant' | 'Weaviate' | 'ChromaDB' | 'FAISS Local';
  vectorDbStatus: 'Connected' | 'Indexing' | 'Idle';
  hybridWeight: number; // 0.0 to 1.0 (vector vs keyword)
  temperature: number;
  topKRetrieval: number;
}
