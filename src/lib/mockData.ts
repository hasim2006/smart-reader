import { DocumentItem, CollectionItem, ChatThread, UserProfile, SystemAuditLog, ApiKeyItem, ModelProviderConfig } from '@/types';

export const INITIAL_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-1',
    name: 'Executive & Financial Reports',
    description: 'Quarterly financial statements, earnings reports, SEC filings, and investor decks.',
    department: 'Finance',
    documentCount: 14,
    totalSizeBytes: 34500000,
    createdAt: '2026-01-15',
    color: 'from-blue-600 to-indigo-700',
    iconName: 'TrendingUp'
  },
  {
    id: 'col-2',
    name: 'Legal & Security Compliance',
    description: 'Enterprise security policies, ISO 27001 certifications, SOC2 audit reports, and contracts.',
    department: 'Legal',
    documentCount: 22,
    totalSizeBytes: 51200000,
    createdAt: '2026-02-01',
    color: 'from-teal-500 to-emerald-700',
    iconName: 'ShieldCheck'
  },
  {
    id: 'col-3',
    name: 'AI & Engineering R&D',
    description: 'Technical whitepapers, architecture specs, vector index benchmarks, and AI model evaluation notes.',
    department: 'R&D',
    documentCount: 31,
    totalSizeBytes: 89000000,
    createdAt: '2026-02-10',
    color: 'from-violet-600 to-purple-800',
    iconName: 'Cpu'
  },
  {
    id: 'col-4',
    name: 'HR & Operations',
    description: 'Employee onboarding handbook, remote work policies, benefit guides, and org hierarchy.',
    department: 'HR',
    documentCount: 18,
    totalSizeBytes: 24100000,
    createdAt: '2026-03-05',
    color: 'from-amber-500 to-orange-600',
    iconName: 'Users'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-101',
    name: 'Q3_2026_Financial_Earnings_Report.pdf',
    fileType: 'pdf',
    sizeBytes: 4210000,
    uploadedAt: '2026-07-28T14:30:00Z',
    author: 'Eleanor Vance (VP Finance)',
    department: 'Finance',
    collection: 'Executive & Financial Reports',
    securityLevel: 'Confidential',
    status: 'ready',
    progress: 100,
    chunksCount: 42,
    tokensCount: 18400,
    pagesCount: 16,
    version: 'v2.4',
    tags: ['Q3-Financials', 'Revenue', 'EBITDA', 'Earnings'],
    summary: 'Q3 2026 demonstrated a 28% year-over-year revenue increase reaching $142.5M. Operating margins expanded to 34% driven by cloud infrastructure optimizations and enterprise subscription growth.',
    keyInsights: [
      'Total ARR reached $570M, up 28% YoY.',
      'Enterprise tier Net Retention Rate (NRR) stabilized at 124%.',
      'Gross margin improved by 340 bps to 78.2% due to automated RAG indexing optimizations.',
      'R&D expenditures rose to $38.4M to fund next-gen multimodal vector search research.'
    ],
    rawText: `EXECUTIVE SUMMARY - Q3 2026 FINANCIAL EARNINGS REPORT
Track Report Technologies Inc. today reported financial results for the third quarter ended September 30, 2026.

REVENUE PERFORMANCE:
Quarterly revenue reached $142.5 million, representing a 28% increase compared to $111.3 million in Q3 2025. Enterprise subscription revenues accounted for 84% of total revenue ($119.7M), driven by customer expansion across Fortune 500 accounts.

MARGINS AND OPERATING EXPENSES:
GAAP Gross Margin was 78.2%, up from 74.8% in the prior year quarter. Non-GAAP Operating Income was $48.45 million, representing a 34% operating margin. Operating expenses were itemized as follows:
- Research & Development (R&D): $38.4 million (26.9% of revenue)
- Sales & Marketing (S&M): $36.2 million (25.4% of revenue)
- General & Administrative (G&A): $19.45 million (13.6% of revenue)

CAPITAL EXPENDITURES AND CASH FLOW:
Free Cash Flow (FCF) for Q3 was $41.2 million with total cash, equivalents, and short-term investments of $384.0 million. Capital expenditures totaled $8.6 million, primarily allocated to high-density GPU clusters for local embedding generation and FAISS vector indexing nodes.`,
    chunks: [
      {
        id: 'chk-101-1',
        documentId: 'doc-101',
        chunkIndex: 1,
        content: 'Quarterly revenue reached $142.5 million, representing a 28% increase compared to $111.3 million in Q3 2025. Enterprise subscription revenues accounted for 84% of total revenue ($119.7M), driven by customer expansion across Fortune 500 accounts.',
        pageNumber: 2,
        sectionHeader: 'Revenue Performance & Breakdown',
        tokenCount: 142,
        vectorId: 'vec-7741-a'
      },
      {
        id: 'chk-101-2',
        documentId: 'doc-101',
        chunkIndex: 2,
        content: 'GAAP Gross Margin was 78.2%, up from 74.8% in the prior year quarter. Non-GAAP Operating Income was $48.45 million, representing a 34% operating margin. Free Cash Flow (FCF) for Q3 reached $41.2 million with total cash reserves of $384.0 million.',
        pageNumber: 4,
        sectionHeader: 'Operating Margins & Cash Flow',
        tokenCount: 168,
        vectorId: 'vec-7741-b'
      },
      {
        id: 'chk-101-3',
        documentId: 'doc-101',
        chunkIndex: 3,
        content: 'Research & Development (R&D) investments increased to $38.4 million (26.9% of revenue) focused on high-density GPU clusters for local vector embedding generation and HNSW graph indexing.',
        pageNumber: 7,
        sectionHeader: 'R&D Investments & Infrastructure',
        tokenCount: 130,
        vectorId: 'vec-7741-c'
      }
    ]
  },
  {
    id: 'doc-102',
    name: 'Enterprise_Security_Compliance_Policy_2026.docx',
    fileType: 'docx',
    sizeBytes: 1850000,
    uploadedAt: '2026-06-12T09:15:00Z',
    author: 'Marcus Vance (CISO)',
    department: 'Legal',
    collection: 'Legal & Security Compliance',
    securityLevel: 'Restricted',
    status: 'ready',
    progress: 100,
    chunksCount: 36,
    tokensCount: 14200,
    pagesCount: 22,
    version: 'v4.1',
    tags: ['Security', 'ISO-27001', 'Encryption', 'Access-Control', 'GDPR'],
    summary: 'Outlines mandatory encryption standards (AES-256 at rest, TLS 1.3 in transit), strict Role-Based Access Control (RBAC), multi-factor authentication (MFA), and annual SOC 2 Type II audit compliance procedures for document vector indexes.',
    keyInsights: [
      'All customer document vectors must be encrypted with tenant-isolated KMS keys.',
      'Data retention policy mandates zero raw text caching in third-party LLM providers.',
      'SOC 2 Type II audits are scheduled semi-annually with automated vulnerability scans.',
      'Session tokens expire after 8 hours of inactivity with mandatory 2FA.'
    ],
    rawText: `SECTION 4.2 - DATA ENCRYPTION AND RETENTION PROTOCOLS
All corporate data stored within vector databases (including Pinecone, Qdrant, and local FAISS clusters) must enforce AES-256-GCM encryption at rest. In-transit data moving between API gateways and document parsers requires mandatory TLS 1.3 protocol.

TENANT ISOLATION AND ACCESS CONTROL:
Document chunks and vector embeddings are logically segregated by Organization ID and Collection Permissions. Role-Based Access Control (RBAC) enforces four tier permissions: Admin, Editor, Analyst, and Viewer.

LLM PRIVACY AND PROMPT SAFEGUARDS:
When generating contextual responses using external models (e.g. OpenAI GPT-4.1, Anthropic Claude 3.5, Google Gemini 1.5 Pro), raw documents must be sanitized using zero-retention API endpoints. Prompt payload logging is strictly restricted to metadata and anonymized vector IDs. Audit logs are preserved for 365 days.`,
    chunks: [
      {
        id: 'chk-102-1',
        documentId: 'doc-102',
        chunkIndex: 1,
        content: 'All corporate data stored within vector databases (including Pinecone, Qdrant, and local FAISS clusters) must enforce AES-256-GCM encryption at rest. In-transit data moving between API gateways requires mandatory TLS 1.3.',
        pageNumber: 5,
        sectionHeader: 'Section 4.2: Data Encryption & Retention',
        tokenCount: 155,
        vectorId: 'vec-8812-x'
      },
      {
        id: 'chk-102-2',
        documentId: 'doc-102',
        chunkIndex: 2,
        content: 'Role-Based Access Control (RBAC) enforces four tier permissions: Admin, Editor, Analyst, and Viewer. Document chunks are logically segregated by Organization ID and Collection permissions.',
        pageNumber: 8,
        sectionHeader: 'Section 5.1: Tenant Isolation & RBAC',
        tokenCount: 138,
        vectorId: 'vec-8812-y'
      },
      {
        id: 'chk-102-3',
        documentId: 'doc-102',
        chunkIndex: 3,
        content: 'When generating contextual responses, raw documents must be sanitized using zero-retention API endpoints. Audit logs recording document access and prompt queries are preserved for 365 days.',
        pageNumber: 12,
        sectionHeader: 'Section 6.4: LLM Safeguards & Audit Logs',
        tokenCount: 146,
        vectorId: 'vec-8812-z'
      }
    ]
  },
  {
    id: 'doc-103',
    name: 'Hybrid_Vector_RAG_Architecture_Paper.pdf',
    fileType: 'pdf',
    sizeBytes: 8900000,
    uploadedAt: '2026-07-04T11:20:00Z',
    author: 'Dr. Sophia Chen (Head of AI R&D)',
    department: 'R&D',
    collection: 'AI & Engineering R&D',
    securityLevel: 'Internal',
    status: 'ready',
    progress: 100,
    chunksCount: 68,
    tokensCount: 31200,
    pagesCount: 34,
    version: 'v1.0',
    tags: ['RAG', 'Vector-DB', 'HNSW', 'Reciprocal-Rank-Fusion', 'Embeddings'],
    summary: 'Research paper introducing Hybrid Reciprocal Rank Fusion (RRF) combining dense text-embedding-3-large vectors (1536d) with sparse BM25 lexical search, yielding a 94.2% MRR@10 benchmark accuracy across complex enterprise document sets.',
    keyInsights: [
      'Hybrid RRF outperforms dense-only vector search by 18.4% on domain-specific acronyms.',
      'Sliding window chunking (512 tokens with 64 token overlap) preserves cross-sentence context.',
      'Sub-second retrieval latency achieved via HNSW graph indexing with efSearch=128.',
      'Context compression reduces LLM prompt token consumption by 41% without recall loss.'
    ],
    rawText: `ABSTRACT & METHODOLOGY - HYBRID VECTOR RETRIEVAL ARCHITECTURE
Retrieval-Augmented Generation (RAG) platforms often suffer from keyword mismatch when relying solely on dense embedding vectors. We propose a multi-stage Hybrid Retrieval Engine combining BAAI BGE dense embeddings with BM25 sparse keyword indices via Reciprocal Rank Fusion (RRF).

CHUNK SEGMENTATION & OVERLAP:
Documents are parsed into semantic structural trees. Plain text is tokenized into sliding windows of 512 tokens with a 64-token stride. Tables are serialized into markdown matrix formats to preserve cell relationship topology during embedding generation.

BENCHMARK RESULTS:
On a test corpus of 100,000 enterprise PDF pages, Hybrid RRF achieved a Mean Reciprocal Rank (MRR@10) of 0.942, compared to 0.795 for dense-only vector search and 0.682 for sparse BM25 search. Average end-to-end retrieval latency was measured at 185 milliseconds using Qdrant vector database clusters.`,
    chunks: [
      {
        id: 'chk-103-1',
        documentId: 'doc-103',
        chunkIndex: 1,
        content: 'We propose a multi-stage Hybrid Retrieval Engine combining BAAI BGE dense embeddings with BM25 sparse keyword indices via Reciprocal Rank Fusion (RRF).',
        pageNumber: 3,
        sectionHeader: 'Abstract & RRF Methodology',
        tokenCount: 140,
        vectorId: 'vec-3319-m'
      },
      {
        id: 'chk-103-2',
        documentId: 'doc-103',
        chunkIndex: 2,
        content: 'Plain text is tokenized into sliding windows of 512 tokens with a 64-token stride. Tables are serialized into markdown matrix formats to preserve cell relationship topology.',
        pageNumber: 9,
        sectionHeader: 'Chunk Segmentation & Table Serialization',
        tokenCount: 152,
        vectorId: 'vec-3319-n'
      },
      {
        id: 'chk-103-3',
        documentId: 'doc-103',
        chunkIndex: 3,
        content: 'Hybrid RRF achieved a Mean Reciprocal Rank (MRR@10) of 0.942, compared to 0.795 for dense-only vector search. Average end-to-end retrieval latency was 185ms.',
        pageNumber: 18,
        sectionHeader: 'Benchmark Results & Latency',
        tokenCount: 160,
        vectorId: 'vec-3319-p'
      }
    ]
  },
  {
    id: 'doc-104',
    name: 'Employee_Onboarding_Handbook_2026.md',
    fileType: 'md',
    sizeBytes: 940000,
    uploadedAt: '2026-05-19T16:00:00Z',
    author: 'Sarah Jenkins (People Ops)',
    department: 'HR',
    collection: 'HR & Operations',
    securityLevel: 'Public',
    status: 'ready',
    progress: 100,
    chunksCount: 24,
    tokensCount: 9800,
    pagesCount: 14,
    version: 'v3.0',
    tags: ['HR', 'Onboarding', 'Benefits', 'Remote-Work', 'Workplace'],
    summary: 'Comprehensive guide covering benefits, health insurance, annual paid leave (25 days), learning stipends ($2,000/yr), remote home office setups, and internal IT helpdesk workflows.',
    keyInsights: [
      'Full-time employees receive 25 days PTO plus company holidays.',
      'Annual technology stipend of $2,000 for home workspace equipment.',
      '401(k) retirement matching up to 6% of base salary with immediate vesting.',
      'Flexible working hours with core collaboration window between 10am - 3pm EST.'
    ],
    rawText: `WELCOME TO TRACK REPORT - EMPLOYEE HANDBOOK
Section 2: Health, Wellness & Financial Benefits
Track Report offers comprehensive health insurance (medical, dental, vision) fully covered at 100% for employees and 80% for dependents.

VACATION AND PAID TIME OFF (PTO):
All regular full-time team members receive 25 days of flexible PTO per calendar year, plus 11 recognized company holidays. Unused PTO up to 5 days can roll over into the following year.

LEARNING STIPEND & HOME OFFICE SETUP:
Every team member receives an annual learning stipend of $2,000 USD to spend on books, courses, or technical conferences. Additionally, new hires receive a one-time $2,000 home office workstation allowance upon joining.`,
    chunks: [
      {
        id: 'chk-104-1',
        documentId: 'doc-104',
        chunkIndex: 1,
        content: 'All regular full-time team members receive 25 days of flexible PTO per calendar year, plus 11 recognized company holidays. Unused PTO up to 5 days can roll over into the following year.',
        pageNumber: 4,
        sectionHeader: 'Vacation & PTO Policy',
        tokenCount: 135,
        vectorId: 'vec-1102-a'
      },
      {
        id: 'chk-104-2',
        documentId: 'doc-104',
        chunkIndex: 2,
        content: 'Every team member receives an annual learning stipend of $2,000 USD for professional development. Additionally, new hires receive a one-time $2,000 home office workstation allowance.',
        pageNumber: 6,
        sectionHeader: 'Stipends & Equipment',
        tokenCount: 141,
        vectorId: 'vec-1102-b'
      }
    ]
  },
  {
    id: 'doc-105',
    name: 'Customer_Support_Interactions_Q2.csv',
    fileType: 'csv',
    sizeBytes: 3100000,
    uploadedAt: '2026-07-15T08:45:00Z',
    author: 'David Ross (Customer Success)',
    department: 'Sales',
    collection: 'Executive & Financial Reports',
    securityLevel: 'Internal',
    status: 'ready',
    progress: 100,
    chunksCount: 30,
    tokensCount: 12500,
    pagesCount: 8,
    version: 'v1.2',
    tags: ['CSV', 'Support', 'Customer-Feedback', 'CSAT', 'Tickets'],
    summary: 'Structured customer support logs analyzing 1,200 support tickets. CSAT average was 4.85/5.0 with document processing speed cited as top customer delight factor.',
    keyInsights: [
      'Average ticket resolution time decreased from 4.2 hours to 1.1 hours after RAG auto-reply.',
      '92% of tickets resolved on first contact.',
      'Top requested feature: Real-time Excel table cell parsing and formula index.'
    ],
    rawText: `TicketID,Date,CustomerName,IssueType,SatisfactionScore,ResolutionTimeHours
TK-901,2026-06-01,Acme Corp,Vector Index Sync,5,0.4
TK-902,2026-06-02,Vertex Inc,PDF OCR Table Format,5,0.8
TK-903,2026-06-03,CloudScale,API Rate Limit Upgrade,4,1.2
TK-904,2026-06-05,BioTech Labs,SSO Authentication,5,0.5`,
    chunks: [
      {
        id: 'chk-105-1',
        documentId: 'doc-105',
        chunkIndex: 1,
        content: 'Ticket resolution time averaged 1.1 hours in Q2 2026 with an overall CSAT score of 4.85/5.0 across 1,200 enterprise tickets.',
        pageNumber: 1,
        sectionHeader: 'Support Metrics Overview',
        tokenCount: 120,
        vectorId: 'vec-9012-a'
      }
    ]
  }
];

