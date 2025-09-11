export const API_ENDPOINTS = {
    GET_REPORTS: '/api/reports',
    GET_REPORT_DETAILS: (id) => `/api/reports/${id}`,
    CREATE_REPORT: '/api/reports',
    UPDATE_REPORT: (id) => `/api/reports/${id}`,
    DELETE_REPORT: (id) => `/api/reports/${id}`,
    GET_WORKERS: '/api/workers',
    GET_WORKER_DETAILS: (id) => `/api/workers/${id}`,
    ASSIGN_WORKER: '/api/assignments',
};

export const REPORT_STATUSES = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
};

export const WORKER_STATUSES = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    ON_LEAVE: 'On Leave',
};