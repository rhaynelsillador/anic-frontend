<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Guidance Reports</h1>
        <p class="text-gray-600 mt-1">Generate and view guidance and counseling reports</p>
      </div>
      <Button 
        label="Back to Dashboard" 
        icon="pi pi-arrow-left"
        @click="$router.push('/guidance')"
        severity="secondary"
      />
    </div>

    <!-- Report Categories -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-chart-bar text-blue-500 mr-2"></i>
            Case Reports
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <Button 
              label="Case Summary Report"
              @click="generateReport('case-summary')"
              severity="info"
              outlined
              class="w-full justify-start"
            />
            <Button 
              label="Cases by Type"
              @click="generateReport('cases-by-type')"
              severity="info"
              outlined
              class="w-full justify-start"
            />
            <Button 
              label="Case Resolution Report"
              @click="generateReport('case-resolution')"
              severity="info"
              outlined
              class="w-full justify-start"
            />
          </div>
        </template>
      </Card>

      <Card>
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-calendar text-green-500 mr-2"></i>
            Session Reports
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <Button 
              label="Session Attendance"
              @click="generateReport('session-attendance')"
              severity="success"
              outlined
              class="w-full justify-start"
            />
            <Button 
              label="Counselor Activity"
              @click="generateReport('counselor-activity')"
              severity="success"
              outlined
              class="w-full justify-start"
            />
            <Button 
              label="Session Outcomes"
              @click="generateReport('session-outcomes')"
              severity="success"
              outlined
              class="w-full justify-start"
            />
          </div>
        </template>
      </Card>

      <Card>
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-exclamation-triangle text-orange-500 mr-2"></i>
            Incident Reports
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <Button 
              label="Incident Summary"
              @click="generateReport('incident-summary')"
              severity="warning"
              outlined
              class="w-full justify-start"
            />
            <Button 
              label="Behavioral Trends"
              @click="generateReport('behavioral-trends')"
              severity="warning"
              outlined
              class="w-full justify-start"
            />
            <Button 
              label="Safety Analysis"
              @click="generateReport('safety-analysis')"
              severity="warning"
              outlined
              class="w-full justify-start"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Custom Report Generator -->
    <Card>
      <template #title>Custom Report Generator</template>
      <template #content>
        <form @submit.prevent="generateCustomReport" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="field">
              <label for="reportType" class="block text-sm font-medium mb-2">Report Type</label>
              <Dropdown 
                id="reportType"
                v-model="customReport.type" 
                :options="reportTypeOptions"
                option-label="label"
                option-value="value"
                placeholder="Select report type"
                class="w-full"
              />
            </div>
            
            <div class="field">
              <label for="dateFrom" class="block text-sm font-medium mb-2">Date From</label>
              <Calendar 
                id="dateFrom"
                v-model="customReport.dateFrom" 
                show-icon
                date-format="mm/dd/yy"
                class="w-full"
              />
            </div>
            
            <div class="field">
              <label for="dateTo" class="block text-sm font-medium mb-2">Date To</label>
              <Calendar 
                id="dateTo"
                v-model="customReport.dateTo" 
                show-icon
                date-format="mm/dd/yy"
                class="w-full"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="filters" class="block text-sm font-medium mb-2">Additional Filters</label>
              <MultiSelect 
                id="filters"
                v-model="customReport.filters" 
                :options="filterOptions"
                option-label="label"
                option-value="value"
                placeholder="Select filters"
                class="w-full"
              />
            </div>
            
            <div class="field">
              <label for="format" class="block text-sm font-medium mb-2">Output Format</label>
              <Dropdown 
                id="format"
                v-model="customReport.format" 
                :options="formatOptions"
                option-label="label"
                option-value="value"
                placeholder="Select format"
                class="w-full"
              />
            </div>
          </div>
          
          <div class="flex justify-end">
            <Button 
              label="Generate Report"
              type="submit"
              :loading="loading"
              severity="primary"
            />
          </div>
        </form>
      </template>
    </Card>

    <!-- Recent Reports -->
    <Card class="mt-6">
      <template #title>Recent Reports</template>
      <template #content>
        <DataTable :value="recentReports" paginator :rows="10" class="p-datatable-sm">
          <Column field="name" header="Report Name" />
          <Column field="type" header="Type">
            <template #body="{ data }">
              <Tag :value="data.type" severity="info" />
            </template>
          </Column>
          <Column field="generatedDate" header="Generated">
            <template #body="{ data }">
              {{ formatDate(data.generatedDate) }}
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Tag 
                :value="data.status" 
                :severity="getStatusSeverity(data.status)"
              />
            </template>
          </Column>
          <Column header="Actions">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button 
                  icon="pi pi-download"
                  @click="downloadReport(data)"
                  severity="info"
                  size="small"
                  outlined
                />
                <Button 
                  icon="pi pi-eye"
                  @click="viewReport(data)"
                  severity="secondary"
                  size="small"
                  outlined
                />
                <Button 
                  icon="pi pi-trash"
                  @click="deleteReport(data)"
                  severity="danger"
                  size="small"
                  outlined
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import GuidanceService from '@/service/guidance';

