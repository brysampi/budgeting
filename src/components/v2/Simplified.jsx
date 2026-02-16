import React, { useState, useEffect, useMemo } from 'react';
import Transaction from './Transaction';
import Stats from './Stats';
import ExpensesCategory from './ExpensesCategory';
import Card from '../cards/Card';
import WalletCardsSection from './WalletCardsSection';
import DateSelector from './DateSelector';
import Modal from '../../layouts/modal/Modal';
import BottomSheet from '../../layouts/modal/BottomSheetModal';
import ModalForms from '../ModalForms';
import { getAllDataRealTimeController, logout, collectedData_v2 } from '../../firebase/controller';
import Dropdown from '../../layouts/v2/Dropdown';
// icon import removed
import {
    NotificationIcon as FaBell,
    SettingsIcon as FaGear,
    SunIcon as FaSun,
    MoonIcon as FaMoon,
    Icons,
    Icon
} from '../../assets/Icons';
import Cookies from 'js-cookie';
const LuPlus = Icons.LuPlus;





const transactionsData = [
    { id: 1, title: 'Starbucks', category: 'Food & Dining', amount: -5.75, date: 'Today', iconName: 'FaMugHot', colorClass: 'bg-orange-50 dark:bg-orange-500/10', iconColorClass: 'text-orange-500' },
    { id: 2, title: 'Electric Bill', category: 'Utilities', amount: -124.50, date: 'Yesterday', iconName: 'FaBolt', colorClass: 'bg-yellow-50 dark:bg-yellow-500/10', iconColorClass: 'text-yellow-500' },
    { id: 3, title: 'Salary Deposit', category: 'Income', amount: 3250.00, date: 'Jan 15', iconName: 'FaArrowTrendUp', colorClass: 'bg-green-50 dark:bg-green-500/10', iconColorClass: 'text-green-500' },
    { id: 4, title: 'Amazon', category: 'Shopping', amount: -89.99, date: 'Jan 14', iconName: 'FaBagShopping', colorClass: 'bg-pink-50 dark:bg-pink-500/10', iconColorClass: 'text-pink-500' },
    { id: 5, title: 'Flight Tickets', category: 'Travel', amount: -450.00, date: 'Jan 12', iconName: 'FaPlane', colorClass: 'bg-blue-50 dark:bg-blue-500/10', iconColorClass: 'text-blue-500' }
];

