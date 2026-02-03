import React from 'react';
import { LuPlus, LuCreditCard } from 'react-icons/lu';

const WalletCard = ({ name, balance, isAddCard, onClick }) => {
    if (isAddCard) {
        return (
            <button
                onClick={onClick}
                className="w-full max-w-[360px] min-w-[288px] h-[150px] shrink-0 rounded-2xl border-2 border-dashed border-[var(--color-theme-important)]/30 bg-[var(--color-theme-important)]/5 flex flex-col items-center justify-center gap-3 hover:bg-[var(--color-theme-important)]/10 hover:border-[var(--color-theme-important)]/50 transition-all cursor-pointer group snap-center"
            >
                <div className="w-14 h-14 rounded-full bg-[var(--color-theme-important)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LuPlus size={28} className="text-[var(--color-theme-important)]" strokeWidth={2.5} />
                </div>
                <span className="text-base font-semibold text-[var(--color-theme-important)]">Add Card</span>
            </button>
        );
    }

    return (
        <div
            onClick={onClick}
            className="w-full max-w-[360px] min-w-[288px] h-[150px] shrink-0 rounded-2xl bg-gradient-to-br from-[var(--color-theme-important)] to-[var(--color-theme-important-dark)] p-6 flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl relative overflow-hidden group snap-center"
        >
            {/* Card Pattern Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-28 h-28 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-start justify-between">
                <LuCreditCard size={28} className="text-white/80" strokeWidth={2} />
                <div className="w-12 h-8 rounded bg-white/20 backdrop-blur-sm" />
            </div>

            <div className="relative z-10">
                <div className="text-white/90 text-sm font-medium mb-2 truncate">{name}</div>
                <div className="text-white text-xl font-bold">${balance.toLocaleString()}</div>
            </div>
        </div>
    );
};

const WalletCardsSection = ({ cards = [], onAddCard, onSelectCard }) => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-bold text-[var(--color-light)]">My Cards</h2>
                <span className="text-xs text-[var(--color-theme-secondary-text)] font-medium">
                    {cards.length} {cards.length === 1 ? 'card' : 'cards'}
                </span>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
                {cards.map((card, index) => (
                    <WalletCard
                        key={index}
                        name={card.name}
                        balance={card.balance}
                        onClick={() => onSelectCard?.(card)}
                    />
                ))}
                <WalletCard isAddCard onClick={onAddCard} />
            </div>
        </div>
    );
};

export default WalletCardsSection;
