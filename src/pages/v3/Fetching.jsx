import { useEffect, useState } from 'react';
import { unsubscribeForAll } from '../../library/firebase/controller';
import { expensesCategoryStore, walletStorage, categoriesStore } from '../../library/zustand/storage';
import { getAllDataRealtime } from '../../library/firebase/v3/controller';

export default function Fetching({ setIsFetching }) {
    // Zustand storage
    const storeExpensesCategory = expensesCategoryStore((state) => state);
    const storeWallet = walletStorage((state) => state);
    const storeCategories = categoriesStore((state) => state);

    // state
    const [isExpensesCategoryFetching, setIsExpensesCategoryFetching] = useState(true);
    const [isWalletFetching, setIsWalletFetching] = useState(true);
    const [isCategoriesFetching, setIsCategoriesFetching] = useState(true);

    // useEffect(() => {
    //     console.log('storeWallet', storeWallet)
    // }, [storeWallet]);
    useEffect(() => {
        // getAllDataRealtime('categories', storeExpensesCategory.setData, setIsExpensesCategoryFetching);
        getAllDataRealtime('wallets', storeWallet.setData, setIsWalletFetching);
        // const returnCategoriesDefault = async () => {
        //     setIsFetching(true);
        //     return await getAllDataRealtime('categories', storeCategories.setData, setIsCategoriesFetching);
        // }
    }, []);
}