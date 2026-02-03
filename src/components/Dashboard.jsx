import React, { useState } from 'react'
import PieChart from './charts/PieChart';
import DashboardWidget from './charts/DashboardWidget';
import ProgressBar from './charts/ProgressBar';


const Dashboard = () => {
    // Progress bar configuration
    const progressBars = [
        { id: 'budget', label: 'Monthly Budget', data: [{ label: 'Monthly Budget', value: 3800, max: 5000 }] },
        { id: 'savings', label: 'Savings Goal', data: [{ label: 'Savings Goal', value: 5000, max: 5000 }] },
        { id: 'expenses', label: 'Monthly Expenses', data: [{ label: 'Monthly Expenses', value: 5500, max: 5000 }] }
    ];

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
                <DashboardWidget title="Budget Tracker" className="md:col-span-2">
                    <ProgressBar data={progressBars} enableDropdown={true} />
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