export interface Report {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    category: string;
    createdAt: Date;
    updatedAt: Date;
    assignedTo?: string; // Worker ID
    media?: string[]; // URLs of associated media
}

export interface ReportFilter {
    category?: string;
    status?: 'open' | 'in-progress' | 'resolved' | 'closed';
    dateRange?: {
        startDate: Date;
        endDate: Date;
    };
}