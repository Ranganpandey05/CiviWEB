import React from 'react';
import { useParams } from 'react-router-dom';
import { fetchReportDetails } from '../../services/reports';
import { Report } from '../../types/reports';
import LoadingSpinner from '../Common/LoadingSpinner';

const ReportDetails: React.FC = () => {
    const { reportId } = useParams<{ reportId: string }>();
    const [report, setReport] = React.useState<Report | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const getReportDetails = async () => {
            try {
                const data = await fetchReportDetails(reportId);
                setReport(data);
            } catch (err) {
                setError('Failed to fetch report details');
            } finally {
                setLoading(false);
            }
        };

        getReportDetails();
    }, [reportId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!report) {
        return <div>No report found</div>;
    }

    return (
        <div>
            <h2>Report Details</h2>
            <h3>{report.title}</h3>
            <p>Status: {report.status}</p>
            <p>Description: {report.description}</p>
            {report.media && report.media.length > 0 && (
                <div>
                    <h4>Media</h4>
                    {report.media.map((mediaItem, index) => (
                        <img key={index} src={mediaItem.url} alt={`Media ${index}`} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportDetails;