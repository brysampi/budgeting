import Card from '../cards/Card';
import ProgressBar from '../charts/ProgressBar';
import { IconCard } from '../../assets/Icons';

const Category = ({ title, spent, total, icon, iconName, colorClass, iconColorClass, barColor }) => {
    const remaining = total - spent;
    const categoryId = `category-${title.replace(/\s+/g, '-').toLowerCase()}`;
    const isOver = spent > total;

    return (
        <Card padding="p-5" noHover={true} className={`group ${categoryId}`}>
            {/* 1. Custom Header (Icon | Title/Budget | Status) */}
            <div className="flex items-start justify-between w-full mb-2">
                <div className="flex items-center gap-4">
                    {/* Premium Icon Container */}
                    <IconCard
                        name={iconName || "FaHouse"}
                        colorClass={colorClass}
                        iconColorClass={iconColorClass}
                        className="!w-12 !h-12 shadow-sm"
                        size={22}
                    />

                    <div className="flex flex-col">
                        <span className="text-base md:text-lg font-bold text-[var(--color-light)] group-hover:text-[var(--color-theme-important)] transition-all leading-tight">
                            {title}
                        </span>
                        <span className="text-[12px] md:text-[13px] text-[var(--color-theme-secondary-text)] font-semibold mt-1 opacity-50">
                            ${spent.toLocaleString()} of ${total.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Right Aligned Status Label */}
                <div className="pt-1">
                    <span className="text-[12px] md:text-[13px] text-[var(--color-theme-secondary-text)] font-bold opacity-70">
                        ${Math.abs(remaining).toLocaleString()} {isOver ? 'over' : 'left'}
                    </span>
                </div>
            </div>

            {/* 2. Progress Bar */}
            <div>
                <ProgressBar
                    data={[{ label: title, value: spent, max: Math.max(total, 0.01) }]}
                    enableDropdown={false}
                    showLabel={false}
                    showPercentage={true}
                    showWarning={false}
                    showValues={false}
                    currentLabel="Spent"
                    remainingLabel="Left"
                />
            </div>
        </Card>
    );
};

export default Category;