const router = useRouter();
const toast = useToast();
const guidanceService = new GuidanceService();

// Data
const loading = ref(false);
const recentReports = ref([]);

const customReport = ref({
  type: '',
  dateFrom: null,
  dateTo: null,
  filters: [],
  format: 'PDF'
});

// Options
const reportTypeOptions = ref([
  { label: 'Case Summary', value: 'case-summary' },
  { label: 'Session Analysis', value: 'session-analysis' },
  { label: 'Incident Report', value: 'incident-report' },
  { label: 'Student Progress', value: 'student-progress' },
  { label: 'Parent Contact Log', value: 'parent-contact' },
  { label: 'Intervention Outcomes', value: 'intervention-outcomes' }
]);

const filterOptions = ref([
  { label: 'High Priority Cases', value: 'high-priority' },
  { label: 'Academic Issues', value: 'academic' },
  { label: 'Behavioral Issues', value: 'behavioral' },
  { label: 'Mental Health Cases', value: 'mental-health' },
  { label: 'Active Cases Only', value: 'active-only' },
  { label: 'Resolved Cases Only', value: 'resolved-only' }
]);

const formatOptions = ref([
  { label: 'PDF Document', value: 'PDF' },
  { label: 'Excel Spreadsheet', value: 'EXCEL' },
  { label: 'CSV File', value: 'CSV' },
  { label: 'Word Document', value: 'WORD' }
]);

// Methods
const generateReport = (reportType) => {
  loading.value = true;
  
  toast.add({
    severity: 'info',
    summary: 'Generating Report',
    detail: `${reportType} report is being generated...`,
    life: 3000
  });
  
  // Simulate report generation
  setTimeout(() => {
    loading.value = false;
    toast.add({
      severity: 'success',
      summary: 'Report Generated',
      detail: 'Report has been generated successfully',
      life: 3000
    });
    
    // Add to recent reports
    const newReport = {
      id: Date.now(),
      name: `${reportType} - ${new Date().toLocaleDateString()}`,
      type: reportType,
      generatedDate: new Date().toISOString(),
      status: 'Ready'
    };
    
    recentReports.value.unshift(newReport);
  }, 2000);
};

const generateCustomReport = () => {
  if (!customReport.value.type) {
    toast.add({
      severity: 'warn',
      summary: 'Missing Information',
      detail: 'Please select a report type',
      life: 3000
    });
    return;
  }
  
  loading.value = true;
  
  toast.add({
    severity: 'info',
    summary: 'Generating Custom Report',
    detail: 'Your custom report is being generated...',
    life: 3000
  });
  
  // Simulate custom report generation
  setTimeout(() => {
    loading.value = false;
    toast.add({
      severity: 'success',
      summary: 'Custom Report Generated',
      detail: `Custom ${customReport.value.type} report has been generated`,
      life: 3000
    });
    
    // Add to recent reports
    const newReport = {
      id: Date.now(),
      name: `Custom ${customReport.value.type} - ${new Date().toLocaleDateString()}`,
      type: customReport.value.type,
      generatedDate: new Date().toISOString(),
      status: 'Ready'
    };
    
    recentReports.value.unshift(newReport);
    
    // Reset form
    customReport.value = {
      type: '',
      dateFrom: null,
      dateTo: null,
      filters: [],
      format: 'PDF'
    };
  }, 3000);
};

const downloadReport = (report) => {
  toast.add({
    severity: 'info',
    summary: 'Download Started',
    detail: `Downloading ${report.name}...`,
    life: 3000
  });
};

const viewReport = (report) => {
  toast.add({
    severity: 'info',
    summary: 'Opening Report',
    detail: `Opening ${report.name} for preview...`,
    life: 3000
  });
};

const deleteReport = (report) => {
  const index = recentReports.value.findIndex(r => r.id === report.id);
  if (index > -1) {
    recentReports.value.splice(index, 1);
    toast.add({
      severity: 'success',
      summary: 'Report Deleted',
      detail: 'Report has been deleted successfully',
      life: 3000
    });
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Ready': return 'success';
    case 'Generating': return 'warning';
    case 'Failed': return 'danger';
    default: return 'info';
  }
};

const loadRecentReports = () => {
  // Mock data - replace with actual API call
  recentReports.value = [
    {
      id: 1,
      name: 'Monthly Case Summary - July 2025',
      type: 'case-summary',
      generatedDate: new Date().toISOString(),
      status: 'Ready'
    },
    {
      id: 2,
      name: 'Behavioral Trends Report - Q2 2025',
      type: 'behavioral-trends',
      generatedDate: new Date(Date.now() - 86400000).toISOString(),
      status: 'Ready'
    },
    {
      id: 3,
      name: 'Session Attendance Report - June 2025',
      type: 'session-attendance',
      generatedDate: new Date(Date.now() - 172800000).toISOString(),
      status: 'Ready'
    }
  ];
};

// Lifecycle
onMounted(() => {
  loadRecentReports();
});
</script>
