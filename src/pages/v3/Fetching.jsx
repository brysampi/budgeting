import { walletStorage } from '../../library/zustand/storage';
import { getAllDataRealTimeController } from '../../library/firebase/controller';
import { useEffect } from 'react';

export default function Fetching({ setIsFetching }) {
    // wallet storage
    const storeWallet = walletStorage((state) => state);
    useEffect(() => {
        getAllDataRealTimeController('wallets', storeWallet.setData, setIsFetching);
    }, []);
}