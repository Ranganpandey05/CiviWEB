import axios from 'axios';

const API_BASE_URL = 'https://api.yourmunicipality.gov'; // Replace with your actual API base URL

// Function to fetch all reports
export const fetchReports = async () => {
    const response = await axios.get(`${API_BASE_URL}/reports`);
    return response.data;
};

// Function to fetch a specific report by ID
export const fetchReportById = async (reportId) => {
    const response = await axios.get(`${API_BASE_URL}/reports/${reportId}`);
    return response.data;
};

// Function to create a new report
export const createReport = async (reportData) => {
    const response = await axios.post(`${API_BASE_URL}/reports`, reportData);
    return response.data;
};

// Function to update an existing report
export const updateReport = async (reportId, reportData) => {
    const response = await axios.put(`${API_BASE_URL}/reports/${reportId}`, reportData);
    return response.data;
};

// Function to delete a report
export const deleteReport = async (reportId) => {
    const response = await axios.delete(`${API_BASE_URL}/reports/${reportId}`);
    return response.data;
};

// Function to fetch all workers
export const fetchWorkers = async () => {
    const response = await axios.get(`${API_BASE_URL}/workers`);
    return response.data;
};

// Function to fetch a specific worker by ID
export const fetchWorkerById = async (workerId) => {
    const response = await axios.get(`${API_BASE_URL}/workers/${workerId}`);
    return response.data;
};

// Function to update a worker's assignment
export const updateWorkerAssignment = async (workerId, assignmentData) => {
    const response = await axios.put(`${API_BASE_URL}/workers/${workerId}/assignments`, assignmentData);
    return response.data;
};