export const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'th-1',
    title: 'Q3 Revenue & Margin Performance Analysis',
    updatedAt: '2026-08-04T18:30:00Z',
    collectionId: 'col-1',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'What was our total revenue growth in Q3 2026, and what contributed to the margin expansion?',
        timestamp: '18:29 PM'
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `Based on the official **Q3 2026 Financial Earnings Report**, here is the breakdown:

### 1. Revenue Growth
- **Total Quarterly Revenue**: **$142.5 million**, representing a **28% year-over-year increase** compared to $111.3 million in Q3 2025 [Doc: Q3_2026_Financial_Earnings_Report.pdf, p. 2].
- **Enterprise Subscriptions**: Accounted for **84% of total revenue** ($119.7 million), driven by expansion across Fortune 500 accounts.

### 2. Gross Margin & Operating Margin Expansion
- **GAAP Gross Margin**: Reached **78.2%**, up 340 bps from 74.8% in Q3 2025 [Doc: Q3_2026_Financial_Earnings_Report.pdf, p. 4].
- **Operating Margin**: Reached **34%** ($48.45M non-GAAP operating income).

### Key Drivers:
1. **Infrastructure Optimization**: Automated vector embedding & HNSW indexing reduced per-token processing costs [Doc: Q3_2026_Financial_Earnings_Report.pdf, p. 7].
2. **High Net Retention**: Enterprise Net Retention Rate (NRR) stabilized at **124%**.`,
        timestamp: '18:30 PM',
        modelUsed: 'OpenAI GPT-4.1 Enterprise',
        retrievalLatencyMs: 410,
        citations: [
          {
            id: 'cit-1',
            documentId: 'doc-101',
            documentName: 'Q3_2026_Financial_Earnings_Report.pdf',
            pageNumber: 2,
            sectionHeader: 'Revenue Performance & Breakdown',
            chunkContent: 'Quarterly revenue reached $142.5 million, representing a 28% increase compared to $111.3 million in Q3 2025. Enterprise subscription revenues accounted for 84% of total revenue ($119.7M).',
            similarityScore: 0.962,
            vectorId: 'vec-7741-a'
          },
          {
            id: 'cit-2',
            documentId: 'doc-101',
            documentName: 'Q3_2026_Financial_Earnings_Report.pdf',
            pageNumber: 4,
            sectionHeader: 'Operating Margins & Cash Flow',
            chunkContent: 'GAAP Gross Margin was 78.2%, up from 74.8% in the prior year quarter. Non-GAAP Operating Income was $48.45 million, representing a 34% operating margin.',
            similarityScore: 0.948,
            vectorId: 'vec-7741-b'
          }
        ],
        suggestedFollowUps: [
          'What were the primary R&D expenditures in Q3?',
          'What is the projected free cash flow for Q4?',
          'Compare Q3 revenue with Q2 results.'
        ]
      }
    ]
  },
  {
    id: 'th-2',
    title: 'Security Encryption & Audit Compliance',
    updatedAt: '2026-08-02T14:10:00Z',
    collectionId: 'col-2',
    messages: [
      {
        id: 'msg-10',
        role: 'user',
        content: 'What encryption standards are mandated for stored document vectors and audit logs?',
        timestamp: '14:10 PM'
      },
      {
        id: 'msg-11',
        role: 'assistant',
        content: `According to the **Enterprise Security Compliance Policy 2026**:

- **At-Rest Encryption**: All vector database indices (Pinecone, Qdrant, FAISS) must enforce **AES-256-GCM encryption** at rest using tenant-isolated KMS keys [Doc: Enterprise_Security_Compliance_Policy_2026.docx, p. 5].
- **In-Transit Encryption**: API communications mandate **TLS 1.3 protocol** [Doc: Enterprise_Security_Compliance_Policy_2026.docx, p. 5].
- **Audit Log Retention**: Audit records tracking document access, RBAC permission changes, and queries are preserved for **365 days** [Doc: Enterprise_Security_Compliance_Policy_2026.docx, p. 12].`,
        timestamp: '14:10 PM',
        modelUsed: 'Anthropic Claude 3.5 Sonnet',
        retrievalLatencyMs: 380,
        citations: [
          {
            id: 'cit-10',
            documentId: 'doc-102',
            documentName: 'Enterprise_Security_Compliance_Policy_2026.docx',
            pageNumber: 5,
            sectionHeader: 'Section 4.2: Data Encryption & Retention',
            chunkContent: 'All corporate data stored within vector databases (including Pinecone, Qdrant, and local FAISS clusters) must enforce AES-256-GCM encryption at rest.',
            similarityScore: 0.975,
            vectorId: 'vec-8812-x'
          }
        ],
        suggestedFollowUps: [
          'What are the four RBAC permission tiers?',
          'How does the system handle prompt payload logging?'
        ]
      }
    ]
  }
];

