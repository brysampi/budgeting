import { useEffect, useState } from 'react';
import { unsubscribeForAll } from '../../library/firebase/controller';
import { monthlyCollectedDataStore, expensesCategoryStore, walletStorage, categoriesStore } from '../../library/zustand/storage';
import { getAllDataRealtime, getAllDataRealtimeByDate } from '../../library/firebase/v3/controller';

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
    useEffect(() => {
        
        getAllDataRealtime('wallets', storeWallet, setIsWalletFetching);
        getAllDataRealtime('categories', storeExpensesCategory, setIsExpensesCategoryFetching);
        // const returnCategoriesDefault = async () => {
        //     setIsFetching(true);
        //     return await getAllDataRealtime('categories', storeCategories.setData, setIsCategoriesFetching);
        // }
        getAllDataRealtimeByDate('collectedData', storeMonthlyCollectedData, setIsMonthlyCollectedDataFetching);
    }, []);
}