const Simplified = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateData, setUpdateData] = useState([]);
    const [modalFormType, setModalFormType] = useState('expensesTracker');




    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const handleLogout = async () => {
        const response = await logout();
        if (response.status === 'success') {
            window.location.href = '/login';
        }
    };

    const settingItems = [
        { label: 'General Settings', icon: <Icons.LuSettings size={18} />, onClick: () => console.log('Settings clicked') },
        { label: 'Security', icon: <Icons.LuLock size={18} />, onClick: () => console.log('Security clicked') },
        { label: 'Help & Support', icon: <Icons.LuCircleHelp size={18} />, onClick: () => console.log('Help clicked') },
    ];

    const profileItems = [
        { label: 'View Profile', icon: <Icons.LuUser size={18} />, onClick: () => console.log('Profile clicked') },
        { label: 'Settings', icon: <Icons.LuSettings size={18} />, onClick: () => console.log('Settings clicked') },
        { label: 'Logout', icon: <Icons.LuLogOut size={18} />, onClick: handleLogout, type: 'danger' },
    ];

    const paramMonth = new Date().toISOString().slice(0, 7); // Default to current YYYY-MM
    // const paramMonth = '2025-11';
    console.log(paramMonth);
    useEffect(() => {
        if (!isDarkMode) {
            document.documentElement.classList.add('light-mode');
        } else {
            document.documentElement.classList.remove('light-mode');
        }
    }, [isDarkMode]);
    useEffect(() => {
        // async function fetchData() {
        //     await collectedData_v2(paramMonth);
        // }
        // fetchData();
    }, []);
    const addData = async () => {
        await collectedData_v2(paramMonth);
    }
    return (
        <div className="w-full max-w-[768px] mx-auto p-4 md:p-8 flex flex-col gap-8 min-h-screen relative font-sans pb-32">
            <button onClick={addData}>Add Data</button>
            {/* Header */}
            <header className="flex justify-between items-center px-1">
                <div>
                    <h2 className="text-[var(--color-theme-secondary-text)] text-xs md:text-sm font-medium">Welcome back,</h2>
                    <h1 className="text-xl md:text-2xl font-extrabold text-[var(--color-light)] mt-1">{Cookies.get('name')}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white dark:bg-[var(--color-theme-secondary)] flex items-center justify-center text-[var(--color-theme-secondary-text)] hover:text-[var(--color-theme-important)] transition-all shadow-sm border border-black/5">
                        {isDarkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white dark:bg-[var(--color-theme-secondary)] flex items-center justify-center text-[var(--color-theme-secondary-text)] hover:shadow-md transition-all border border-black/5">
                        <FaBell size={16} />
                    </button>

                    <Dropdown
                        items={settingItems}
                        trigger={
                            <button className="w-10 h-10 rounded-full bg-white dark:bg-[var(--color-theme-secondary)] flex items-center justify-center text-[var(--color-theme-secondary-text)] hover:shadow-md transition-all border border-black/5">
                                <FaGear size={16} />
                            </button>
                        }
                    />

                    <Dropdown
                        items={profileItems}
                        trigger={
                            <div className="w-10 h-10 rounded-full bg-[#34A853] text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white/20 hover:scale-105 transition-transform">
                                {Cookies.get('name')?.slice(0, 2).toUpperCase() || 'AJ'}
                            </div>
                        }
                    />
                </div>
            </header>

            {/* Wallet Cards Section */}
            <WalletCardsSection />

            {/* Date Selector */}
            {/* <DateSelector onChange={(val) => console.log('Date changed to:', val)} /> */}

            {/* Stats Grid */}
            <Stats />

            {/* Budget Categories */}
            <ExpensesCategory
                paramMonth={paramMonth}
                onClick={() => {
                    setModalFormType('expenses');
                    setIsModalOpen(true);
                }}
            />

            {/* Recent Transactions */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-xl font-bold text-[var(--color-light)] tracking-tight">Recent Transactions</h2>
                    {/* <button className="text-[#34A853] hover:underline text-xs md:text-sm font-semibold">See all</button> */}
                </div>
                <Card noHover={true} padding="p-2 md:p-4">
                    <div className="flex flex-col gap-1">
                        {transactionsData.map((t, idx) => (
                            <React.Fragment key={t.id}>
                                <Transaction {...t} />
                                {idx < transactionsData.length - 1 && (
                                    <div className="mx-4 h-[1px] bg-black/[0.03] dark:bg-white/5" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </Card>
            </div>

            {/* FAB */}
            <button
                onClick={() => {
                    setModalFormType('expensesTracker');
                    setIsModalOpen(true);
                }}
                className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-[var(--color-theme-important)] text-white flex items-center justify-center shadow-[0_12px_40px_rgba(52,168,83,0.3)] hover:scale-110 active:scale-95 transition-all z-50 group border-[6px] border-white/5 hover:border-white/20"
            >
                <Icons.LuPlus size={32} strokeWidth={3} className="transform group-hover:rotate-90 transition-transform duration-300 origin-center" />
            </button>

            {/* Full Screen Modal */}
            <Modal
                title={modalFormType === 'expenses' ? 'Add New Expenses Category' : 'Add New Transaction'}
                isModalOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fullscreen={true}
            >
                <div className="max-w-xl mx-auto w-full pt-8 flex flex-col gap-6">
                    <button
                        onClick={() => setIsBottomSheetOpen(true)}
                        className="w-full p-4 rounded-2xl bg-[var(--color-theme-secondary)] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-theme-important)]/10 flex items-center justify-center text-[var(--color-theme-important)]">
                                <Icons.LuShoppingBag size={20} />
                            </div>
                            <div className="text-left">
                                <div className="text-[var(--color-light)] font-bold">Quick Select Expenses Category</div>
                                <div className="text-[var(--color-theme-secondary-text)] text-xs">Choose from frequently used</div>
                            </div>
                        </div>
                        <Icons.LuArrowLeft className="rotate-180 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="w-full p-4 rounded-2xl bg-[var(--color-theme-secondary)] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Icons.LuSettings size={20} />
                            </div>
                            <div>
                                <div className="text-[var(--color-light)] font-bold">Advanced Settings</div>
                                <div className="text-[var(--color-theme-secondary-text)] text-xs">Fixed modal demo</div>
                            </div>
                        </div>
                        <Icons.LuArrowLeft className="rotate-180 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>

                    <div className="h-[1px] bg-white/5 w-full my-2" />

                    <ModalForms
                        paramMonth={paramMonth}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        formType={modalFormType}
                        isUpdate={isUpdate}
                        setIsUpdate={setIsUpdate}
                        updateData={updateData}
                        setUpdateData={setUpdateData}
                    />
                </div>
            </Modal>



            {/* Non-Draggable Modal */}
            <BottomSheet
                isVisible={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                title="Advanced Settings"
                isDraggable={false}
                closeOnOverlay={false}
            >
                <div className="flex flex-col gap-6 py-4">
                    <p className="text-[var(--color-theme-secondary-text)] text-sm leading-relaxed">
                        This modal is non-draggable and cannot be closed by clicking the background. You must use the "X" button to exit.
                    </p>
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-[var(--color-light)]">Lock Controls</span>
                            <div className="w-12 h-6 bg-[var(--color-theme-important)] rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="w-full py-4 rounded-xl bg-[var(--color-theme-important)] text-white font-bold shadow-lg active:scale-95 transition-all"
                    >
                        Save & Close
                    </button>
                </div>
            </BottomSheet>
        </div>
    );
};

export default Simplified;

