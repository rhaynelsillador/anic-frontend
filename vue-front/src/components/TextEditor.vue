<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

declare global {
  interface Window {
    tinymce: any;
  }
}

// Props
interface Props {
  modelValue?: string
  placeholder?: string
  height?: number
  readonly?: boolean
  toolbar?: string
  plugins?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Start typing...',
  height: 400,
  readonly: false,
  toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
  plugins: () => [
    'advlist', 'autolink', 'lists', 'link', 'charmap',
    'anchor', 'searchreplace', 'code', 'fullscreen',
    'insertdatetime', 'table', 'wordcount'
  ]
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': [content: string]
  'change': [content: string]
}>()

const editorRef = ref<HTMLTextAreaElement>()
const editorInstance = ref<any>(null)
const isLoading = ref<boolean>(true)

const initTinyMCE = () => {
  if (window.tinymce && editorRef.value) {
    window.tinymce.init({
      target: editorRef.value,
      base_url: '/tinymce',
      suffix: '.min',
      height: props.height,
      menubar: false,
      plugins: props.plugins,
      toolbar: props.toolbar,
      placeholder: props.placeholder,
      readonly: props.readonly,
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      setup: (editor: any) => {
        editorInstance.value = editor
        editor.on('init', () => {
          editor.setContent(props.modelValue)
          isLoading.value = false
        })
        editor.on('change keyup', () => {
          const content = editor.getContent()
          emit('update:modelValue', content)
          emit('change', content)
        })
      }
    })
  }
}

const loadTinyMCE = () => {
  const script = document.createElement('script')
  script.src = '/tinymce/tinymce.min.js'
  script.onload = () => {
    initTinyMCE()
  }
  document.head.appendChild(script)
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (editorInstance.value && newValue !== editorInstance.value.getContent()) {
    editorInstance.value.setContent(newValue || '')
  }
})

// Watch for readonly changes
watch(() => props.readonly, (newValue) => {
  if (editorInstance.value) {
    editorInstance.value.setMode(newValue ? 'readonly' : 'design')
  }
})

onMounted(() => {
  if (window.tinymce) {
    initTinyMCE()
  } else {
    loadTinyMCE()
  }
})

onUnmounted(() => {
  if (editorInstance.value) {
    window.tinymce.remove(editorInstance.value)
  }
})

// Method to get current content
const getContent = () => {
  return editorInstance.value ? editorInstance.value.getContent() : ''
}

// Method to get content length
const getContentLength = () => {
  if (editorInstance.value) {
    return editorInstance.value.getContent({ format: 'text' }).length
  }
  return 0
}

// Method to clear content
const clearContent = () => {
  if (editorInstance.value) {
    editorInstance.value.setContent('')
    emit('update:modelValue', '')
    emit('change', '')
  }
}

// Method to submit content
const submitContent = () => {
  const content = getContent()
  emit('submit', content)
}

// Expose methods for parent components
defineExpose({
  getContent,
  getContentLength,
  clearContent,
  submitContent
})
</script>

<template>
  <div>
    <div v-if="isLoading" class="text-center p-4">
      Loading editor...
    </div>
    <textarea ref="editorRef"></textarea>
  </div>
</template>
