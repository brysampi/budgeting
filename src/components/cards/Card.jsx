import React from 'react';

/**
 * Premium Card component for uniform UI across the dashboard.
 */
export const Card = ({
    children,
    className = '',
    noHover = false,
    variant = 'main', // 'main', 'glass', 'outline'
    padding = 'p-4 md:p-6',
    onClick
}) => {
    const baseStyles = "relative rounded-[2rem] transition-all duration-300";

    const variants = {
        main: "bg-white dark:bg-[var(--color-theme-secondary)] shadow-sm border border-black/[0.03] dark:border-white/[0.03]",
        glass: "bg-white/70 dark:bg-[var(--color-theme-secondary)]/70 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-lg",
        outline: "bg-transparent border border-black/[0.08] dark:border-white/[0.08]"
    };

    const hoverStyles = !noHover
        ? "hover:shadow-md hover:-translate-y-1 cursor-pointer active:scale-[0.99] hover:z-10"
        : "";

    return (
        <div
            className={`${baseStyles} ${variants[variant] || variants.main} ${hoverStyles} ${padding} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
