import React, { useState, useEffect, useRef } from 'react';

/**
 * A reusable, dynamic dropdown component.
 * @param {React.ReactNode} trigger - The element that triggers the dropdown (e.g., a button).
 * @param {Array} items - Array of objects: { label: string, icon: ReactElement, onClick: function, type: 'danger' | 'default' }
 * @param {string} position - 'left' | 'right' (default: 'right')
 */
const Dropdown = ({ trigger, items = [], position = 'right' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* Trigger element with added onClick to toggle */}
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>

            {/* Menu */}
            {isOpen && (
                <div
                    className={`absolute z-[100] mt-2 w-56 rounded-2xl bg-[var(--color-theme-secondary)] border border-black/[0.08] dark:border-white/[0.05] shadow-xl transition-all duration-300 origin-top-right ${position === 'right' ? 'right-0' : 'left-0'
                        } animate-dropdown`}
                >
                    <div className="p-2 flex flex-col gap-1">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.onClick?.();
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${item.type === 'danger'
                                    ? 'text-red-500 hover:bg-red-500/10'
                                    : 'text-[var(--color-theme-secondary-text)] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-[var(--color-light)]'
                                    }`}
                            >
                                {item.icon && <span className="opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
