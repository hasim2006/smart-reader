import { DocumentItem, DocumentChunk, SearchResult, Citation, ChatMessage, FileType, Department } from '@/types';

// Helper to calculate mock cosine similarity between query and text
function calculateSimilarity(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const textLower = text.toLowerCase();
  
  if (queryWords.length === 0) return 0.5;
  
  let matches = 0;
  queryWords.forEach(word => {
    if (textLower.includes(word)) {
      matches += 1;
    }
  });

  const baseScore = 0.65 + (matches / queryWords.length) * 0.32;
  return Math.min(0.985, Math.max(0.62, Number(baseScore.toFixed(3))));
}

// Generate mock 1536-dimensional embedding vector snippet (for visual inspection UI)
export function generateMockEmbedding(): number[] {
  const embedding: number[] = [];
  for (let i = 0; i < 8; i++) {
    const val = (Math.random() * 2 - 1) * 0.08;
    embedding.push(Number(val.toFixed(4)));
  }
  return embedding;
}

// Interactive Ingestion Engine
export function createIngestedDocument(
  fileName: string,
  fileSize: number,
  rawContent?: string,
  dept: Department = 'Finance'
): DocumentItem {
  const fileExt = fileName.split('.').pop()?.toLowerCase() || 'pdf';
  const fileType: FileType = (['pdf', 'docx', 'pptx', 'txt', 'md', 'csv', 'xlsx'].includes(fileExt)
    ? fileExt
    : 'pdf') as FileType;

  const docId = `doc-${Date.now()}`;
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  
  const textContent = rawContent || `DOCUMENT CONTENT FOR ${baseName.toUpperCase()}
This document contains enterprise guidelines, performance data, and operational specifications for ${baseName}.

1. OVERVIEW AND OBJECTIVES
The objective of this document is to clarify corporate procedures, index key metrics, and support Retrieval-Augmented Generation (RAG) search indexing.

2. METRICS AND PERFORMANCE
Performance indicators reflect consistent expansion. All document chunks generated from this file inherit strict access permissions and KMS encryption at rest.

3. COMPLIANCE & ARCHIVE PROTOCOL
All vector embeddings are indexed into HNSW graphs with dual-key authentication and 365-day security audit logging.`;

  // Create semantic chunks
  const paragraphs = textContent.split('\n\n').filter(p => p.trim().length > 0);
  const chunks: DocumentChunk[] = paragraphs.map((para, idx) => ({
    id: `chk-${docId}-${idx + 1}`,
    documentId: docId,
    chunkIndex: idx + 1,
    content: para.trim(),
    pageNumber: Math.floor(idx / 2) + 1,
    sectionHeader: para.startsWith('1.') ? '1. Overview' : para.startsWith('2.') ? '2. Metrics' : 'General Specification',
    tokenCount: Math.round(para.length / 4),
    vectorId: `vec-${Math.floor(Math.random() * 8999 + 1000)}-${idx}`,
    embeddingSnippet: generateMockEmbedding()
  }));

  return {
    id: docId,
    name: fileName,
    fileType,
    sizeBytes: fileSize || 2450000,
    uploadedAt: new Date().toISOString(),
    author: 'Current User',
    department: dept,
    collection: 'Executive & Financial Reports',
    securityLevel: 'Internal',
    status: 'ready',
    progress: 100,
    chunksCount: chunks.length,
    tokensCount: chunks.reduce((acc, c) => acc + c.tokenCount, 0),
    pagesCount: Math.ceil(chunks.length / 2),
    version: 'v1.0',
    tags: [fileType.toUpperCase(), 'Newly-Uploaded', 'Indexed'],
    summary: `Automatically parsed ${fileName}. Contains ${chunks.length} semantic chunks covering operational specifications, metrics, and enterprise compliance.`,
    keyInsights: [
      `Extracted ${chunks.reduce((acc, c) => acc + c.tokenCount, 0)} total tokens across ${Math.ceil(chunks.length / 2)} pages.`,
      `Vector index created with 1536-dimensional embeddings.`,
      `Verified clean OCR & table structure hierarchy.`
    ],
    rawText: textContent,
    chunks
  };
}

