<template>
    <Toolbar class="mb-6">
        <template #start>
            <Button label="New Document" icon="pi pi-plus" severity="primary" class="mr-2"
                @click="() => { router.push('/management/documents/form') }" />
        </template>

        <template #end>
            <Button icon="pi pi-refresh" rounded raised @click="reloadData" />
        </template>
    </Toolbar>
    <div class="card">
        <DataTable v-model:filters="filters" :value="documents" paginator lazy :rows="10" dataKey="id"
            filterDisplay="row" :globalFilterFields="['title', 'category', 'tags']" :loading="loading"
            @lazyLoad="loadDocumentsLazy" @page="onPage" @filter="loadDocumentsLazy" @sort="loadDocumentsLazy"
            :rowsPerPageOptions="[10, 25, 50]" :totalRecords="totalRecords" sortMode="single">

            <template #empty> No documents found. </template>
            <template #loading> Loading documents data. Please wait. </template>
            
            <Column field="title" header="Title" style="min-width: 15rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    <div class="font-medium">{{ data.title }}</div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Title" />
                </template>
            </Column>
            
            <Column field="category" header="Category" style="min-width: 10rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    <Tag :value="data.category" severity="info" />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Category" />
                </template>
            </Column>
            
            <Column field="tags" header="Tags" style="min-width: 12rem" :showFilterMenu="false">
                <template #body="{ data }">
                    <div class="flex flex-wrap gap-1">
                        <Tag v-for="tag in data.tags" :key="tag" :value="tag" severity="secondary" class="text-xs" />
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by Tags" />
                </template>
            </Column>

            <Column field="publish" header="Status" style="min-width: 8rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    <Tag :value="getDocumentStatus(data)" 
                         :severity="data.publish ? 'success' : 'warning'" />
                </template>
            </Column>

            <Column field="createdAt" header="Created" style="min-width: 10rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    <div class="text-sm text-gray-600">
                        <DateTimeComponent :data="data.createdAt" />
                    </div>
                </template>
            </Column>

            <Column field="updatedAt" header="Updated" style="min-width: 10rem" :showFilterMenu="false"
                :sortable="true">
                <template #body="{ data }">
                    <div class="text-sm text-gray-600">
                        <DateTimeComponent :data="data.updatedAt" />
                    </div>
                </template>
            </Column>

            <Column header="Actions" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <Button icon="pi pi-eye" severity="info" size="small" 
                            @click="viewDocument(data)" 
                            v-tooltip="'View'" />
                        <Button icon="pi pi-pencil" severity="primary" size="small"
                            @click="editDocument(data.id)" 
                            v-tooltip="'Edit'" />
                        <Button icon="pi pi-trash" severity="danger" size="small"
                            @click="confirmDelete(data)" 
                            v-tooltip="'Delete'" />
                    </div>
                </template>
            </Column>

        </DataTable>

        <!-- View Document Dialog -->
        <Dialog v-model:visible="viewDialog" modal header="Document Details" :style="{ width: '80rem' }" 
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div v-if="selectedDocument" class="space-y-4">
                <div>
                    <h3 class="font-bold text-lg mb-2">{{ selectedDocument.title }}</h3>
                    <div class="flex gap-2 mb-4">
                        <Tag :value="selectedDocument.category" severity="info" />
                        <Tag :value="getDocumentStatus(selectedDocument)" 
                             :severity="selectedDocument.publish ? 'success' : 'warning'" />
                    </div>
                </div>
                
                <div v-if="selectedDocument.tags && selectedDocument.tags.length > 0">
                    <strong>Tags:</strong>
                    <div class="flex flex-wrap gap-1 mt-1">
                        <Tag v-for="tag in selectedDocument.tags" :key="tag" :value="tag" severity="secondary" />
                    </div>
                </div>
                
                <div>
                    <strong>Content:</strong>
                    <div class="mt-2 p-4 border rounded-lg bg-gray-50" v-html="selectedDocument.content"></div>
                </div>
                
                <div class="text-sm text-gray-600">
                    <div><strong>Created:</strong> <DateTimeComponent :data="selectedDocument.createdAt" /></div>
                    <div><strong>Updated:</strong> <DateTimeComponent :data="selectedDocument.updatedAt" /></div>
                </div>
            </div>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <ConfirmDialog></ConfirmDialog>
    </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import router from '@/router';
