import { useEffect, useState } from 'react';
import { unsubscribeForAll } from '../../library/firebase/controller';
import { monthlyCollectedDataStore, expensesCategoryStore, walletStorage, categoriesStore } from '../../library/zustand/storage';
import { getAllDataRealtime, getAllDataRealtimeByDate } from '../../library/firebase/v3/controller';
import { Timestamp } from 'firebase/firestore';
import { convertToDate, formatToYearMonth } from '../../library/utils';

export default function Fetching({ setIsFetching }) {
    // Zustand storage
    const storeWallet = walletStorage((state) => state.setData) || [];
    const storeExpensesCategory = expensesCategoryStore((state) => state.setData) || [];
    const storeCategories = categoriesStore((state) => state.setData) || [];
    const storeMonthlyCollectedData = monthlyCollectedDataStore((state) => state.setData) || [];

    // state
    const [isExpensesCategoryFetching, setIsExpensesCategoryFetching] = useState(true);
    const [isWalletFetching, setIsWalletFetching] = useState(true);
    const [isCategoriesFetching, setIsCategoriesFetching] = useState(true);
    const [isMonthlyCollectedDataFetching, setIsMonthlyCollectedDataFetching] = useState(true);


    // useEffect(() => {
    //     console.log('storeWallet', storeWallet)
    // }, [storeWallet]);
    // const fakeDate = new Date('2024-02-01T12:00:00');
    // const fakeTimestamp = Timestamp.fromDate(fakeDate);
    useEffect(() => {

        getAllDataRealtime('wallets', storeWallet, setIsWalletFetching);
        getAllDataRealtime('categories', storeCategories, setIsCategoriesFetching);
        getAllDataRealtimeByDate('collectedData', storeMonthlyCollectedData, setIsMonthlyCollectedDataFetching);
        // updateCollectedData();
    }, []);
}