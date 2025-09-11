export interface Worker {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'on leave';
    assignments: Assignment[];
}

export interface Assignment {
    reportId: string;
    assignedDate: Date;
    status: 'pending' | 'in progress' | 'completed';
}