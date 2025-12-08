import React, { useState } from 'react';

const defaultData = [
    { name: 'Budget', value: 0, max: 100 },
];

function ProgressBar({
    data = defaultData,
    className = '',
    showBreakdown = false,
    enableDropdown = true,
    showPercentage = true,
    showWarning = false,
    showValues = false,
}) {
    const isMulti = Array.isArray(data) && data.length > 0 && data[0].data;
    const [showDropdown, setShowDropdown] = useState(false);
    const [visibleItems, setVisibleItems] = useState(() => {
        if (isMulti) {
            return data.reduce((acc, item, idx) => {
                acc[item.id || idx] = true;
                return acc;
            }, {});
        }
        return { 0: true };
    });

    function toggleVisibility(id) {
        setVisibleItems(prev => ({ ...prev, [id]: !prev[id] }));
    }

    if (isMulti) {
        // Global controls for all bars
        const [globalPercentage, setGlobalPercentage] = useState(showPercentage);
        const [globalWarning, setGlobalWarning] = useState(showWarning);
        const [globalValues, setGlobalValues] = useState(showValues);
        return (
            <div className={`relative ${className}`}>
                {/* Dropdown Menu Button */}
                {enableDropdown && (
                    <div className="absolute top-0 right-0 z-50">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="text-[var(--color-light)] hover:text-[var(--color-theme-important)] p-2 text-xl font-bold"
                        >
                            ⋮
                        </button>
                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 bg-[var(--color-theme-secondary)] border border-[var(--color-theme-tertiary)] rounded-lg shadow-lg p-3 min-w-[220px]">
                                <div className="text-[var(--color-light)] text-xs font-semibold mb-2">Global Controls:</div>
                                <label className="flex items-center gap-2 cursor-pointer text-[var(--color-light)] text-sm mb-2 hover:text-[var(--color-theme-important)]">
                                    <input
                                        type="checkbox"
                                        checked={globalPercentage}
                                        onChange={() => setGlobalPercentage(v => !v)}
                                        className="cursor-pointer"
                                    />
                                    <span>% Value</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-[var(--color-light)] text-sm mb-2 hover:text-[var(--color-theme-important)]">
                                    <input
                                        type="checkbox"
                                        checked={globalWarning}
                                        onChange={() => setGlobalWarning(v => !v)}
                                        className="cursor-pointer"
                                    />
                                    <span>Warning</span>
                                </label>
                                {/* <hr className="my-2 border-t border-[var(--color-theme-tertiary)]" /> */}
                                {/* <div className="text-[var(--color-light)] text-xs font-semibold mb-2">Values:</div> */}
                                <label className="flex items-center gap-2 cursor-pointer text-[var(--color-light)] text-sm mb-2 hover:text-[var(--color-theme-important)]">
                                    <input
                                        type="checkbox"
                                        checked={globalValues}
                                        onChange={() => setGlobalValues(v => !v)}
                                        className="cursor-pointer"
                                    />
                                    <span>Show Values</span>
                                </label>
                                <hr className="my-2 border-t border-[var(--color-theme-tertiary)]" />
                                <div className="text-[var(--color-light)] text-xs font-semibold mb-2">Show Progress Bars:</div>
                                {data.map((bar, idx) => (
                                    <label key={bar.id || idx} className="flex items-center gap-2 cursor-pointer text-[var(--color-light)] text-sm mb-2 hover:text-[var(--color-theme-important)]">
                                        <input
                                            type="checkbox"
                                            checked={visibleItems[bar.id || idx]}
                                            onChange={() => toggleVisibility(bar.id || idx)}
                                            className="cursor-pointer"
                                        />
                                        <span>{bar.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <div className="flex flex-col gap-6 p-4">
                    {data.map((bar, idx) => (
                        visibleItems[bar.id || idx] && (
                            <SingleProgressBar
                                key={bar.id || idx}
                                data={bar.data}
                                label={bar.name}
                                showPercentage={globalPercentage}
                                showBreakdown={showBreakdown}
                                displayWarning={globalWarning}
                                displayValues={globalValues}
                                currentLabel={bar.currentLabel}
                                remainingLabel={bar.remainingLabel}
                            />
                        )
                    ))}
                </div>
            </div>
        );
    }
    // Otherwise, render a single bar
    return <SingleProgressBar
        data={data}
        className={className}
        showPercentage={showPercentage}
        showBreakdown={showBreakdown}
        currentLabel={currentLabel}
        remainingLabel={remainingLabel}
    />;
}

function SingleProgressBar({
    data = defaultData,
    label,
    showPercentage = true,
    showBreakdown = false,
    className = '',
    displayWarning = true,
    displayValues = true,
    currentLabel = 'Current',
    remainingLabel = 'Remaining',
}) {
    // Always use showPercentage from props for global control
    const displayPercentage = showPercentage;
    const [localValues, setLocalValues] = useState(displayValues);
    // Use displayWarning from props if provided
    const [localWarning, setLocalWarning] = useState(displayWarning);
    // Tooltip logic
    const [tooltip, setTooltip] = useState({ visible: false, type: null, x: 0, y: 0 });

    // Extract values from data
    const item = data[0] || defaultData[0];
    const current = item.value || 0;
    const max = item.max || 100;
    const displayLabel = label || item.name || 'Progress';
    const remaining = Math.max(max - current, 0);

    // Calculate if over budget
    const isOverBudget = current > max;
    const overBudget = isOverBudget ? current - max : 0;

    // Calculate percentage of max used
    const totalPercent = max > 0 ? (current / max) * 100 : 0;

    // Check for income/expenses in data
    // let income = 0;
    // let expenses = 0;
    // const incomeItem = data.find(item => item.name?.toLowerCase() === 'income');
    // const expensesItem = data.find(item => item.name?.toLowerCase() === 'expenses');
    // if (incomeItem) income = incomeItem.value || 0;
    // if (expensesItem) expenses = expensesItem.value || 0;

    const handleFilledMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({ visible: true, type: 'filled', x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const handleFilledMouseLeave = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };
    const handleEmptyMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({ visible: true, type: 'empty', x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const handleEmptyMouseLeave = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="text-[var(--color-light)] font-medium">
                    {displayLabel}
                </div>
            </div>
            {/* Display Controls */}
            <div className="flex gap-4 text-xs mb-2">
                {/* Local values toggle hidden if global control is present */}
                {typeof displayValues === 'undefined' ? (
                    <label className="flex items-center gap-1 cursor-pointer text-[var(--color-light)]">
                        <input
                            type="checkbox"
                            checked={localValues}
                            onChange={(e) => setLocalValues(e.target.checked)}
                            className="cursor-pointer"
                        />
                        <span>Values</span>
                    </label>
                ) : null}
                {/* Local warning toggle hidden if global control is present */}
                {typeof displayWarning === 'undefined' ? (
                    <label className="flex items-center gap-1 cursor-pointer text-[var(--color-light)]">
                        <input
                            type="checkbox"
                            checked={localWarning}
                            onChange={(e) => setLocalWarning(e.target.checked)}
                            className="cursor-pointer"
                        />
                        <span>Warning</span>
                    </label>
                ) : null}
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
                        {tooltip.visible && tooltip.type === 'filled' && (
                            <div
                                className="absolute bg-[var(--color-theme-tertiary)] p-2 rounded shadow-lg border border-[var(--color-theme-important)] z-20 pointer-events-none"
                                style={{
                                    left: `${tooltip.x}px`,
                                    top: `${tooltip.y - 40}px`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <p className="label text-[var(--color-light)] font-bold text-xs whitespace-nowrap">
                                    {isOverBudget ? 'Over Budget' : currentLabel}: {current.toLocaleString()} ({totalPercent.toFixed(1)}%)
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
                            {tooltip.visible && tooltip.type === 'empty' && (
                                <div
                                    className="absolute bg-[var(--color-theme-tertiary)] p-2 rounded shadow-lg border border-[var(--color-theme-important)] z-20 pointer-events-none"
                                    style={{
                                        left: `${tooltip.x}px`,
                                        top: `${tooltip.y - 40}px`,
                                        transform: 'translateX(-50%)'
                                    }}
                                >
                                    <p className="label text-[var(--color-light)] font-bold text-xs whitespace-nowrap">
                                        {remainingLabel}: {remaining.toLocaleString()} ({(100 - totalPercent).toFixed(1)}%)
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
            {/* {showBreakdown && (income > 0 || expenses > 0) && (
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
            )} */}

            {/* Current/Max Display */}
            {displayValues && (
                <div className="flex justify-between text-xs text-[var(--color-theme-tertiary-light)] mt-1">
                    <span className={isOverBudget ? 'text-[var(--color-danger)]' : ''}>
                        {currentLabel}: {current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span>Max: {max.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            )}
        </div>
    );
}

export default ProgressBar;
// End of file

