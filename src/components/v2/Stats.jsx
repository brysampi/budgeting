import React, { useState, useEffect } from 'react';
import Card from '../cards/Card';
import { IconCard } from '../../assets/Icons';
import { getCollectedDataRealTimeController, unsubscribeForAll } from '../../firebase/controller';
import DateSelector from './DateSelector';
const Stats = () => {
    const [monthCollectionData, setMonthCollectionData] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            return await getCollectedDataRealTimeController(setMonthCollectionData, setIsFetching);
        };
        return unsubscribeForAll(fetchData());
    }, []);
    // useEffect(() => {
    //     console.log(monthCollectionData)
    // }, [monthCollectionData]);
    // Get the most recent collected data entry (assuming ordered by date desc)
    const currentData = monthCollectionData[0] || {};

    const statsData = [
        {
            id: 1,
            title: 'Total Balance',
            amount: currentData.remainingIncome !== undefined ? `$${currentData.remainingIncome.toLocaleString()}` : '$0',
            iconName: 'FaWallet',
            badgeValue: '+12%',
            iconColorClass: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500',
            badgeColorClass: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500',
        },
        {
            id: 2,
            title: 'Savings',
            amount: currentData.totalSavings !== undefined ? `$${currentData.totalSavings.toLocaleString()}` : '$0',
            iconName: 'FaPiggyBank',
            iconColorClass: 'bg-pink-50 dark:bg-pink-500/10 text-pink-500',
        },
        {
            id: 3,
            title: 'Bills',
            amount: currentData.totalBills !== undefined ? `$${currentData.totalBills.toLocaleString()}` : '$0',
            iconName: 'FaBolt',
            iconColorClass: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500',
        },
        {
            id: 4,
            title: 'Expenses',
            amount: currentData.totalExpenses !== undefined ? `$${currentData.totalExpenses.toLocaleString()}` : '$0',
            badgeValue: '8%',
            iconName: 'FaArrowTrendDown',
            iconColorClass: 'bg-red-50 dark:bg-red-500/10 text-red-500',
            badgeColorClass: 'bg-red-50 dark:bg-red-500/10 text-red-500',
        }
    ];
    const dates = [];

    return (
        <>
            <DateSelector dates={dates} onChange={(val) => console.log('Date changed to:', val)} />

            <div className="grid grid-cols-2 min-[600px]:grid-cols-4 gap-3">
                {statsData.map(stat => (
                    <StatCard key={stat.id} {...stat} />
                ))}
            </div>
        </>
    );
};

const StatCard = ({ title, amount, icon, iconName, badgeValue, subtext, iconColorClass, badgeColorClass, amountColorClass }) => {
    return (
        <Card padding="p-3.5" className="group h-[130px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
                <IconCard
                    name={iconName || "FaWallet"}
                    iconColorClass={iconColorClass}
                    className="!w-10 !h-10"
                    size={18}
                />

                {/* Optional Percentage Badge */}
                {badgeValue && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColorClass}`}>
                        {badgeValue}
                    </span>
                )}
            </div>

            {/* Title */}
            <p className="text-[var(--color-theme-secondary-text)] text-[11px] font-normal mb-1 group-hover:text-[var(--color-theme-important)] transition-colors">
                {title}
            </p>

            {/* Amount */}
            <h3 className={`text-xl font-bold tracking-tight leading-none ${amountColorClass || 'text-[var(--color-light)]'}`}>
                {amount}
            </h3>

            {/* Subtext */}
            {subtext && (
                <p className="text-[10px] text-[var(--color-theme-secondary-text)] font-normal opacity-60 mt-0.5">
                    {subtext}
                </p>
            )}
        </Card>
    );
};

export default Stats;