export const CURRENT_USER: UserProfile = {
  id: 'usr-9901',
  name: 'Alexandra Wright',
  email: 'alexandra.wright@enterprise.ai',
  role: 'Admin',
  department: 'Executive',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  twoFactorEnabled: true,
  apiKeyCount: 4
};

export const AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-04T18:42:10Z',
    user: 'Alexandra Wright (Admin)',
    action: 'Document Vector Re-index',
    resource: 'Q3_2026_Financial_Earnings_Report.pdf',
    ipAddress: '192.168.1.145',
    status: 'Success'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-04T17:15:33Z',
    user: 'Marcus Vance (CISO)',
    action: 'API Key Revocation',
    resource: 'prod-internal-ingest-v2',
    ipAddress: '10.0.4.12',
    status: 'Success'
  },
  {
    id: 'log-3',
    timestamp: '2026-08-04T15:20:00Z',
    user: 'Dr. Sophia Chen (R&D)',
    action: 'Collection Created',
    resource: 'AI & Engineering R&D',
    ipAddress: '172.16.0.88',
    status: 'Success'
  },
  {
    id: 'log-4',
    timestamp: '2026-08-04T12:05:44Z',
    user: 'Anonymous Guest',
    action: 'Unauthorized Access Attempt',
    resource: 'Restricted Legal Policy',
    ipAddress: '198.51.100.44',
    status: 'Denied'
  }
];

