import React from 'react';
import { useParams } from 'react-router-dom';
import { Worker } from '../../types/workers';
import { fetchWorkerById } from '../../services/workers';
import LoadingSpinner from '../Common/LoadingSpinner';

const WorkerProfile: React.FC = () => {
    const { workerId } = useParams<{ workerId: string }>();
    const [worker, setWorker] = React.useState<Worker | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const getWorker = async () => {
            try {
                const fetchedWorker = await fetchWorkerById(workerId);
                setWorker(fetchedWorker);
            } catch (err) {
                setError('Failed to fetch worker data');
            } finally {
                setLoading(false);
            }
        };

        getWorker();
    }, [workerId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!worker) {
        return <div>No worker found</div>;
    }

    return (
        <div>
            <h1>{worker.name}</h1>
            <p>Position: {worker.position}</p>
            <p>Assignments: {worker.assignments.join(', ')}</p>
            <p>Performance Metrics: {worker.performanceMetrics}</p>
        </div>
    );
};

export default WorkerProfile;