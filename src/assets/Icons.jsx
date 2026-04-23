import React from 'react';
import {
    // Original
    FaMugHot, FaBolt, FaBagShopping, FaPlane,
    FaWallet, FaPiggyBank, FaArrowTrendUp, FaArrowTrendDown,
    FaBell, FaGear, FaSun, FaMoon, FaHouse, FaGamepad,
    // Transport
    FaCar, FaBus, FaTrain, FaMotorcycle, FaBicycle, FaTruck, FaRocket,
    // Food & Drink
    FaUtensils, FaPizzaSlice, FaBurger, FaIceCream,
    FaWineGlass, FaAppleWhole, FaCheese, FaEgg, FaCookie, FaCarrot, FaBreadSlice,
    // Health & Medical
    FaHeartPulse, FaPills, FaHospital, FaStethoscope, FaSyringe, FaWeightScale,
    // Shopping & Lifestyle
    FaShirt, FaGlasses, FaScissors, FaCartShopping, FaStore,
    // Education
    FaBook, FaGraduationCap, FaSchool, FaMicroscope,
    // Fitness & Sports
    FaDumbbell, FaPersonRunning, FaFootball, FaBasketball, FaMountain,
    // Entertainment & Media
    FaFilm, FaMusic, FaTv, FaHeadphones, FaGuitar, FaTicket, FaCamera, FaMicrophone,
    // Home & Family
    FaChild, FaBaby, FaKey, FaTree, FaLeaf, FaSeedling,
    // Nature & Pets
    FaPaw, FaDog, FaCat,
    // Travel
    FaSuitcase, FaGlobe, FaMap, FaCompass, FaPassport,
    // Tech & Work
    FaLaptop, FaWifi, FaBriefcase, FaChartLine, FaChartBar, FaChartPie,
    FaCode, FaDatabase, FaServer,
    // Finance
    FaMoneyBill, FaReceipt,
    // Utilities
    FaFire, FaDroplet, FaPlug, FaHammer, FaWrench, FaBroom, FaSnowflake,
    // Communication
    FaEnvelope, FaPhone, FaHeart, FaHandshake,
    // Misc
    FaStar, FaFlag, FaClock, FaDice, FaGift, FaTrophy, FaMedal, FaCrown, FaPaintbrush,
} from 'react-icons/fa6';

import {
    // Original
    LuIndentDecrease, LuIndentIncrease, LuCalendarDays, LuCalendar, LuCoins,
    LuHandCoins, LuClipboardList, LuNewspaper, LuShoppingBag,
    LuSettings, LuLogOut, LuCircleUserRound, LuWallet,
    LuPlus, LuMinus, LuArrowBigUpDash, LuArrowBigDownDash, LuTrash2,
    LuSquarePen, LuArrowLeft, LuX, LuLoader, LuChevronLeft, LuChevronRight, LuCreditCard,
    LuUser, LuCircleHelp, LuLock, LuScan, LuSparkles, LuCamera, LuUpload, LuBadgePercent,
    // Transport
    LuCar, LuBus, LuTruck, LuBike, LuTramFront, LuPlane,
    // Food & Drink
    LuUtensils, LuCoffee,
    // Health
    LuHeart, LuHeartPulse, LuActivity,
    // Shopping
    LuShirt, LuShoppingCart, LuStore, LuGift, LuPackage,
    // Education
    LuBook, LuGraduationCap, LuPenLine, LuFlaskConical,
    // Fitness
    LuDumbbell, LuMountain,
    // Entertainment
    LuFilm, LuMusic, LuTv, LuHeadphones, LuMic, LuGamepad2,
    // Home & Family
    LuBaby, LuHouse, LuSofa, LuKey, LuLamp,
    // Nature & Weather
    LuTreeDeciduous, LuTreePine, LuTrees, LuLeaf, LuSun, LuMoon,
    LuSnowflake, LuCloud, LuDroplet, LuDog, LuCat, LuBird,
    // Travel
    LuGlobe, LuMap, LuCompass, LuLuggage,
    // Tech & Work
    LuLaptop, LuSmartphone, LuTablet, LuWifi, LuBluetooth,
    LuBriefcase, LuChartLine, LuChartBar, LuChartPie, LuCode, LuDatabase,
    LuMonitor, LuPrinter, LuServer, LuHardDrive,
    // Finance
    LuDollarSign, LuReceipt, LuFileText, LuBanknote,
    // Utilities
    LuZap, LuFlame, LuPlug, LuHammer, LuWrench, LuPaintbrush,
    // Communication
    LuMail, LuPhone, LuVideo, LuMessageCircle,
    // Misc
    LuStar, LuFlag, LuClock, LuBell,
    LuTrophy, LuMedal, LuCrown, LuPalette, LuWandSparkles, LuCalculator,
} from "react-icons/lu";

import { LiaCalendar, LiaCoinsSolid, LiaUserCogSolid } from "react-icons/lia";

// Named exports for specific common icons
export const NotificationIcon = FaBell;
export const SettingsIcon = FaGear;
export const SunIcon = FaSun;
export const MoonIcon = FaMoon;

