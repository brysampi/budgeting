import React, { useState } from 'react';

const defaultData = [
    { name: 'Budget', value: 0, max: 100 },
];

const ProgressBar = ({
    data = defaultData,
    label,
    showPercentage = true,
    showBreakdown = false,
    primaryColor = 'var(--color-theme-important)',
    secondaryColor = 'var(--color-theme-important-light)',
    backgroundColor = '#5a5959',
    className = '',
    showControls = false  // New prop to show/hide controls
}) => {
    const [showFilledTooltip, setShowFilledTooltip] = useState(false);
    const [showEmptyTooltip, setShowEmptyTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Display controls state
    const [displayPercentage, setDisplayPercentage] = useState(showPercentage);
    const [displayValues, setDisplayValues] = useState(true);
    const [displayWarning, setDisplayWarning] = useState(true);

    // Extract values from data
    const item = data[0] || defaultData[0];
    const current = item.value || 0;
    const max = item.max || 100;
    const displayLabel = label || item.name || 'Progress';
    const remaining = Math.max(max - current, 0);

    // Calculate if over budget
    const isOverBudget = current > max;
    const withinBudget = Math.min(current, max);
    const overBudget = isOverBudget ? current - max : 0;

    // Calculate percentages
    const withinBudgetPercent = max > 0 ? (withinBudget / max) * 100 : 0;
    const overBudgetPercent = max > 0 ? (overBudget / max) * 100 : 0;
    const totalPercent = max > 0 ? (current / max) * 100 : 0;

    // Check for income/expenses in data
    let income = 0;
    let expenses = 0;
    const incomeItem = data.find(item => item.name?.toLowerCase() === 'income');
    const expensesItem = data.find(item => item.name?.toLowerCase() === 'expenses');
    if (incomeItem) income = incomeItem.value || 0;
    if (expensesItem) expenses = expensesItem.value || 0;

    const handleFilledMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setShowFilledTooltip(true);
        setShowEmptyTooltip(false);
    };

    const handleFilledMouseLeave = () => {
        setShowFilledTooltip(false);
    };

    const handleEmptyMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setShowEmptyTooltip(true);
        setShowFilledTooltip(false);
    };

    const handleEmptyMouseLeave = () => {
        setShowEmptyTooltip(false);
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Label and Controls */}
            <div className="flex items-center justify-between mb-2">
                <div className="text-[var(--color-light)] font-medium">
                    {displayLabel}
                </div>

                {/* Display Controls */}
                {showControls && (
                    <div className="flex gap-4 text-xs">
                        <label className="flex items-center gap-1 cursor-pointer text-[var(--color-light)]">
                            <input
                                type="checkbox"
                                checked={displayPercentage}
                                onChange={(e) => setDisplayPercentage(e.target.checked)}
                                className="cursor-pointer"
                            />
                            <span>%</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer text-[var(--color-light)]">
                            <input
                                type="checkbox"
                                checked={displayValues}
                                onChange={(e) => setDisplayValues(e.target.checked)}
                                className="cursor-pointer"
                            />
                            <span>Values</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer text-[var(--color-light)]">
                            <input
                                type="checkbox"
                                checked={displayWarning}
                                onChange={(e) => setDisplayWarning(e.target.checked)}
                                className="cursor-pointer"
                            />
                            <span>Warning</span>
                        </label>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-2">
                <div className="w-full bg-[#5a5959] rounded-full h-2 relative">
                    {/* Filled Bar with Tooltip */}
                    <div
                        className="h-2 rounded-full transition-all duration-500 cursor-pointer relative z-10"
                        style={{
                            width: `${Math.min(totalPercent, 100)}%`,
                            background: isOverBudget
                                ? 'linear-gradient(to right, var(--color-danger), #ff0000)'
                                : 'linear-gradient(to right, var(--color-theme-important-light), var(--color-theme-important))'
                        }}
                        onMouseMove={handleFilledMouseMove}
                        onMouseLeave={handleFilledMouseLeave}
                    >
                        {/* Filled Tooltip */}
                        {showFilledTooltip && (
                            <div
                                className="absolute bg-[var(--color-theme-tertiary)] p-2 rounded shadow-lg border border-[var(--color-theme-important)] z-20 pointer-events-none"
                                style={{
                                    left: `${tooltipPosition.x}px`,
                                    top: `${tooltipPosition.y - 40}px`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <p className="label text-[var(--color-light)] font-bold text-xs whitespace-nowrap">
                                    {isOverBudget ? 'Over Budget' : 'Current'}: {current.toLocaleString()} ({totalPercent.toFixed(1)}%)
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Empty Bar with Tooltip */}
                    {!isOverBudget && (
                        <div
                            className="absolute top-0 right-0 h-2 rounded-full cursor-pointer z-5"
                            style={{
                                width: `${100 - totalPercent}%`,
                            }}
                            onMouseMove={handleEmptyMouseMove}
                            onMouseLeave={handleEmptyMouseLeave}
                        >
                            {/* Empty Tooltip */}
                            {showEmptyTooltip && (
                                <div
                                    className="absolute bg-[var(--color-theme-tertiary)] p-2 rounded shadow-lg border border-[var(--color-theme-important)] z-20 pointer-events-none"
                                    style={{
                                        left: `${tooltipPosition.x}px`,
                                        top: `${tooltipPosition.y - 40}px`,
                                        transform: 'translateX(-50%)'
                                    }}
                                >
                                    <p className="label text-[var(--color-light)] font-bold text-xs whitespace-nowrap">
                                        Remaining: {remaining.toLocaleString()} ({(100 - totalPercent).toFixed(1)}%)
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {displayPercentage && (
                    <div className={isOverBudget ? 'text-[var(--color-danger)]' : ''}>
                        {totalPercent.toFixed(1)}%
                    </div>
                )}
            </div>

            {/* Over Budget Warning */}
            {isOverBudget && displayWarning && (
                <div className="flex items-center gap-2 mb-2 text-xs text-[var(--color-danger)]">
                    <span className="font-semibold">⚠ Over Budget:</span>
                    <span>{overBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            )}

            {/* Breakdown Section */}
            {showBreakdown && (income > 0 || expenses > 0) && (
                <div className="flex flex-col justify-between sm:flex-row gap-2 text-sm">
                    {income > 0 && (
                        <div className="flex flex-row gap-2">
                            <div className="text-[var(--color-light)]">Income</div>
                            <div className="text-[var(--color-success)] font-semibold">
                                {income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    )}
                    {expenses > 0 && (
                        <div className="flex flex-row gap-2">
                            <div className="text-[var(--color-light)]">Expenses</div>
                            <div className="text-[var(--color-danger)] font-semibold">
                                {expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Current/Max Display */}
            {displayValues && (
                <div className="flex justify-between text-xs text-[var(--color-theme-tertiary-light)] mt-1">
                    <span className={isOverBudget ? 'text-[var(--color-danger)]' : ''}>
                        Current: {current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span>Max: {max.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            )}
        </div>
    );
};

export default ProgressBar;
