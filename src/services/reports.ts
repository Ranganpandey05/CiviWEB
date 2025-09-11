import { Report } from '../types/reports';
import api from './api';

export const fetchReports = async (): Promise<Report[]> => {
    const response = await api.get('/reports');
    return response.data;
};

export const fetchReportById = async (id: string): Promise<Report> => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
};

export const updateReport = async (id: string, updatedData: Partial<Report>): Promise<Report> => {
    const response = await api.put(`/reports/${id}`, updatedData);
    return response.data;
};

export const deleteReport = async (id: string): Promise<void> => {
    await api.delete(`/reports/${id}`);
};