export const API_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'Production RAG Ingestion Pipeline',
    keyPrefix: 'omni_live_9f82...',
    createdDate: '2026-01-10',
    lastUsed: '2 minutes ago',
    environment: 'Production',
    status: 'Active'
  },
  {
    id: 'key-2',
    name: 'Staging Qdrant Index Sync',
    keyPrefix: 'omni_stg_4a11...',
    createdDate: '2026-03-22',
    lastUsed: '1 hour ago',
    environment: 'Staging',
    status: 'Active'
  },
  {
    id: 'key-3',
    name: 'Dev Local FAISS Vector Search',
    keyPrefix: 'omni_dev_8820...',
    createdDate: '2026-05-01',
    lastUsed: '3 days ago',
    environment: 'Development',
    status: 'Active'
  }
];

export const DEFAULT_MODEL_CONFIG: ModelProviderConfig = {
  defaultModel: 'OpenAI GPT-4.1 Enterprise',
  openaiKeyConfigured: true,
  anthropicKeyConfigured: true,
  geminiKeyConfigured: true,
  vectorDbProvider: 'Qdrant',
  vectorDbStatus: 'Connected',
  hybridWeight: 0.7, // 70% vector, 30% BM25 keyword
  temperature: 0.2,
  topKRetrieval: 5
};
