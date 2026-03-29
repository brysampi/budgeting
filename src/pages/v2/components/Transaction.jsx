import { useEffect, useState } from 'react';
import { IconCard, Icons } from '../../../assets/Icons';
import Card from '../../../components/cards/Card';
import { getAllTransactions } from '../../../library/firebase/controller';
import { getTodayDate, convertToDate } from '../../../library/firebase/utils';

const Transaction = ({ paramMonth = new Date().toISOString().slice(0, 7), onClick = () => { } }) => {
    const [transactionsData, setTransactionsData] = useState([]);
    const [isTransactionsExpanded, setIsTransactionsExpanded] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        setIsFetching(true);
        // Use paramMonth if provided, otherwise default to today's month
        const month = paramMonth || getTodayDate().slice(0, 7);
        const unsubscribe = getAllTransactions(paramMonth, (data) => {
            setTransactionsData(data);
            setIsFetching(false);
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, [paramMonth]);
    useEffect(() => {
        console.log('transactionsData: ', transactionsData)
    }, [transactionsData]);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-bold text-[var(--color-light)] tracking-tight">Recent Transactions</h2>
            </div>

            <div className="flex flex-col gap-3">
                {isFetching ? (
                    <div className="w-full h-[110px] rounded-2xl border-2 border-dashed border-[var(--color-theme-important)]/30 bg-[var(--color-theme-important)]/5 flex items-center justify-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-theme-important)]/10 flex items-center justify-center">
                            <Icons.LuLoader size={24} className="text-[var(--color-theme-important)] animate-spin" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-bold text-[var(--color-theme-important)]">Fetching Transactions</span>
                    </div>
                ) : transactionsData.length === 0 ? (
                    <button
                        onClick={onClick}
                        className="w-full h-[110px] rounded-2xl border-2 border-dashed border-[var(--color-theme-important)]/30 bg-[var(--color-theme-important)]/5 flex items-center justify-center gap-4 hover:bg-[var(--color-theme-important)]/10 hover:border-[var(--color-theme-important)]/50 transition-all cursor-pointer group"
                    >
                        <div className="w-10 h-10 rounded-full bg-[var(--color-theme-important)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icons.LuPlus size={24} className="text-[var(--color-theme-important)]" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-bold text-[var(--color-theme-important)]">Add New Transaction</span>
                    </button>
                ) : (
                    <>
                        <Card noHover={true} padding="p-2 md:p-4">
                            <div className="flex flex-col gap-1">
                                {transactionsData
                                    .slice(0, isTransactionsExpanded ? 50 : 5)
                                    .map((t) => (
                                        <div key={t.id} className="flex items-center justify-between p-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all rounded-2xl cursor-pointer group active:scale-[0.99]">
                                            <div className="flex items-center gap-4">
                                                <IconCard
                                                    name={t.icon || "FaWallet"}
                                                    iconColor={t.iconBackground}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-[var(--color-light)] font-bold text-sm md:text-base leading-tight group-hover:text-[var(--color-theme-important)] transition-colors">
                                                        {t.title}
                                                    </span>
                                                    <span className="text-[var(--color-theme-secondary-text)] text-[11px] font-medium mt-1">
                                                        {t.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end">
                                                <span className={`font-extrabold text-sm md:text-base ${t.amount > 0 ?
                                                    t.type === 'billsExtension' ||
                                                        t.type === 'expensesTracker' ?
                                                        'text-[var(--color-danger)]' :
                                                        'text-[#34A853]'
                                                    : ''
                                                    }`}>
                                                    {
                                                        (
                                                            t.amount > 0 ?
                                                                t.type === 'billsExtension' ||
                                                                    t.type === 'expensesTracker' ?
                                                                    '-' :
                                                                    '+'
                                                                : ''

                                                        ) +
                                                        Math.abs(t.amount).toLocaleString(
                                                            undefined,
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            }
                                                        )
                                                    }
                                                </span>
                                                <span className="text-[var(--color-theme-secondary-text)] text-[10px] font-semibold mt-1 uppercase tracking-wider opacity-50">
                                                    {convertToDate(t.date)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </Card>

                        {transactionsData.length > 5 && (
                            <button
                                onClick={() => setIsTransactionsExpanded(!isTransactionsExpanded)}
                                className="w-full py-3 rounded-2xl border border-[var(--color-theme-secondary)] text-[var(--color-theme-secondary-text)] font-semibold text-xs hover:bg-[var(--color-theme-secondary)]/5 transition-all flex items-center justify-center gap-2 group mt-2"
                            >
                                <span>{isTransactionsExpanded ? 'View Less' : `View More (${transactionsData.length - 5} more)`}</span>
                                <Icons.LuArrowLeft className={`transition-transform duration-300 ${isTransactionsExpanded ? 'rotate-90' : '-rotate-90'}`} size={14} />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Transaction;

