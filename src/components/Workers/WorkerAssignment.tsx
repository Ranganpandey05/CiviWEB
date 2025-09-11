import React, { useState, useEffect } from 'react';
import { fetchWorkers, assignTask } from '../../services/workers';
import { Worker } from '../../types/workers';

const WorkerAssignment: React.FC = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
    const [taskDescription, setTaskDescription] = useState('');

    useEffect(() => {
        const loadWorkers = async () => {
            const workersData = await fetchWorkers();
            setWorkers(workersData);
        };
        loadWorkers();
    }, []);

    const handleAssignTask = async () => {
        if (selectedWorkerId && taskDescription) {
            await assignTask(selectedWorkerId, taskDescription);
            setTaskDescription('');
            setSelectedWorkerId(null);
            // Optionally refresh the worker list or show a success message
        }
    };

    return (
        <div>
            <h2>Assign Task to Worker</h2>
            <select
                value={selectedWorkerId || ''}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
            >
                <option value="" disabled>Select a worker</option>
                {workers.map(worker => (
                    <option key={worker.id} value={worker.id}>
                        {worker.name}
                    </option>
                ))}
            </select>
            <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter task description"
            />
            <button onClick={handleAssignTask}>Assign Task</button>
        </div>
    );
};

export default WorkerAssignment;