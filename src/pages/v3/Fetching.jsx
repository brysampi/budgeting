import { useEffect, useState } from 'react';
import { unsubscribeForAll } from '../../library/firebase/controller';
import { monthlyCollectedDataStore, expensesCategoryStore, walletStorage, categoriesStore, transactionStore } from '../../library/zustand/storage';
import { getAllDataRealtime, getAllDataRealtimeByDate } from '../../library/firebase/v3/controller';
import { Timestamp } from 'firebase/firestore';
import { convertToDate, formatToYearMonth } from '../../library/utils';

export default function Fetching({ setIsFetching }) {
    // Zustand storage
    const storeWallet = walletStorage((state) => state.setData) || [];
    const storeExpensesCategory = expensesCategoryStore((state) => state.setData) || [];
    const storeCategories = categoriesStore((state) => state.setData) || [];
    const storeMonthlyCollected = monthlyCollectedDataStore((state) => state.setData) || [];
    const setTransactionData = transactionStore((state) => state.setData) || [];
    // Storage Data
    const storeMonthlyCollectedData = monthlyCollectedDataStore((state) => state.data) || [];

    // state
    const [isExpensesCategoryFetching, setIsExpensesCategoryFetching] = useState(true);
    const [isWalletFetching, setIsWalletFetching] = useState(true);
    const [isCategoriesFetching, setIsCategoriesFetching] = useState(true);
    const [isMonthlyCollectedFetching, setIsMonthlyCollectedFetching] = useState(true);
    const [isTransactionFetching, setIsTransactionFetching] = useState(true);

    useEffect(() => {
        console.log('fetched transactions', storeMonthlyCollectedData);
    }, [storeMonthlyCollectedData]);

    // useEffect(() => {
    //     console.log('storeWallet', storeWallet)
    // }, [storeWallet]);
    // const fakeDate = new Date('2024-02-01T12:00:00');
    // const fakeTimestamp = Timestamp.fromDate(fakeDate);
    useEffect(() => {
        getAllDataRealtime('transactions', setTransactionData, setIsFetching);
        getAllDataRealtime('wallets', storeWallet, setIsWalletFetching);
        getAllDataRealtime('categories', storeCategories, setIsCategoriesFetching);
        getAllDataRealtimeByDate('collectedData', storeMonthlyCollected, setIsMonthlyCollectedFetching);
        // updateCollectedData();
    }, []);
}