// Vector & Hybrid Search Engine
export function searchVectorDatabase(
  query: string,
  documents: DocumentItem[],
  filters?: {
    department?: string;
    fileType?: string;
    securityLevel?: string;
    minScore?: number;
  }
): SearchResult[] {
  if (!query.trim()) return [];
  
  const results: SearchResult[] = [];

  documents.forEach(doc => {
    // Apply basic metadata filters
    if (filters?.department && filters.department !== 'All' && doc.department !== filters.department) return;
    if (filters?.fileType && filters.fileType !== 'All' && doc.fileType !== filters.fileType) return;
    if (filters?.securityLevel && filters.securityLevel !== 'All' && doc.securityLevel !== filters.securityLevel) return;

    const docChunks = doc.chunks || [];
    docChunks.forEach(chunk => {
      const score = calculateSimilarity(query, chunk.content + ' ' + doc.name + ' ' + (chunk.sectionHeader || ''));
      const minThresh = filters?.minScore || 0.60;
      
      if (score >= minThresh) {
        results.push({
          id: `sr-${chunk.id}`,
          documentId: doc.id,
          documentName: doc.name,
          fileType: doc.fileType,
          department: doc.department,
          author: doc.author,
          pageNumber: chunk.pageNumber || 1,
          sectionHeader: chunk.sectionHeader || 'General Section',
          snippet: chunk.content,
          score,
          chunkId: chunk.id,
          highlights: query.toLowerCase().split(/\s+/).filter(w => w.length > 2),
          createdAt: doc.uploadedAt
        });
      }
    });
  });

  // Sort by highest score first
  return results.sort((a, b) => b.score - a.score);
}

// RAG AI Response Engine with Stream Simulation support
export function generateRAGResponse(
  userQuery: string,
  retrievedResults: SearchResult[],
  documents: DocumentItem[],
  modelName: string = 'OpenAI GPT-4.1 Enterprise'
): { content: string; citations: Citation[]; followUps: string[] } {
  if (retrievedResults.length === 0) {
    return {
      content: `I analyzed your query **"${userQuery}"** across the active vector index, but no matching context chunks exceeded the retrieval confidence threshold (0.60).

### Suggestions:
- Try broadening your search terms or removing department filters.
- Ensure the relevant document (PDF, DOCX, CSV) has been indexed under Document Management.
- Upload additional context files to the collection.`,
      citations: [],
      followUps: [
        'How do I upload new documents to this workspace?',
        'What documents are currently indexed in the system?',
        'Can you perform a global hybrid search across all collections?'
      ]
    };
  }

  // Top matching results for citation
  const topCitations: Citation[] = retrievedResults.slice(0, 3).map((res, i) => ({
    id: `cit-${Date.now()}-${i}`,
    documentId: res.documentId,
    documentName: res.documentName,
    pageNumber: res.pageNumber,
    sectionHeader: res.sectionHeader,
    chunkContent: res.snippet,
    similarityScore: res.score,
    vectorId: `vec-${res.chunkId}`
  }));

  const primaryDoc = retrievedResults[0];
  const secondDoc = retrievedResults[1];

  let answerText = `Based on your enterprise documents, here is the synthesis for **"${userQuery}"**:

### Executive Findings
1. **Primary Context Match**: According to **${primaryDoc.documentName}** (Section: *${primaryDoc.sectionHeader}*), ${primaryDoc.snippet.slice(0, 160)}... [Doc: ${primaryDoc.documentName}, p. ${primaryDoc.pageNumber}].
`;

  if (secondDoc && secondDoc.documentName !== primaryDoc.documentName) {
    answerText += `2. **Cross-Document Correlation**: Furthermore, **${secondDoc.documentName}** notes that ${secondDoc.snippet.slice(0, 140)}... [Doc: ${secondDoc.documentName}, p. ${secondDoc.pageNumber}].\n`;
  }

  answerText += `\n### Key Takeaways & Recommendations
- **Recall Precision**: Retrieved with a **${(primaryDoc.score * 100).toFixed(1)}% vector similarity match** via ${modelName}.
- **Access Level**: Verified under **${primaryDoc.department}** domain access control protocols.
- **Audit Verification**: Vector snippet hash \`${primaryDoc.chunkId}\` confirmed intact.`;

  const followUps = [
    `Can you elaborate on the details from ${primaryDoc.documentName}?`,
    'Summarize the financial and security implications of this response.',
    'Compare this answer with our annual compliance policy.'
  ];

  return {
    content: answerText,
    citations: topCitations,
    followUps
  };
}

