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
        main: "bg-[var(--color-theme-secondary)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.08]",
        glass: "bg-[var(--color-theme-secondary)]/70 backdrop-blur-xl border border-black/[0.1] shadow-lg",
        outline: "bg-transparent border-2 border-black/[0.12]"
    };

    const hoverStyles = !noHover
        ? "hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 cursor-pointer active:scale-[0.99] hover:z-10 hover:border-black/[0.12]"
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
