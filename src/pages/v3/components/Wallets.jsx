import React, { useEffect, useState, useMemo } from 'react';
import { Icon } from '../../../assets/Icons';
import { getAllDataRealTimeController } from '../../../library/firebase/controller';
import Modal from '../../../components/modal/Modal';
import WalletForm from '../forms/WalletForm';
import { walletStorage } from '../../../library/zustand/storage';

const Wallets = () => {
    const scrollContainerRef = React.useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const clickCard = (card) => console.log('Selected card', card);
    const clickAddCard = () => {
        console.log('Add Wallet');
        setIsModalOpen(true);
    };

    const storedWallets = walletStorage((state) => state.data) || [];

    // useEffect(() => {
    //     setIsFetching(true);
    //     getAllDataRealTimeController('wallets', setWalletsData, setIsFetching);
    // }, []);

    const walletCards = useMemo(() => {
        console.log(storedWallets)
        return storedWallets.map(wallet => ({
            name: wallet.name || 'Unnamed Wallet',
            balance: wallet.balance || 0, // Fallback to 0 if balance is missing
        })).reverse();
    }, [storedWallets]);

    // When cards load, reset scroll to the beginning so the first card is shown
    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setIsAtStart(scrollLeft < 10);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
        }
    };

    // When cards load, reset scroll and check button visibility
    useEffect(() => {
        8
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
            const timer = setTimeout(checkScrollPosition, 100);
            return () => clearTimeout(timer);
        }
    }, [storedWallets.length]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const firstCard = container.children[0];
            if (firstCard) {
                const cardWidth = firstCard.offsetWidth + 16; // 16px for gap-4
                const index = Math.round(container.scrollLeft / cardWidth);
                setActiveIndex(index);
            }
            checkScrollPosition();
        }
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320; // Approximate card width + gap
            const container = scrollContainerRef.current;

            if (direction === 'left') {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };
    return (
        <>
            <div className="w-full">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-lg font-bold text-[var(--color-light)]">My Wallets</h2>
                    <div className="text-xs text-[var(--color-theme-secondary-text)] font-medium flex items-center gap-3">
                        <button
                            onClick={() => console.log('View All Wallets')}
                            className="hover:text-[var(--color-theme-important)] text-xs text-[var(--color-theme-secondary-text)] font-medium">
                            {walletCards.length} {walletCards.length === 1 ? 'Wallet' : 'Wallets'}
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="hover:text-[var(--color-theme-important)] text-xs text-[var(--color-theme-secondary-text)] font-medium">
                            Add Wallet
                        </button>
                    </div>
                </div>

                {/* Scroll Container with Navigation Buttons */}
                <div className="relative flex items-center gap-2">
                    {/* Left Button - Tablet and up only */}
                    <button
                        onClick={() => scroll('left')}
                        className={`hidden sm:flex absolute left-0 z-20 w-10 h-10 rounded-full bg-[var(--color-theme-important)]/70 hover:bg-[var(--color-theme-important)]/90 backdrop-blur-md text-white items-center justify-center transition-all shadow-lg ${isAtStart ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}
                    >
                        <Icon name="LuChevronLeft" size={20} />
                    </button>

                    {/* Horizontal Scroll Container */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth touch-pan-x select-none sm:pl-12 sm:pr-12"
                    >
                        {
                            isFetching ?
                                <div className="w-full max-w-[360px] min-w-[288px] h-[150px] shrink-0 rounded-2xl border-2 border-dashed border-[var(--color-theme-important)]/30 bg-[var(--color-theme-important)]/5 flex flex-col items-center justify-center gap-4 group snap-center">
                                    <div className="w-14 h-14 rounded-full bg-[var(--color-theme-important)]/10 flex items-center justify-center">
                                        <Icon name="LuLoader" size={28} className="text-[var(--color-theme-important)] animate-spin" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-base font-semibold text-[var(--color-theme-important)]">Fetching Wallets</span>
                                </div>
                                :
                                <>
                                    {
                                        walletCards.map((wallet, index) => (
                                            <WalletCard
                                                key={index}
                                                name={wallet.name}
                                                balance={wallet.balance}
                                                onClick={() => clickCard?.(wallet)}
                                            />
                                        ))}
                                    <WalletCard isAddCard onClick={clickAddCard} />
                                </>
                        }

                    </div>

                    {/* Right Button - Tablet and up only */}
                    <button
                        onClick={() => scroll('right')}
                        className={`hidden sm:flex absolute right-0 z-20 w-10 h-10 rounded-full bg-[var(--color-theme-important)]/70 hover:bg-[var(--color-theme-important)]/90 backdrop-blur-md text-white items-center justify-center transition-all shadow-lg ${isAtEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}
                    >
                        <Icon name="LuChevronRight" size={20} />
                    </button>
                </div>

                {/* Scroll Indicators */}
                <div className="flex justify-center gap-1.5 mt-2">
                    {[...Array(walletCards.length)].map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex
                                ? 'bg-[var(--color-theme-important)] w-5'
                                : 'bg-black/10 dark:bg-white/10 w-1.5'
                                }`}
                        />
                    ))}
                </div>
            </div>
            <Modal
                title="Add Wallet"
                isModalOpen={isModalOpen}
                fullscreen={false}
                maxWidth='550px'
                closeOnOverlay={false}
                onClose={() => setIsModalOpen(false)}
            >
                <WalletForm />
            </Modal>
        </>
    );
};
const WalletCard = ({ name, balance, isAddCard, onClick }) => {
    if (isAddCard) {
        return (
            <div
                onClick={onClick}
                className="w-full max-w-[360px] min-w-[288px] h-[150px] shrink-0 rounded-2xl border-2 border-dashed border-[var(--color-theme-important)]/30 bg-[var(--color-theme-important)]/5 flex flex-col items-center justify-center gap-3 hover:bg-[var(--color-theme-important)]/10 hover:border-[var(--color-theme-important)]/50 transition-all cursor-pointer group snap-center"
            >
                <div className="w-14 h-14 rounded-full bg-[var(--color-theme-important)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="LuPlus" size={28} className="text-[var(--color-theme-important)]" strokeWidth={2.5} />
                </div>
                <span className="text-base font-semibold text-[var(--color-theme-important)]">Add Wallet</span>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="w-full max-w-[360px] min-w-[288px] h-[150px] shrink-0 rounded-2xl bg-gradient-to-br from-[var(--color-theme-important)] to-[var(--color-theme-important-dark)] p-6 flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl relative overflow-hidden group snap-center select-none"
        >
            {/* Card Pattern Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-28 h-28 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-start justify-between">
                <Icon name="LuCreditCard" size={28} className="text-white/80" strokeWidth={2} />
                <div className="w-12 h-8 rounded bg-white/20 backdrop-blur-sm" />
            </div>

            <div className="relative z-10">
                <div className="text-white/90 text-sm font-medium mb-2 truncate">{name}</div>
                <div className="text-white text-xl font-bold">
                    ${(typeof balance === 'number' ? balance : 0).toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default Wallets;