import { documentService, type DocumentResponse, type DocumentsApiResponse } from '@/api/documentService';
import DateTimeComponent from '@/components/DateTimeComponent.vue';

const confirm = useConfirm();
const toast = useToast();

const fTmp = {
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category: { value: null, matchMode: FilterMatchMode.EQUALS },
    tags: { value: null, matchMode: FilterMatchMode.CONTAINS },
    publish: { value: null, matchMode: FilterMatchMode.EQUALS }
}

const documents = ref<DocumentResponse[]>([]);
const filters = ref(fTmp);
const loadLazyTimeout = ref<NodeJS.Timeout | null>(null);
const totalRecords = ref(0);
const loading = ref(false);
const viewDialog = ref(false);
const selectedDocument = ref<DocumentResponse | null>(null);

onMounted(() => {
    loadDocuments({})
});

function onPage(event: any) {
    loadDocuments(event)
}

function loadDocumentsLazy(event: any) {
    if (loadLazyTimeout.value) {
        clearTimeout(loadLazyTimeout.value);
    }

    loadLazyTimeout.value = setTimeout(() => {
        loadDocuments(event)
    }, Math.random() * 1000 + 250);
}

const loadDocuments = async (filter: any = {}) => {
    loading.value = true;
    try {
        // Prepare pagination parameters
        const page = filter.page || 0;
        const size = filter.rows || 10;
        
        // Prepare filter parameters
        const apiFilters: any = {};
        if (filter.filters) {
            if (filter.filters.title?.value) {
                apiFilters.title = filter.filters.title.value;
            }
            if (filter.filters.category?.value) {
                apiFilters.category = filter.filters.category.value;
            }
            if (filter.filters.tags?.value) {
                apiFilters.tags = filter.filters.tags.value;
            }
            if (filter.filters.publish?.value !== null && filter.filters.publish?.value !== undefined) {
                apiFilters.publish = filter.filters.publish.value;
            }
        }
        
        // Prepare API parameters
        const apiParams: any = {
            page,
            size,
            ...apiFilters
        };
        
        // Add sorting if present - format: ?sort=fieldName,direction
        if (filter.sortField) {
            const sortDirection = filter.sortOrder === 1 ? 'asc' : 'desc';
            apiParams.sort = `${filter.sortField},${sortDirection}`;
        }
        
        // Call API with server-side pagination and sorting
        const response: DocumentsApiResponse = await documentService.getDocuments(apiParams);
        
        documents.value = response.data;
        totalRecords.value = response.page.totalCount;
        
    } catch (error) {
        console.error('Error loading documents:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load documents',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
}

const reloadData = () => {
    filters.value = { ...fTmp };
    loadDocuments({
        filters: filters.value
    })
}

const editDocument = (id: number) => {
    router.push(`/management/documents/form?id=${id}`);
}

const viewDocument = (document: DocumentResponse) => {
    selectedDocument.value = document;
    viewDialog.value = true;
}

const confirmDelete = (document: DocumentResponse) => {
    confirm.require({
        message: `Are you sure you want to delete "${document.title}"?`,
        header: 'Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            deleteDocument(document.id);
        }
    });
}

const deleteDocument = async (id: number) => {
    try {
        await documentService.deleteDocument(id);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Document deleted successfully',
            life: 3000
        });
        reloadData();
    } catch (error) {
        console.error('Error deleting document:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete document',
            life: 3000
        });
    }
}

const getDocumentStatus = (document: DocumentResponse) => {
    if (document.publish) return 'Published';
    if (document.draft) return 'Draft';
    return 'Unpublished';
}


</script>
