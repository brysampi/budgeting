import React from 'react';

const DashboardWidget = ({ title, children, className = '', loading = false }) => {
    return (
        <div className={`card card-main flex flex-col h-full ${className}`}>
            {title && (
                <div className="mb-4 border-b border-[var(--color-theme-tertiary)] pb-2">
                    <h3 className="text-lg font-bold text-[var(--color-light)]">{title}</h3>
                </div>
            )}
            <div className="flex-1 w-full min-h-[300px] relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-theme-secondary)] z-10">
                        <div className="animate-pulse flex flex-col items-center w-full h-full justify-center">
                            <div className="h-4 w-32 bg-[var(--color-theme-tertiary)] rounded mb-4"></div>
                            <div className="h-40 w-40 bg-[var(--color-theme-tertiary)] rounded-full"></div>
                        </div>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default DashboardWidget;
