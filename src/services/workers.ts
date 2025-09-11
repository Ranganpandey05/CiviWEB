import { Worker } from '../types/workers';
import api from './api';

export const fetchWorkers = async (): Promise<Worker[]> => {
    const response = await api.get('/workers');
    return response.data;
};

export const updateWorkerAssignment = async (workerId: string, assignmentData: any): Promise<void> => {
    await api.put(`/workers/${workerId}/assignments`, assignmentData);
};

export const fetchWorkerById = async (workerId: string): Promise<Worker> => {
    const response = await api.get(`/workers/${workerId}`);
    return response.data;
};