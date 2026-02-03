import Card from '../cards/Card';
import ProgressBar from '../charts/ProgressBar';
import { IconCard } from '../../assets/Icons';

const Category = ({ title, spent, total, icon, iconName, colorClass, iconColorClass, barColor }) => {
    const remaining = total - spent;
    const categoryId = `category-${title.replace(/\s+/g, '-').toLowerCase()}`;
    const isOver = spent > total;

    return (
        <Card padding="p-4" noHover={true} className={`group ${categoryId} h-[110px] flex flex-col justify-between`}>
            {/* 1. Custom Header (Icon | Title/Budget | Status) */}
            <div className="flex items-start justify-between w-full mb-2">
                <div className="flex items-center gap-3">
                    {/* Premium Icon Container */}
                    <IconCard
                        name={iconName || "FaHouse"}
                        colorClass={colorClass}
                        iconColorClass={iconColorClass}
                        className="!w-9 !h-9 shadow-sm"
                        size={18}
                    />

                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[var(--color-light)] group-hover:text-[var(--color-theme-important)] transition-all leading-tight">
                            {title}
                        </span>
                        <span className="text-[10px] text-[var(--color-theme-secondary-text)] font-semibold mt-0.5 opacity-50">
                            ${spent.toLocaleString()} of ${total.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Right Aligned Status Label */}
                <div className="pt-0.5">
                    <span className="text-[10px] text-[var(--color-theme-secondary-text)] font-bold opacity-70">
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
