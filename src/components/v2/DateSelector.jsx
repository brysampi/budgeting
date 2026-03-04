import React, { useState } from 'react';
import { Icons } from '../../assets/Icons';
import { convertToDate } from '../../firebase/utils';

const DateSelector = ({ collectedData = [], currentIndex = 0, onChange }) => {

    const handlePrevious = () => {
        if (currentIndex < collectedData.length - 1) {
            onChange(currentIndex + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex > 0) {
            onChange(currentIndex - 1);
        }
    };

    // Helper to format "2026-05" to "May 2026"
    const formatLabel = (dateStr) => {
        const [year, month] = dateStr.split('-');
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        // console.log(parseInt(month) - 1)
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    };

    return (
        <>

            <div className="flex items-center justify-center gap-6 mb-2">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex >= collectedData.length - 1}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-theme-secondary)]/50 text-[var(--color-theme-secondary-text)] hover:bg-[var(--color-theme-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <Icons.LuChevronLeft size={20} />
                </button>

                <span className="text-lg font-bold text-[var(--color-light)] min-w-[140px] text-center">
                    {collectedData.length > 0 ? formatLabel(convertToDate(collectedData[currentIndex].date)) : 'No Transactions'}
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
