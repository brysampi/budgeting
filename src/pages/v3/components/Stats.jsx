import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../../components/cards/Card';
import { IconCard } from '../../../assets/Icons';
import { getCollectedDataRealTimeController, unsubscribeForAll } from '../../../library/firebase/controller';
import DateSelector from './DateSelector';
import { convertToDate, formatToYearMonth, componentIcons } from '../../../library/utils';
import { monthlyCollectedDataStore } from '../../../library/zustand/storage';

const Stats = ({ setParamMonth }) => {
    const [monthCollectionData, setMonthCollectionData] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);



    const rawCollectedDataStored = monthlyCollectedDataStore((state) => state.data) || [];
    const collectedDataStored = [...rawCollectedDataStored];
    // console.log('collectedDataStored', collectedDataStored)

    const storedMonthlyCollectedData = useMemo(() => {
        // const reversed = [...rawMonthlyData].reverse();
        const dateNow = new Date();
        const currentMonth = formatToYearMonth(dateNow);
        // console.log('foun', collectedDataStored.find(item => formatToYearMonth(item.date) === currentMonth))
        if (collectedDataStored.length === 0) {
            collectedDataStored.push({ date: dateNow.toISOString().split('T')[0], status: 'no_data' });
        } else {
            const latestMonth = formatToYearMonth(collectedDataStored[0].date);
            // console.log('latestMonth', latestMonth)
            // console.log('currentMonth', currentMonth)
            const findCurrentMonth = collectedDataStored.find(item => formatToYearMonth(item.date) === currentMonth)
            if (!findCurrentMonth) {
                collectedDataStored.unshift({ date: dateNow.toISOString().split('T')[0], status: 'no_data' });
            }
        }
        return collectedDataStored;
    }, [collectedDataStored]);

    const walletCards = useMemo(() => {
        // return storedMonthlyCollectedData.map(wallet => ({
        //     name: wallet.name || 'Unnamed Wallet',
        //     balance: wallet.balance || 0,
        // })).reverse();
        // console.log('storedMonthlyCollectedData', storedMonthlyCollectedData)
    }, [storedMonthlyCollectedData]);

    const currentData = useMemo(() => {
        return storedMonthlyCollectedData[selectedIndex] || {};
    }, [storedMonthlyCollectedData, selectedIndex]);


    // const currentData = useMemo(() => {
    //     return monthCollectionData[selectedIndex] || {};
    // }, [monthCollectionData, selectedIndex]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         return await getCollectedDataRealTimeController(setMonthCollectionData, setIsFetching);
    //     };
    //     const unsubPromise = fetchData();
    //     return unsubscribeForAll(unsubPromise);
    // }, []);

    // Effect to initialize setParamMonth when currentData changes
    useEffect(() => {
        if (currentData && currentData.date && typeof setParamMonth === 'function') {
            setParamMonth(formatToYearMonth(convertToDate(currentData.date)));
        }
    }, [currentData, setParamMonth]);

    // useEffect(() => {
    //     if (currentData && currentData.date) {
    //         setParamMonth(formatToYearMonth(currentData.date));
    //     }
    // }, [currentData, setParamMonth]);


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
            title: 'Balance',
            amount: (
                currentData.balance !== undefined ?
                    `$${currentData.balance.toLocaleString()}` :
                    '$0'
            ),
            badgeValue: '+12%',
            color: '#10B981',
            icon: 'FaWallet',
            // ...componentIcons('income', 'FaWallet'),
            // badgeColorClass: componentIcons('income').iconBackground,
        },
        {
            id: 2,
            title: 'Savings',
            amount: (
                currentData.savings !== undefined ?
                    `$${currentData.savings.toLocaleString()}` :
                    '$0'
            ),
            color: '#e169a5ff',
            icon: 'FaPiggyBank',
            // ...componentIcons('savings'),
        },
        {
            id: 3,
            title: 'Bills',
            amount: (
                currentData.bills !== undefined ?
                    `$${currentData.bills.toLocaleString()}` :
                    '$0'
            ),
            color: '#06B6D4',
            icon: 'FaBolt',
            // ...componentIcons('bills'),
        },
        {
            id: 4,
            title: 'Expenses',
            amount: (
                currentData.expenses !== undefined ?
                    `$${currentData.expenses.toLocaleString()}` :
                    '$0'
            ),
            badgeValue: '8%',
            color: '#EF4444',
            icon: 'FaArrowTrendDown',
            // ...componentIcons('expenses'),
            // badgeColorClass: componentIcons('expenses').iconBackground,
        }
    ], [currentData]);

    const dateSelector = (index) => {
        setSelectedIndex(index);
    }

    return (
        <div className="flex flex-col gap-6">
            <DateSelector
                collectedData={storedMonthlyCollectedData}
                currentIndex={selectedIndex}
                onChange={dateSelector}
            />

            {/* Main Balance Card - Centered & Aesthetic */}
            {/* <Card variant="main" className="overflow-hidden group flex flex-col justify-center items-center h-[130px] text-center border-none shadow-md bg-gradient-to-br from-[var(--color-theme-secondary)] to-[var(--color-theme-secondary)]/80 relative"> */}
            {/* Subtle Glow Effect */}
            {/* <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative flex flex-col items-center gap-2">
                    <div className="flex flex-row items-center gap-2">
                        <IconCard
                            name="LuActivity"
                            className="!w-7 !h-7 !bg-blue-500/10 text-blue-500 shadow-none border-none"
                            size={14}
                        />

                        <p className="text-[var(--color-theme-secondary-text)] text-[11px] font-medium uppercase tracking-widest opacity-80 group-hover:text-[var(--color-theme-important)] transition-colors">
                            Remaining Balance
                        </p>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold tracking-tight leading-none text-[var(--color-light)]">
                        {currentData.remainingIncome !== undefined ? `$${currentData.remainingIncome.toLocaleString()}` : '$0'}
                    </h3>
                </div> */}
            {/* </Card> */}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 min-[600px]:grid-cols-4 gap-1">
                {statsData.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
        </div>
    );
};

const StatCard = ({ title, amount, badgeValue, color, icon, subtext }) => {
    const badgeColorClass = 'bg-red-200 text-red-600';
    // console.log(color)
    return (
        <Card padding="p-3.5" className="group h-[130px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
                <IconCard
                    name={icon || "FaWallet"}
                    // className={`!w-10 !h-10 ${iconBackground} shadow-none border-none`}
                    // size={18}
                    textColor={color}
                    bgColor={`${color}20`}
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
            <h3
                className={`text-lg sm:text-xl font-bold tracking-tight leading-none truncate w-full text-[var(--color-light)]`}
                title={typeof amount === 'string' || typeof amount === 'number' ? amount : ''}
            >
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
