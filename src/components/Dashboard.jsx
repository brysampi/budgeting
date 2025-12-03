import React, { useState } from 'react'
import PieChart from './charts/PieChart';
import DashboardWidget from './charts/DashboardWidget';
import ProgressBar from './charts/ProgressBar';


const Dashboard = () => {
    // Progress bar configuration
    const progressBars = [
        { id: 'budget', name: 'Monthly Budget', data: [{ name: 'Monthly Budget', value: 3800, max: 5000 }], showControls: false },
        { id: 'savings', name: 'Savings Goal', data: [{ name: 'Savings Goal', value: 5000, max: 5000 }] },
        { id: 'expenses', name: 'Monthly Expenses', data: [{ name: 'Monthly Expenses', value: 5500, max: 5000 }] }
    ];

    // Visibility state
    const [visibleItems, setVisibleItems] = useState(
        progressBars.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
    );
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleVisibility = (id) => {
        setVisibleItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const incomeData = [
        { name: 'Salary', value: 5000 },
        { name: 'Freelance', value: 1200 },
        { name: 'Investments', value: 300 },
    ];

    const savingsData = [
        { name: 'Emergency Fund', value: 2000 },
        { name: 'Vacation', value: 1500 },
        { name: 'Car', value: 500 },
    ];

    const budgetData = [
        { name: 'Rent', value: 1200 },
        { name: 'Food', value: 400 },
        { name: 'Utilities', value: 200 },
        { name: 'Entertainment', value: 300 },
    ];

    const monthlyData = [
        { name: 'Week 1', value: 400 },
        { name: 'Week 2', value: 300 },
        { name: 'Week 3', value: 500 },
        { name: 'Week 4', value: 200 },
    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3">
                {/* Budget Tracker Widget */}
                <DashboardWidget title="Budget Tracker" className="md:col-span-2">
                    <div className="relative">
                        {/* Dropdown Menu Button */}
                        <div className="absolute top-0 right-0 z-50">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="text-[var(--color-light)] hover:text-[var(--color-theme-important)] p-2 text-xl font-bold"
                            >
                                ⋮
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 bg-[var(--color-theme-secondary)] border border-[var(--color-theme-tertiary)] rounded-lg shadow-lg p-3 min-w-[200px]">
                                    <div className="text-[var(--color-light)] text-xs font-semibold mb-2">Show Items:</div>
                                    {progressBars.map(item => (
                                        <label key={item.id} className="flex items-center gap-2 cursor-pointer text-[var(--color-light)] text-sm mb-2 hover:text-[var(--color-theme-important)]">
                                            <input
                                                type="checkbox"
                                                checked={visibleItems[item.id]}
                                                onChange={() => toggleVisibility(item.id)}
                                                className="cursor-pointer"
                                            />
                                            <span>{item.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Progress Bars */}
                        <div className="flex flex-col gap-6 p-4">
                            {progressBars.map(item => (
                                visibleItems[item.id] && (
                                    <ProgressBar
                                        key={item.id}
                                        data={item.data}
                                        showControls={item.showControls}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                </DashboardWidget>

                <DashboardWidget title="Income Sources">
                    <PieChart data={incomeData} />
                </DashboardWidget>
                <DashboardWidget title="Savings Goals">
                    <PieChart data={savingsData} />
                </DashboardWidget>
                <DashboardWidget title="Budget Distribution">
                    <PieChart data={budgetData} />
                </DashboardWidget>
                <DashboardWidget title="Monthly Spending">
                    <PieChart data={monthlyData} />
                </DashboardWidget>
            </div>
        </>
    )
}
export default Dashboard;