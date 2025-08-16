import api from '@/api/ajax.ts';

export default class GuidanceService {
    constructor() {
        const apiPath = "/bluefolder/api/v1";
        this.baseUrl = apiPath + "/guidance";
        this.guidanceSessionsApi = apiPath + "/guidance/sessions";
        this.incidentReportApi = apiPath + "/incident-reports";
    }

    // Dashboard Methods
    getDashboardMetrics(callback) {
        api.get(`${this.baseUrl}/cases/dashboard/metrics`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching dashboard metrics:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: {
                        activeCases: 0,
                        newCasesThisWeek: 0,
                        sessionsThisWeek: 0,
                        completedSessions: 0,
                        criticalIncidents: 0,
                        pendingIncidents: 0,
                        activeInterventions: 0,
                        overdueInterventions: 0
                    }
                });
            });
    }

    getRecentCases(callback) {
        api.get(`${this.baseUrl}/cases/recent`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching recent cases:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: []
                });
            });
    }

    getTodaySessions(callback) {
        const today = new Date().toISOString().split('T')[0];
        api.get(`${this.guidanceSessionsApi}/today`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching today\'s sessions:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: []
                });
            });
    }

    // Guidance Cases Methods
    getCases(page = 0, size = 10, callback) {
        api.get(`${this.baseUrl}/cases?page=${page}&size=${size}`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching cases:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: { content: [], totalElements: 0 }
                });
            });
    }

    getCaseById(id, callback) {
        api.get(`${this.baseUrl}/cases/${id}`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching case:', error);
                callback({
                    success: false,
                    error: error.message
                });
            });
    }

    createCase(caseData, callback) {
        api.post(`${this.baseUrl}/cases`, caseData)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error creating case:', error);
                callback({
                    success: false,
                    error: error.message
                });
            });
    }

    updateCase(id, caseData, callback) {
        api.put(`${this.baseUrl}/cases/${id}`, caseData)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error updating case:', error);
                callback({
                    success: false,
                    error: error.message
                });
            });
    }

    updateCaseStatus(id, status, callback) {
        api.put(`${this.baseUrl}/cases/${id}/status/${status}`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error updating case status:', error);
                callback({
                    success: false,
                    error: error.message
                });
            });
    }

    searchCases(searchTerm, page = 0, size = 10, callback) {
        api.get(`${this.baseUrl}/cases/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error searching cases:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: { content: [], totalElements: 0 }
                });
            });
    }

    getSessionsById(id, callback) {
        api.get(`${this.guidanceSessionsApi}/${id}`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching session by ID:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: null
                });
            });
    }

    // Guidance Sessions Methods
    getSessions(page = 0, size = 10, callback) {
        api.get(`${this.guidanceSessionsApi}?page=${page}&size=${size}`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching sessions:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: { content: [], totalElements: 0 }
                });
            });
    }

    getSessionsByCaseId(caseId, callback) {
        api.get(`${this.baseUrl}/sessions/case/${caseId}`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching sessions by case:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: []
                });
            });
    }

    createSession(sessionData, callback) {
        api.post(`${this.baseUrl}/sessions`, sessionData)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Create session error:', error);
                callback({
                    success: false,
                    error: error.response?.data?.message || error.message,
                    message: error.response?.data?.message || 'Failed to create session'
                });
            });
    }

    updateSession(id, sessionData, callback) {
        api.put(`${this.baseUrl}/sessions/${id}`, sessionData)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Update session error:', error);
                callback({
                    success: false,
                    error: error.response?.data?.message || error.message
                });
            });
    }

    updateSessionStatus(id, status, callback) {
        api.put(`${this.baseUrl}/sessions/${id}/status`, {}, {
            params: { status }
        })
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Update session error:', error);
                callback({
                    success: false,
                    error: error.response?.data?.message || error.message
                });
            });
    }

    completeSession(id, data, callback) {
        api.put(`${this.baseUrl}/sessions/${id}/complete`, data)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Complete session error:', error);
                callback({
                    success: false,
                    error: error.response?.data?.message || error.message
                });
            });
    }

    deleteSession(id, callback) {
        api.delete(`${this.baseUrl}/sessions/${id}`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Delete session error:', error);
                callback({
                    success: false,
                    error: error.response?.data?.message || error.message
                });
            });
    }

    // Incident Reports Methods
    getIncidents(page = 0, size = 10, callback) {
        api.get(`${this.baseUrl}/incidents?page=${page}&size=${size}`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching incidents:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: { content: [], totalElements: 0 }
                });
            });
    }

    getCaseIncidents(caseId, callback) {
        api.get(`${this.incidentReportApi}/case/${caseId}`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching case incidents:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: { content: [], totalElements: 0 }
                });
            });
    }

    createIncident(incidentData, callback) {
        api.post(`${this.baseUrl}/incidents`, incidentData)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error creating incident:', error);
                callback({
                    success: false,
                    error: error.message
                });
            });
    }

    // Parent Contacts Methods
    getParentContacts(page = 0, size = 10, callback) {
        api.get(`${this.baseUrl}/parent-contacts?page=${page}&size=${size}`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching parent contacts:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: { content: [], totalElements: 0 }
                });
            });
    }

    createParentContact(contactData, callback) {
        api.post(`${this.baseUrl}/parent-contacts`, contactData)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error creating parent contact:', error);
                callback({
                    success: false,
                    error: error.message
                });
            });
    }

    // Utility Methods
    getCaseStatistics(callback) {
        api.get(`${this.baseUrl}/cases/statistics`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching case statistics:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: {}
                });
            });
    }

    getSessionStatistics(callback) {
        api.get(`${this.baseUrl}/sessions/statistics`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching session statistics:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: {}
                });
            });
    }

    getIncidentStatistics(callback) {
        api.get(`${this.baseUrl}/incidents/statistics`)
            .then(response => {
                callback({
                    success: true,
                    data: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching incident statistics:', error);
                callback({
                    success: false,
                    error: error.message,
                    data: {}
                });
            });
    }
}