// All icons mapped by their original names so you can call them by string
export const Icons = {
    // ── Fa6: Original ──
    FaMugHot, FaBolt, FaBagShopping, FaPlane,
    FaWallet, FaPiggyBank, FaArrowTrendUp, FaArrowTrendDown,
    FaBell, FaGear, FaSun, FaMoon, FaHouse, FaGamepad,

    // ── Fa6: Transport ──
    FaCar, FaBus, FaTrain, FaMotorcycle, FaBicycle, FaTruck, FaRocket,

    // ── Fa6: Food & Drink ──
    FaUtensils, FaPizzaSlice, FaBurger, FaIceCream,
    FaWineGlass, FaAppleWhole, FaCheese, FaEgg, FaCookie, FaCarrot, FaBreadSlice,

    // ── Fa6: Health & Medical ──
    FaHeartPulse, FaPills, FaHospital, FaStethoscope, FaSyringe, FaWeightScale,

    // ── Fa6: Shopping & Lifestyle ──
    FaShirt, FaGlasses, FaScissors, FaCartShopping, FaStore,

    // ── Fa6: Education ──
    FaBook, FaGraduationCap, FaSchool, FaMicroscope,

    // ── Fa6: Fitness & Sports ──
    FaDumbbell, FaPersonRunning, FaFootball, FaBasketball, FaMountain,

    // ── Fa6: Entertainment ──
    FaFilm, FaMusic, FaTv, FaHeadphones, FaGuitar, FaTicket, FaCamera, FaMicrophone,

    // ── Fa6: Home & Family ──
    FaChild, FaBaby, FaKey, FaTree, FaLeaf, FaSeedling,

    // ── Fa6: Nature & Pets ──
    FaPaw, FaDog, FaCat,

    // ── Fa6: Travel ──
    FaSuitcase, FaGlobe, FaMap, FaCompass, FaPassport,

    // ── Fa6: Tech & Work ──
    FaLaptop, FaWifi, FaBriefcase, FaChartLine, FaChartBar, FaChartPie,
    FaCode, FaDatabase, FaServer,

    // ── Fa6: Finance ──
    FaMoneyBill, FaReceipt,

    // ── Fa6: Utilities ──
    FaFire, FaDroplet, FaPlug, FaHammer, FaWrench, FaBroom, FaSnowflake,

    // ── Fa6: Communication ──
    FaEnvelope, FaPhone, FaHeart, FaHandshake,

    // ── Fa6: Misc ──
    FaStar, FaFlag, FaClock, FaDice, FaGift, FaTrophy, FaMedal, FaCrown, FaPaintbrush,

    // ── Lu: Original ──
    LuIndentDecrease, LuIndentIncrease, LuCalendarDays, LuCalendar, LuCoins,
    LuHandCoins, LuClipboardList, LuNewspaper, LuShoppingBag,
    LuSettings, LuLogOut, LuCircleUserRound, LuWallet,
    LuPlus, LuMinus, LuArrowBigUpDash, LuArrowBigDownDash, LuTrash2,
    LuSquarePen, LuArrowLeft, LuX, LuLoader, LuChevronLeft, LuChevronRight, LuCreditCard,
    LuUser, LuCircleHelp, LuLock, LuScan, LuSparkles, LuCamera, LuUpload, LuBadgePercent,

    // ── Lu: Transport ──
    LuCar, LuBus, LuTruck, LuBike, LuTramFront, LuPlane,

    // ── Lu: Food & Drink ──
    LuUtensils, LuCoffee,

    // ── Lu: Health ──
    LuHeart, LuHeartPulse, LuActivity,

    // ── Lu: Shopping ──
    LuShirt, LuShoppingCart, LuStore, LuGift, LuPackage,

    // ── Lu: Education ──
    LuBook, LuGraduationCap, LuPenLine, LuFlaskConical,

    // ── Lu: Fitness ──
    LuDumbbell, LuMountain,

    // ── Lu: Entertainment ──
    LuFilm, LuMusic, LuTv, LuHeadphones, LuMic, LuGamepad2,

    // ── Lu: Home & Family ──
    LuBaby, LuHouse, LuSofa, LuKey, LuLamp,

    // ── Lu: Nature & Weather ──
    LuTreeDeciduous, LuTreePine, LuTrees, LuLeaf, LuSun, LuMoon,
    LuSnowflake, LuCloud, LuDroplet, LuDog, LuCat, LuBird,

    // ── Lu: Travel ──
    LuGlobe, LuMap, LuCompass, LuLuggage,

    // ── Lu: Tech & Work ──
    LuLaptop, LuSmartphone, LuTablet, LuWifi, LuBluetooth,
    LuBriefcase, LuChartLine, LuChartBar, LuChartPie, LuCode, LuDatabase,
    LuMonitor, LuPrinter, LuServer, LuHardDrive,

    // ── Lu: Finance ──
    LuDollarSign, LuReceipt, LuFileText, LuBanknote,

    // ── Lu: Utilities ──
    LuZap, LuFlame, LuPlug, LuHammer, LuWrench, LuPaintbrush,

    // ── Lu: Communication ──
    LuMail, LuPhone, LuVideo, LuMessageCircle,

    // ── Lu: Misc ──
    LuStar, LuFlag, LuClock, LuBell,
    LuTrophy, LuMedal, LuCrown, LuPalette, LuWandSparkles, LuCalculator,

    // ── Lia ──
    LiaCalendar, LiaCoinsSolid, LiaUserCogSolid,
};

/**
 * Universal Icon Component
 * Usage: <Icon name="FaMugHot" size={16} />
 */
export const Icon = ({ name, size = 16, className = "", strokeWidth = null }) => {
    const IconComponent = Icons[name];
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} strokeWidth={strokeWidth} />;
};

/**
 * Premium Icon Card (The circle icon container used in Categories/Transactions)
 * Usage: <IconCard name="FaMugHot" iconColor="bg-orange-500/10 text-orange-500" />
 */
export const IconCard = ({ name, size = 18, textColor = '', bgColor = '', className = '' }) => {
    return (
        <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-transform ${className}`}
            style={{ color: textColor, backgroundColor: bgColor }}
        >
            <Icon name={name} size={size} />
        </div>
    );
};

export default Icons;
