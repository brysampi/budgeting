import { useEffect, useState } from "react"
import { convertToDate, accurateDecimal } from "../../../library/utils"
import { walletStorage } from "../../../library/zustand/storage"
import { undoTransaction, getTransactions, loadMoreTransactions } from "../../../library/firebase/v3/controller"

const PAGE_SIZE = 5;

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadingUndo, setLoadingUndo] = useState(false);

    const storedWallets = walletStorage((state) => state.data) || [];

    useEffect(() => {
        const unsub = getTransactions('', setTransactions, setIsFetching, setLastDoc);
        return () => { if (typeof unsub === 'function') unsub(); }
    }, []);

    const handleLoadMore = async () => {
        if (!lastDoc) return;
        setLoadingMore(true);
        const result = await loadMoreTransactions(lastDoc);
        console.log('loadMoreTransactions result:', result);
        if (result.data.length > 0) {
            setTransactions((prev) => [...prev, ...result.data]);
        }
        setLastDoc(result.hasMore ? result.lastDoc : null);
        setLoadingMore(false);
    }

    const handleUndo = async (paramMonth, id, amount, type, walletId, initialWalletBalance) => {
        setLoadingUndo(true)
        const result = await undoTransaction(paramMonth, id, amount, type, walletId, initialWalletBalance)
        setLoadingUndo(false)
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-bold text-[var(--color-light)]">Transactions</h2>
                <div className="text-xs text-[var(--color-theme-secondary-text)] font-medium flex items-center gap-3">
                    <button
                        onClick={() => console.log('View All Transactions')}
                        className="hover:text-[var(--color-theme-important)] text-xs text-[var(--color-theme-secondary-text)] font-medium">
                        {transactions.length} {transactions.length === 1 ? 'Transaction' : 'Transactions'}
                    </button>
                </div>
            </div>

            {/* loop here */}
            <div className="flex flex-col gap-4">
                {transactions.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        {index === 0 && (
                            <div>
                                <button
                                    disabled={loadingUndo}
                                    onClick={() => handleUndo(
                                        convertToDate(item.date),
                                        item.id, item.amount,
                                        item.type,
                                        item.wallet,
                                        accurateDecimal(storedWallets.find((wallet) => wallet.id === item.wallet).balance)
                                    )}>
                                    {loadingUndo ? 'Undoing...' : 'Undo'}
                                </button>
                            </div>
                        )}
                        <div>
                            <p className='text-xs sm:text-base text-[var(--color-light)] font-medium'>{item.description}</p>
                            <div className="flex flex-col gap-1">
                                {/* <p className="text-base font-semibold text-[var(--color-light)]">{item.category}</p> */}
                                <p className="text-xs text-[var(--color-theme-secondary-text)]">{item.type.charAt(0).toUpperCase() + item.type.slice(1)} - {item.date.toDate().getMonth() + 1}-{item.date.toDate().getDate()}</p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className={`text-xs sm:text-base whitespace-nowrap ${item.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>{item.type === 'income' ? `${item.amount}` : `-${item.amount}`}</p>
                            <div className="flex flex-col gap-1">
                                {/* <p className="text-base font-semibold text-[var(--color-light)]">{item.category}</p> */}
                                <p className="text-xs sm:text-base whitespace-nowrap text-[var(--color-theme-secondary-text)]">Balance : {item.walletBalance}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {lastDoc && (
                <div className="flex justify-center mt-6">
                    <button
                        id="btn-load-more-transactions"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="group flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold border border-[var(--color-theme-secondary-text)] text-[var(--color-theme-secondary-text)] hover:border-[var(--color-theme-important)] hover:text-[var(--color-theme-important)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
                        {loadingMore ? (
                            <>
                                <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                                Load More
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
