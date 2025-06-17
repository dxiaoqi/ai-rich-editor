// File system types
export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileNode[]
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

// Editor types
export interface EditorState {
  activeFileId: string | null
  content: string
  cursorPosition: number
  selection: {
    start: number
    end: number
  } | null
}

// Prediction types
export interface Prediction {
  type: 'expand' | 'delete' | 'replace'
  content: string
  position: {
    start: number
    end: number
  }
  confidence: number
  metadata?: Record<string, any>
}

// AI Context types
export interface UserAction {
  type: 'insert' | 'delete' | 'select' | 'cursor-move'
  timestamp: number
  position: number
  content?: string
  metadata?: Record<string, any>
}

export interface ContextChunk {
  id: string
  fileId: string
  content: string
  type: 'heading' | 'paragraph' | 'code' | 'list'
  level?: number // for headings
  language?: string // for code blocks
  embedding?: number[]
  metadata?: Record<string, any>
}

export interface BackgroundContext {
  chunks: ContextChunk[]
  relevanceScore: number
  timestamp: number
}