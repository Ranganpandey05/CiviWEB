import React, { useEffect, useState } from 'react';
import { fetchReports } from '../../services/reports';
import { Report } from '../../types/reports';
import ReportFilters from './ReportFilters';

const ReportsList: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReports = async () => {
            try {
                const data = await fetchReports();
                setReports(data);
            } catch (err) {
                setError('Failed to fetch reports');
            } finally {
                setLoading(false);
            }
        };

        loadReports();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Citizen Reports</h2>
            <ReportFilters />
            <ul>
                {reports.map(report => (
                    <li key={report.id}>
                        <h3>{report.title}</h3>
                        <p>Status: {report.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReportsList;