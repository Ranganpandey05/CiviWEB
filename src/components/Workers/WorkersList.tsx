import React, { useEffect, useState } from 'react';
import { fetchWorkers } from '../../services/workers';
import { Worker } from '../../types/workers';
import './WorkersList.css';

const WorkersList: React.FC = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWorkers = async () => {
            try {
                const data = await fetchWorkers();
                setWorkers(data);
            } catch (err) {
                setError('Failed to load workers');
            } finally {
                setLoading(false);
            }
        };

        loadWorkers();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="workers-list">
            <h2>Workers List</h2>
            <ul>
                {workers.map(worker => (
                    <li key={worker.id}>
                        <h3>{worker.name}</h3>
                        <p>Status: {worker.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WorkersList;