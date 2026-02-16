import React, { useState } from 'react';
import { Icons, Icon } from '../../assets/Icons';
import Card from '../cards/Card';
import { useNavigate } from 'react-router-dom';

const IconLibrary = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const iconNames = Object.keys(Icons);

    const filteredIcons = iconNames.filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[var(--color-theme-secondary-text)] hover:text-[var(--color-theme-important)] transition-colors text-sm font-bold group w-fit"
                >
                    <Icons.LuArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-black text-[var(--color-light)]">Icon Library</h1>
                    <p className="text-[var(--color-theme-secondary-text)] text-sm">
                        Select the icon name to use in your categories and transactions.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icons.LuPlus className="text-[var(--color-theme-secondary-text)] rotate-45" size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search icons..."
                    className="w-full bg-[var(--color-theme-secondary)] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[var(--color-light)] focus:ring-2 focus:ring-[var(--color-theme-important)] outline-none transition-all placeholder:text-[var(--color-theme-secondary-text)]/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Icons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredIcons.map((name) => (
                    <Card
                        key={name}
                        onClick={() => {
                            navigator.clipboard.writeText(name);
                            // You could add a toast here if available
                        }}
                        className="flex flex-col items-center justify-center p-6 gap-3 group cursor-pointer active:scale-95 transition-all"
                        padding="p-6"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-[var(--color-theme-important)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon name={name} size={24} className="text-[var(--color-theme-important)]" />
                        </div>
                        <span className="text-[10px] font-bold text-[var(--color-theme-secondary-text)] truncate w-full text-center">
                            {name}
                        </span>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[var(--color-theme-important)]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center">
                            <span className="text-[10px] bg-[var(--color-theme-important)] text-white px-2 py-1 rounded-full font-bold shadow-lg">
                                Copy Name
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredIcons.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-theme-secondary-text)]">
                        <Icons.LuX size={32} />
                    </div>
                    <p className="text-[var(--color-theme-secondary-text)] font-medium">No icons found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
};

export default IconLibrary;
