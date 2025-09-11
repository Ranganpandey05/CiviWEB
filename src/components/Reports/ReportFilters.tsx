import React from 'react';

const ReportFilters: React.FC = () => {
    const [category, setCategory] = React.useState('');
    const [dateRange, setDateRange] = React.useState([null, null]);
    const [priority, setPriority] = React.useState('');

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(event.target.value);
    };

    const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
        setDateRange(dates);
    };

    const handlePriorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPriority(event.target.value);
    };

    const applyFilters = () => {
        // Logic to apply filters to the reports list
    };

    return (
        <div className="report-filters">
            <h3>Filter Reports</h3>
            <div>
                <label>Category:</label>
                <select value={category} onChange={handleCategoryChange}>
                    <option value="">All</option>
                    <option value="pothole">Pothole</option>
                    <option value="streetlight">Streetlight</option>
                    <option value="waste">Waste</option>
                </select>
            </div>
            <div>
                <label>Date Range:</label>
                {/* Date range picker component can be used here */}
                <input type="date" onChange={(e) => handleDateRangeChange([new Date(e.target.value), dateRange[1]])} />
                <input type="date" onChange={(e) => handleDateRangeChange([dateRange[0], new Date(e.target.value)])} />
            </div>
            <div>
                <label>Priority:</label>
                <select value={priority} onChange={handlePriorityChange}>
                    <option value="">All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>
            <button onClick={applyFilters}>Apply Filters</button>
        </div>
    );
};

export default ReportFilters;