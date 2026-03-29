import React, { useState, useEffect, useMemo } from 'react';
import Dropdown from '../../components/Dropdown';
import '../../css/v2/main.css';
// icon import removed
import {
    NotificationIcon as FaBell,
    SettingsIcon as FaGear,
    SunIcon as FaSun,
    MoonIcon as FaMoon,
    Icons,
    Icon,
    IconCard
} from '../../assets/Icons';
import Header from './components/Header';
import WalletForm from './forms/WalletForm';
const LuPlus = Icons.LuPlus;

const main = () => {
    // const [isDarkMode, setIsDarkMode] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenAI, setIsModalOpenAI] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateData, setUpdateData] = useState([]);
    const [modalFormType, setModalFormType] = useState('expensesTracker');
    const [paramMonth, setParamMonth] = useState(new Date().toISOString().slice(0, 7));




    // const paramMonth = new Date().toISOString().slice(0, 7); // Default to current YYYY-MM
    // const paramMonth = '2025-11';
    // console.log(paramMonth);

    return (
        <>
            {/* <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} /> */}
            <Header />
            <WalletForm />
        </>
    );
};

export default main;