// Separate typed AI Document Intelligence Generators
export function generateDocSummary(doc: DocumentItem) {
  return {
    title: `Executive Summary: ${doc.name}`,
    overview: doc.summary || `${doc.name} contains ${doc.chunksCount} indexed semantic chunks across ${doc.pagesCount} pages.`,
    keyPoints: doc.keyInsights || [
      `Extracted ${doc.tokensCount} tokens with ${doc.securityLevel} authorization.`,
      `Author: ${doc.author} | Department: ${doc.department}`,
      `Vector DB Status: HNSW Graph Index Active.`
    ],
    recommendations: [
      'Review annual compliance standards referenced in section 4.',
      'Ensure KMS encryption keys are rotated semi-annually.'
    ]
  };
}

export function generateDocFaqs(doc: DocumentItem) {
  return [
    {
      question: `What is the primary purpose of ${doc.name}?`,
      answer: `${doc.summary || 'Outlines core operational and technical guidelines.'}`
    },
    {
      question: `Who authorized this document and what is its security level?`,
      answer: `Authored by ${doc.author} for the ${doc.department} department under ${doc.securityLevel} security classification.`
    },
    {
      question: `How many vector chunks were generated from this file?`,
      answer: `${doc.chunksCount} semantic chunks were generated with an average window size of 512 tokens.`
    }
  ];
}

export function generateDocRisks(doc: DocumentItem) {
  return [
    {
      severity: 'Medium',
      category: 'Data Retention',
      description: 'Third-party API calls must verify zero-retention compliance.'
    },
    {
      severity: 'Low',
      category: 'Version Control',
      description: `Current version is ${doc.version}. Ensure deprecated copies are archived.`
    }
  ];
}

// Document Comparison Diff Engine
export function compareTwoDocuments(docA: DocumentItem, docB: DocumentItem) {
  return {
    docAName: docA.name,
    docBName: docB.name,
    similarityScore: docA.department === docB.department ? 0.94 : 0.82,
    metricsComparison: [
      { metric: 'File Format', docA: docA.fileType.toUpperCase(), docB: docB.fileType.toUpperCase(), match: docA.fileType === docB.fileType },
      { metric: 'Total Chunks', docA: `${docA.chunksCount} chunks`, docB: `${docB.chunksCount} chunks`, match: docA.chunksCount === docB.chunksCount },
      { metric: 'Total Tokens', docA: `${docA.tokensCount.toLocaleString()}`, docB: `${docB.tokensCount.toLocaleString()}`, match: false },
      { metric: 'Security Level', docA: docA.securityLevel, docB: docB.securityLevel, match: docA.securityLevel === docB.securityLevel },
      { metric: 'Department Scope', docA: docA.department, docB: docB.department, match: docA.department === docB.department }
    ],
    keyDifferences: [
      `${docA.name} emphasizes ${docA.department} operations, whereas ${docB.name} focuses on ${docB.department}.`,
      `${docA.name} contains ${docA.pagesCount} pages vs ${docB.pagesCount} pages in ${docB.name}.`,
      `Token density in ${docA.name} is higher by ${Math.abs(docA.tokensCount - docB.tokensCount)} tokens.`
    ],
    contradictions: [
      `Potential discrepancy in access policy between ${docA.securityLevel} (${docA.name}) and ${docB.securityLevel} (${docB.name}).`
    ]
  };
}
