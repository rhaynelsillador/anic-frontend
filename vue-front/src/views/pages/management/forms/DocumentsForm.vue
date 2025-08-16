<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import TextEditor from '@/components/TextEditor.vue'
import { documentService, type CreateDocumentRequest, type DocumentResponse } from '@/api/documentService'

// Props for editing mode
interface Props {
  documentId?: number
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const toast = useToast()

// Form data interface
interface DocumentForm {
  title: string
  content: string
  category: string
  tags: string[]
  isPublished: boolean
}

// Form reactive data
const form = ref<DocumentForm>({
  title: '',
  content: '',
  category: '',
  tags: [],
  isPublished: false
})

// Additional state
const isEditMode = ref(false)
const currentDocumentId = ref<number | null>(null)
const isLoading = ref(false)

// Form validation
const errors = ref<Record<string, string>>({})

// Available categories
const categories = ref([
  { label: 'General', value: 'general' },
  { label: 'Policy', value: 'policy' },
  { label: 'Procedure', value: 'procedure' },
  { label: 'Guidelines', value: 'guidelines' },
  { label: 'Training', value: 'training' }
])

// Tag input
const newTag = ref('')

// Loading state
const isSubmitting = ref(false)

// Editor reference
const editorRef = ref<InstanceType<typeof TextEditor>>()

// Validation function
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
  }
  
  if (!form.value.content.trim()) {
    errors.value.content = 'Content is required'
  }
  
  if (!form.value.category) {
    errors.value.category = 'Category is required'
  }
  
  return Object.keys(errors.value).length === 0
}

// Add tag function
const addTag = () => {
  if (newTag.value.trim()) {
    // Ensure tags array exists and is an array
    if (!Array.isArray(form.value.tags)) {
      form.value.tags = []
    }
    
    // Check if tag doesn't already exist
    if (!form.value.tags.includes(newTag.value.trim())) {
      form.value.tags.push(newTag.value.trim())
      newTag.value = ''
    }
  }
}

// Remove tag function
const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
}

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Get the latest content from the editor
    const editorContent = editorRef.value?.getContent() || ''
    form.value.content = editorContent
    
    // Prepare the request data
    const documentData: CreateDocumentRequest = {
      title: form.value.title,
      content: form.value.content,
      category: form.value.category,
      tags: form.value.tags,
      isPublished: form.value.isPublished
    }
    
    let response: DocumentResponse
    
    if (isEditMode.value && currentDocumentId.value) {
      // Update existing document
      response = await documentService.updateDocument(currentDocumentId.value, documentData)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Document updated successfully!',
        life: 3000
      })
    } else {
      // Create new document
      response = await documentService.createDocument(documentData)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Document created successfully!',
        life: 3000
      })
      
      // Update state to edit mode
      isEditMode.value = true
      currentDocumentId.value = response.id
    }
    
    // Optionally redirect to documents list
    // router.push('/documents')
    
  } catch (error: any) {
    console.error('Error saving document:', error)
    
    // Handle specific error types
    if (error.response?.status === 422) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please check your input data.',
        life: 5000
      })
    } else if (error.response?.status === 401) {
      toast.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'Please log in again.',
        life: 5000
      })
    } else if (error.response?.status === 403) {
      toast.add({
        severity: 'error',
        summary: 'Permission Error',
        detail: 'You do not have permission to perform this action.',
        life: 5000
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error saving document. Please try again.',
        life: 5000
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

// Reset form
const resetForm = () => {
  form.value = {
    title: '',
    content: '',
    category: '',
    tags: [],
    isPublished: false
  }
  errors.value = {}
  editorRef.value?.clearContent()
}

// Save as draft
const saveAsDraft = async () => {
  form.value.isPublished = false
  await submitForm()
}

// Publish document
const publishDocument = async () => {
  form.value.isPublished = true
  await submitForm()
}

// Handle content change from editor
const handleContentChange = (content: string) => {
  form.value.content = content
  if (errors.value.content && content.trim()) {
    delete errors.value.content
  }
}

// Load existing document for editing
const loadDocument = async (id: number) => {
  isLoading.value = true
  try {
    const document = await documentService.getDocument(id)
    
    form.value = {
      title: document.title || '',
      content: document.content || '',
      category: document.category || '',
      tags: Array.isArray(document.tags) ? document.tags : [], // Ensure it's always an array
      isPublished: document.publish || false // Map 'publish' field to 'isPublished'
    }
    
    isEditMode.value = true
    currentDocumentId.value = document.id
    
  } catch (error: any) {
    console.error('Error loading document:', error)
    
    if (error.response?.status === 404) {
      toast.add({
        severity: 'error',
        summary: 'Not Found',
        detail: 'Document not found.',
        life: 5000
      })
      router.push('/management/documents')
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error loading document. Please try again.',
        life: 5000
      })
    }
  } finally {
    isLoading.value = false
  }
}

// Initialize component
onMounted(async () => {
  // Check if editing existing document
  // Try to get ID from props, route params, or query params
  const documentId = props.documentId || 
                    Number(route.params.id) || 
                    Number(route.query.id)
  
  if (documentId && !isNaN(documentId)) {
    await loadDocument(documentId)
  }else{
    form.value.title = route.query.title || ''
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 card">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-2 text-gray-600">Loading document...</p>
    </div>

    <!-- Form Content -->
    <div v-else>
      <h1 class="text-2xl font-bold mb-6">
        {{ isEditMode ? 'Edit Document' : 'Create New Document' }}
      </h1>
      
      <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Title Field -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Enter document title"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.title }"
        />
        <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
      </div>

      <!-- Category Field -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          id="category"
          v-model="form.category"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.category }"
        >
          <option value="">Select a category</option>
          <option
            v-for="category in categories"
            :key="category.value"
            :value="category.value"
          >
            {{ category.label }}
          </option>
        </select>
        <p v-if="errors.category" class="text-red-500 text-sm mt-1">{{ errors.category }}</p>
      </div>

      <!-- Tags Field -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div class="space-y-2">
          <!-- Add Tag Input -->
          <div class="flex gap-2">
            <input
              v-model="newTag"
              type="text"
              placeholder="Add a tag"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="addTag"
            />
            <button
              type="button"
              @click="addTag"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          
          <!-- Display Tags -->
          <div v-if="form.tags && form.tags.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="(tag, index) in form.tags"
              :key="index"
              class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {{ tag }}
              <button
                type="button"
                @click="removeTag(index)"
                class="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
              >
                ×
              </button>
            </span>
          </div>
        </div>
      </div>

      <!-- Content Field -->
      <div>
        <label for="editorRef" class="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <TextEditor
          ref="editorRef"
          v-model="form.content"
          :height="300"
          placeholder="Enter document content..."
          @change="handleContentChange"
        />
        <p v-if="errors.content" class="text-red-500 text-sm mt-1">{{ errors.content }}</p>
      </div>

      <!-- Published Status -->
      <div>
        <label class="flex items-center space-x-2">
          <input
            v-model="form.isPublished"
            type="checkbox"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-sm font-medium text-gray-700">
            Publish document immediately
          </span>
        </label>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          @click="resetForm"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          :disabled="isSubmitting"
        >
          Reset
        </button>
        <button
          type="button"
          @click="saveAsDraft"
          class="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          :disabled="isSubmitting"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Document' : (form.isPublished ? 'Publish' : 'Save')) }}
        </button>
      </div>
    </form>
    </div>
  </div>
</template>