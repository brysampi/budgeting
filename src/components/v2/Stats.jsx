import Card from '../cards/Card';
import { IconCard } from '../../assets/Icons';

const Stats = ({ title, amount, icon, iconName, badgeValue, subtext, iconColorClass, badgeColorClass, amountColorClass }) => {
    return (
        <Card padding="p-5" className="group flex flex-col h-full min-h-[140px]">
            <div className="flex justify-between items-start mb-auto">
                {/* Circular Icon Container */}
                <IconCard
                    name={iconName || "FaWallet"}
                    iconColorClass={iconColorClass}
                />

                {/* Optional Percentage Badge */}
                {badgeValue && (
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeColorClass} shadow-sm border border-black/[0.02]`}>
                        {badgeValue}
                    </span>
                )}
            </div>

            <div className="mt-4">
                {/* Title - Highlights on hover */}
                <p className="text-[var(--color-theme-secondary-text)] text-xs font-medium mb-1 group-hover:text-[var(--color-theme-important)] transition-colors uppercase tracking-wider">
                    {title}
                </p>
                <div className="flex flex-col">
                    <h3 className={`text-2xl font-extrabold tracking-tight ${amountColorClass || 'text-[var(--color-light)]'}`}>
                        {amount}
                    </h3>
                    {subtext && (
                        <p className="text-[10px] text-[var(--color-theme-secondary-text)] mt-1 font-medium opacity-70">
                            {subtext}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default Stats;
