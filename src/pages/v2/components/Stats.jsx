import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../../components/cards/Card';
import { IconCard } from '../../../assets/Icons';
import { getCollectedDataRealTimeController, unsubscribeForAll } from '../../../library/firebase/controller';
import DateSelector from './DateSelector';
import { convertToDate, formatToYearMonth, componentIcons } from '../../../library/firebase/utils';
const Stats = ({ setParamMonth }) => {
    const [monthCollectionData, setMonthCollectionData] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const currentData = useMemo(() => {
        return monthCollectionData[selectedIndex] || {};
    }, [monthCollectionData, selectedIndex]);

    useEffect(() => {
        const fetchData = async () => {
            return await getCollectedDataRealTimeController(setMonthCollectionData, setIsFetching);
        };
        const unsubPromise = fetchData();
        return unsubscribeForAll(unsubPromise);
    }, []);

    // Effect to initialize setParamMonth when currentData changes
    useEffect(() => {
        if (currentData && currentData.date) {
            setParamMonth(formatToYearMonth(currentData.date));
        }
    }, [currentData, setParamMonth]);
    // useEffect(() => {
    //     console.log('monthly Colected', monthCollectionData)
    //     // monthCollectionData.map((collected) => {
    //     //     console.log(collected)
    //     // })
    // }, [monthCollectionData]);

    // Get the most recent collected data entry (assuming ordered by date desc)
    // const currentData = monthCollectionData[0] || {};

    const statsData = useMemo(() => [
        {
            id: 1,
            title: 'Total Balance',
            amount: (
                currentData.remainingIncome !== undefined ?
                    `$${currentData.remainingIncome.toLocaleString()}` :
                    '$0'
            ),
            badgeValue: '+12%',
            ...componentIcons('income', 'FaWallet'),
            badgeColorClass: componentIcons('income').iconBackground,
        },
        {
            id: 2,
            title: 'Savings',
            amount: (
                currentData.totalSavings !== undefined ?
                    `$${currentData.totalSavings.toLocaleString()}` :
                    '$0'
            ),
            ...componentIcons('savings'),
        },
        {
            id: 3,
            title: 'Bills',
            amount: (
                currentData.totalBills !== undefined ?
                    `$${currentData.totalBills.toLocaleString()}` :
                    '$0'
            ),
            ...componentIcons('bills'),
        },
        {
            id: 4,
            title: 'Expenses',
            amount: (
                currentData.totalExpenses !== undefined ?
                    `$${currentData.totalExpenses.toLocaleString()}` :
                    '$0'
            ),
            badgeValue: '8%',
            ...componentIcons('expenses'),
            badgeColorClass: componentIcons('expenses').iconBackground,
        }
    ], [currentData]);
    const dates = [];
    const dateSelector = (index) => {
        setSelectedIndex(index);
    }
    return (
        <>
            <DateSelector
                collectedData={monthCollectionData}
                currentIndex={selectedIndex}
                onChange={dateSelector}
            />

            <div className="grid grid-cols-2 min-[600px]:grid-cols-4 gap-3">
                {statsData.map(stat => (
                    <StatCard key={stat.id} {...stat} />
                ))}
            </div>
        </>
    );
};

const StatCard = ({ title, amount, icon, badgeValue, subtext, iconBackground, badgeColorClass, amountColorClass }) => {
    return (
        <Card padding="p-3.5" className="group h-[130px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
                <IconCard
                    name={icon || "FaWallet"}
                    iconColor={iconBackground}
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
