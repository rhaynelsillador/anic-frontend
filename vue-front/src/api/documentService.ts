import api from './ajax'

export interface DocumentResponse {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
  publish: boolean
  draft: boolean
  createdAt: string
  updatedAt: string
}

export interface DocumentsApiResponse {
  data: DocumentResponse[]
  status: string
  message: string
  code: number
  page: {
    totalCount: number
    currentPage: number
  }
}

export interface CreateDocumentRequest {
  title: string
  content: string
  category: string
  tags: string[]
  isPublished: boolean
}

export interface UpdateDocumentRequest extends CreateDocumentRequest {
  id: number
}

export const documentService = {
  // Create a new document
  async createDocument(document: CreateDocumentRequest): Promise<DocumentResponse> {
    const response = await api.post('/api/v1/documents', document)
    return response.data
  },

  // Update an existing document
  async updateDocument(id: number, document: CreateDocumentRequest): Promise<DocumentResponse> {
    const response = await api.put(`/api/v1/documents/${id}`, document)
    return response.data
  },

  // Get a document by ID
  async getDocument(id: number): Promise<DocumentResponse> {
    const response = await api.get(`/api/v1/documents/${id}`)
    return response.data.data
  },

  // Get all documents with pagination
  async getDocuments(params?: {
    page?: number
    size?: number
    sort?: string
    [key: string]: any // For filter parameters
  }): Promise<DocumentsApiResponse> {
    const response = await api.get('/api/v1/documents', { params })
    return response.data
  },

  // Delete a document
  async deleteDocument(id: number): Promise<void> {
    await api.delete(`/api/v1/documents/${id}`)
  }
}
