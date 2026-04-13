import { expensesCategoryStore, walletStorage } from '../../library/zustand/storage';
import { getAllDataRealTimeController } from '../../library/firebase/controller';
import { useEffect, useState } from 'react';

export default function Fetching({ setIsFetching }) {
    const [isExpensesCategoryFetching, setIsExpensesCategoryFetching] = useState(true);
    const storeExpensesCategory = expensesCategoryStore((state) => state);
    // wallet storage
    const [isWalletFetching, setIsWalletFetching] = useState(true);
    const storeWallet = walletStorage((state) => state);

    useEffect(() => {
        getAllDataRealTimeController('expenses', storeExpensesCategory.setData, setIsExpensesCategoryFetching);
        getAllDataRealTimeController('wallets', storeWallet.setData, setIsWalletFetching);

    }, []);
}