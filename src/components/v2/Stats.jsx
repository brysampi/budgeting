import Card from '../cards/Card';
import { IconCard } from '../../assets/Icons';

const Stats = ({ title, amount, icon, iconName, badgeValue, subtext, iconColorClass, badgeColorClass, amountColorClass }) => {
    return (
        <Card padding="p-3.5" className="group h-[130px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
                {/* Circular Icon Container */}
                <IconCard
                    name={iconName || "FaWallet"}
                    iconColorClass={iconColorClass}
                    className="!w-10 !h-10"
                    size={18}
                />

                {/* Optional Percentage Badge */}
                {badgeValue && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColorClass}`}>
                        {badgeValue}
                    </span>
                )}
            </div>

            {/* Title */}
            <p className="text-[var(--color-theme-secondary-text)] text-[11px] font-normal mb-1 group-hover:text-[var(--color-theme-important)] transition-colors">
                {title}
            </p>

            {/* Amount */}
            <h3 className={`text-xl font-bold tracking-tight leading-none ${amountColorClass || 'text-[var(--color-light)]'}`}>
                {amount}
            </h3>

            {/* Subtext */}
            {subtext && (
                <p className="text-[10px] text-[var(--color-theme-secondary-text)] font-normal opacity-60 mt-0.5">
                    {subtext}
                </p>
            )}
        </Card>
    );
};

export default Stats;
