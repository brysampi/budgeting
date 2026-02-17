import { IconCard } from '../../assets/Icons';

const Transaction = ({ title, category, amount, date, icon, iconName, iconColor }) => {
    const isIncome = amount > 0;
    const formattedAmount = (isIncome ? '+' : '-') + '$' + Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex items-center justify-between p-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all rounded-2xl cursor-pointer group active:scale-[0.99]">
            <div className="flex items-center gap-4">
                {/* Circular Icon Container */}
                <IconCard
                    name={iconName || "FaWallet"}
                    iconColor={iconColor}
                />

                {/* Details */}
                <div className="flex flex-col">
                    <span className="text-[var(--color-light)] font-bold text-sm md:text-base leading-tight group-hover:text-[var(--color-theme-important)] transition-colors">
                        {title}
                    </span>
                    <span className="text-[var(--color-theme-secondary-text)] text-[11px] font-medium mt-1">
                        {category}
                    </span>
                </div>
            </div>

            {/* Amount & Date */}
            <div className="flex flex-col items-end">
                <span className={`font-extrabold text-sm md:text-base ${isIncome ? 'text-[#34A853]' : 'text-[var(--color-danger)]'}`}>
                    {formattedAmount}
                </span>
                <span className="text-[var(--color-theme-secondary-text)] text-[10px] font-semibold mt-1 uppercase tracking-wider opacity-50">
                    {date}
                </span>
            </div>
        </div>
    );
};

export default Transaction;
