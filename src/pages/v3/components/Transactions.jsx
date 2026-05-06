import { convertToDate, accurateDecimal } from "../../../library/utils"
import { transactionStore, walletStorage } from "../../../library/zustand/storage"
import { undoTransaction } from "../../../library/firebase/v3/controller"

export default function Transactions() {
    const transactions = transactionStore((state) => state.data || [])
    const storedWallets = walletStorage((state) => state.data) || [];
    // console.log('Transactions', transactions)
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
                        <div>
                            <button onClick={() => undoTransaction(
                                convertToDate(item.date),
                                item.id, item.amount,
                                item.type,
                                item.wallet,
                                accurateDecimal(storedWallets.find((wallet) => wallet.id === item.wallet).balance)
                            )}>Undo</button>
                        </div>
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
        </div>
    )
}
