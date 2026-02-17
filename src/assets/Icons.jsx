import React from 'react';
import {
    FaMugHot, FaBolt, FaBagShopping, FaPlane,
    FaWallet, FaPiggyBank, FaArrowTrendUp, FaArrowTrendDown,
    FaBell, FaGear, FaSun, FaMoon, FaHouse, FaGamepad
} from 'react-icons/fa6';
import {
    LuIndentDecrease, LuIndentIncrease, LuCalendarDays, LuCoins,
    LuHandCoins, LuClipboardList, LuNewspaper, LuShoppingBag,
    LuSettings, LuLogOut, LuCircleUserRound, LuWallet,
    LuPlus, LuArrowBigUpDash, LuArrowBigDownDash, LuTrash2,
    LuSquarePen, LuArrowLeft, LuX, LuLoader, LuChevronLeft, LuChevronRight, LuCreditCard,
    LuUser, LuCircleHelp, LuLock
} from "react-icons/lu";
import { LiaCalendar, LiaCoinsSolid, LiaUserCogSolid } from "react-icons/lia";

// Named exports for specific common icons
export const NotificationIcon = FaBell;
export const SettingsIcon = FaGear;
export const SunIcon = FaSun;
export const MoonIcon = FaMoon;

// All icons mapped by their original names so you can call them by string
export const Icons = {
    // Category Icons (Fa6)
    FaMugHot, FaBolt, FaBagShopping, FaPlane,
    FaWallet, FaPiggyBank, FaArrowTrendUp, FaArrowTrendDown,
    FaBell, FaGear, FaSun, FaMoon, FaHouse, FaGamepad,

    // UI and Navigation Icons (Lu)
    LuIndentDecrease, LuIndentIncrease, LuCalendarDays, LuCoins,
    LuHandCoins, LuClipboardList, LuNewspaper, LuShoppingBag,
    LuSettings, LuLogOut, LuCircleUserRound, LuWallet,
    LuPlus, LuArrowBigUpDash, LuArrowBigDownDash, LuTrash2,
    LuSquarePen, LuArrowLeft, LuX, LuLoader, LuChevronLeft, LuChevronRight, LuCreditCard,
    LuUser, LuCircleHelp, LuLock,

    // Additional Icons (Lia)
    LiaCalendar, LiaCoinsSolid, LiaUserCogSolid
};

/**
 * Universal Icon Component
 * Usage: <Icon name="FaMugHot" size={16} />
 */
export const Icon = ({ name, size = 16, className = "" }) => {
    const IconComponent = Icons[name];
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} />;
};

/**
 * Premium Icon Card (The circle icon container used in Categories/Transactions)
 * Usage: <IconCard name="FaMugHot" iconColor="bg-orange-500/10 text-orange-500" />
 */
export const IconCard = ({ name, iconColor, size = 18, className = "" }) => {
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor} shadow-sm transition-transform ${className}`}>
            <Icon name={name} size={size} />
        </div>
    );
};

export default Icons;
