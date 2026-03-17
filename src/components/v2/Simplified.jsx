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
import { getAllDataRealTimeController, logout, collectedData_v2 } from '../../library/firebase/controller';
import Dropdown from '../../layouts/v2/Dropdown';
import '../../css/v2/main.css';
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
import UploadImage from '../../library/gemini/RecieptScanner';
import ExpensesForm from './forms/ExpensesForm';
import IncomeForm from './forms/IncomeForm';
import BillsForm from './forms/BillsForm';
import SavingsForm from './forms/SavingsForm';
const LuPlus = Icons.LuPlus;

const Simplified = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenAI, setIsModalOpenAI] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateData, setUpdateData] = useState([]);
    const [modalFormType, setModalFormType] = useState('expensesTracker');
    const [paramMonth, setParamMonth] = useState(new Date().toISOString().slice(0, 7));

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

    // const paramMonth = new Date().toISOString().slice(0, 7); // Default to current YYYY-MM
    // const paramMonth = '2025-11';
    // console.log(paramMonth);
    useEffect(() => {
        if (!isDarkMode) {
            document.documentElement.classList.add('light-mode');
            document.documentElement.style.colorScheme = 'light';
        } else {
            document.documentElement.classList.remove('light-mode');
            document.documentElement.style.colorScheme = 'dark';
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
    const [formData11, setFormData11] = useState({ vendor: '', total: 0, items: [] });

    const handleAiData = (data) => {
        setFormData11(data); // This fills your form automatically!
    };
    return (
        <div className="w-full max-w-[768px] mx-auto p-4 md:p-8 flex flex-col gap-8 min-h-screen relative font-sans pb-32">
            {/* <button onClick={addData}>Add Data</button> */}
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
            {/* <Stats setParamMonth={setParamMonth} /> */}

            {/* Budget Categories */}
            <ExpensesCategory
                paramMonth={paramMonth}
                onClick={() => {
                    setModalFormType('expenses');
                    setIsModalOpen(true);
                }}
            />

            {/* Recent Transactions */}
            {/* <Transaction
                paramMonth={paramMonth}
                onClick={() => {
                    setModalFormType('expensesTracker');
                    setIsModalOpen(true);
                }}
            /> */}

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
            {/* <UploadImage onDataExtracted={handleAiData} /> */}
            {/* Full Screen Modal */}

            <Modal
                title={modalFormType === 'expenses' ? 'Add New Expenses Category' : 'Add New Entry'}
                isModalOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fullscreen={false}
                maxWidth='550px'
                closeOnOverlay={false}
            >
                {/* <button
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
                </button> */}
                {/* {modalFormType === 'expensesTracker' && (
                    <>
                        <button
                            // onClick={() => setIsSettingsOpen(true)}
                            onClick={() => setIsModalOpenAI(true)}
                            className="w-full p-4 rounded-2xl bg-[var(--color-theme-secondary)] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                    <Icons.LuSparkles size={20} />
                                </div>
                                <div>
                                    <div className="text-[var(--color-light)] font-bold">AI Receipt Scanner</div>
                                    <div className="text-[var(--color-theme-secondary-text)] text-xs">Auto-extract details from photos</div>
                                </div>
                            </div>
                            <Icons.LuArrowLeft className="rotate-180 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                        <div className="h-[1px] bg-white/5 w-full my-2" />
                    </>
                )} */}

                {/* Modern Segmented Tab Bar for Transactions */}
                {!isUpdate && ['expensesTracker', 'income', 'bills', 'savingsTracker'].includes(modalFormType) && (
                    <div className="flex p-1 bg-black/20 dark:bg-white/[0.03] rounded-2xl border border-white/5 mb-6 gap-1 w-full">
                        {[
                            { label: 'Expenses', type: 'expensesTracker', icon: 'LuShoppingBag' },
                            { label: 'Income', type: 'income', icon: 'LuHandCoins' },
                            { label: 'Bills', type: 'bills', icon: 'FaBolt' },
                            { label: 'Savings', type: 'savingsTracker', icon: 'FaPiggyBank' }
                        ].map(tab => (
                            <button
                                key={tab.type}
                                onClick={() => setModalFormType(tab.type)}
                                className={`flex-1 py-2.5 px-1 rounded-xl text-[9px] xs:text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${modalFormType === tab.type
                                    ? 'bg-[var(--color-theme-important)] text-white shadow-lg'
                                    : 'text-[var(--color-theme-secondary-text)] hover:text-[var(--color-light)] hover:bg-white/5'
                                    }`}
                            >
                                <Icon name={tab.icon} size={14} />
                                <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* {modalFormType === 'expensesTracker' && !isUpdate && ( */}
                <div className="flex flex-col gap-6">

                    {modalFormType === 'expensesTracker' && (
                        <ExpensesForm onFinish={() => setIsModalOpen(false)} />
                    )}

                    {modalFormType === 'income' && (
                        <IncomeForm onFinish={() => setIsModalOpen(false)} />
                    )}

                    {modalFormType === 'bills' && (
                        <BillsForm onFinish={() => setIsModalOpen(false)} />
                    )}

                    {modalFormType === 'savingsTracker' && (
                        <SavingsForm onFinish={() => setIsModalOpen(false)} />
                    )}
                    {/* <div className="flex flex-col"> */}
                    <button
                        className="btn-cancel"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                    {/* </div> */}
                    {/* {isUpdate && (
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
                    )} */}
                </div>
                {/* )} */}
            </Modal>

            {/* <Modal
                title={'AI Receipt Scanner'}
                isModalOpen={isModalOpenAI}
                onClose={() => setIsModalOpenAI(false)}
                fullscreen={false}
                maxWidth='550px'
                closeOnOverlay={!isBottomSheetOpen}
                zIndex={6000}
            >
                <UploadImage onDataExtracted={handleAiData} />
            </Modal> */}

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

