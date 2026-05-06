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
import Wallets from './components/Wallets';
import AddForms from './components/AddForms';
import Stats from './components/Stats';
import Category from './components/Category';
import Transactions from './components/Transactions';

import { getAllDataRealTimeController } from '../../library/firebase/controller';
import Fetching from './Fetching';
import { useSearchParams } from 'react-router-dom';
const main = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenAI, setIsModalOpenAI] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateData, setUpdateData] = useState([]);
    const [modalFormType, setModalFormType] = useState('expensesTracker');
    const [paramMonth, setParamMonth] = useState(new Date().toISOString().slice(0, 7));
    const [isFetching, setIsFetching] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    // console.log('param month ', searchParams.get('yearMonth'));
    const changeMonth = (newMonth) => {
        setSearchParams({ yearMonth: newMonth });
    };
    // const paramMonth = new Date().toISOString().slice(0, 7); // Default to current YYYY-MM
    // const paramMonth = '2025-11';
    // console.log(paramMonth);

    return (
        <>
            <AddForms />
            <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <Fetching setIsFetching={setIsFetching} />
            <Wallets />
            <Stats setParamMonth={setParamMonth} />
            <Category paramMonth={paramMonth} />
            <Transactions />
            {/* <button onClick={() => changeMonth('2025-11')}>Change Month</button> */}
        </>
    );
};

export default main;

