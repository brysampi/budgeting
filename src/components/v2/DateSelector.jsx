import React, { useState } from 'react';
import { Icons } from '../../assets/Icons';

const DateSelector = ({ dates = [], onChange }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        if (currentIndex < dates.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            onChange(dates[newIndex]);
        }
    };

    const handleNext = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            onChange(dates[newIndex]);
        }
    };

    // Helper to format "5-2026" to "May 2026"
    const formatLabel = (dateStr) => {
        const [month, year] = dateStr.split('-');
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return `${monthNames[parseInt(year) - 1]} ${month}`;
    };

    return (
        <>

            <div className="flex items-center justify-center gap-6 mb-2">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex >= dates.length - 1}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-theme-secondary)]/50 text-[var(--color-theme-secondary-text)] hover:bg-[var(--color-theme-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <Icons.LuChevronLeft size={20} />
                </button>

                <span className="text-lg font-bold text-[var(--color-light)] min-w-[140px] text-center">
                    {dates.length > 0 ? formatLabel(dates[currentIndex]) : 'No Transactions'}
                </span>

                <button
                    onClick={handleNext}
                    disabled={currentIndex <= 0}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-theme-secondary)]/50 text-[var(--color-theme-secondary-text)] hover:bg-[var(--color-theme-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <Icons.LuChevronRight size={20} />
                </button>
            </div>

        </>
    );
};

export default DateSelector;
