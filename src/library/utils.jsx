import Cookies from 'js-cookie';
import { Timestamp } from 'firebase/firestore';
import Big from "big.js";

export function successMsg(message, data) {
    return { status: 'success', message: message, data: data, boolean: true };
}
export function errorMsg(message) {
    return { status: 'error', message: message, boolean: false };
}
export function refreshPage() {
    window.location.reload();
}
export function getUserID() {
    return Cookies.get('id') ? Cookies.get('id') : null;
}
export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}
// Convert the date for timestamp date
// ex. 2026-04 year-month format
export function convertToTimeStamp(date) {
    const dateObject = new Date(date); // JS Date object
    const timestamp = Timestamp.fromDate(dateObject); // Firestore Timestamp
    return timestamp;
}
// to convert TimeStamp the date to YYYY-MM-DD format
export function convertToDate(date) {
    if (!date) return ""; // Handle null/undefined

    // If it's a Firestore Timestamp object
    if (typeof date.toDate === "function") {
        // console.log('function sya')
        return date.toDate().toISOString().split("T")[0];
    }

    // If it's already a JS Date object
    if (date instanceof Date) {
        // console.log('date object sya')
        return date.toISOString().split("T")[0];
    }

    // If it's a string in ISO format or YYYY-MM-DD, just return as is or parse
    if (typeof date === "string") {
        // console.log('string sya')
        // Optional: you can parse and re-format here if needed
        return date.split("T")[0];
    }

    // Fallback: try to convert to Date anyway
    try {
        return new Date(date).toISOString().split("T")[0];
    } catch {
        return "";
    }
}
// to convert TimeStamp the date to YYYY-MM format
export function formatToYearMonth(date) {
    const formattedDate = convertToDate(date);
    if (!formattedDate) return "";
    return formattedDate.slice(0, 7); // Returns YYYY-MM
}
// to get the range of the month in YYYY-MM-DD format
export function getMonthRangeFromInput(inputDateString) {
    // If no input provided, default to today
    const inputDate = inputDateString ? new Date(inputDateString) : new Date();

    // Check if the date is actually valid
    if (isNaN(inputDate.getTime())) {
        console.warn(`Invalid date input: ${inputDateString}. Defaulting to current month.`);
        return getMonthRangeFromInput(new Date());
    }

    const year = inputDate.getFullYear();
    const month = inputDate.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    return { startOfMonth, endOfMonth };
}
// TimeStamp Date (Date by Firebase)
export function getMonthNames(inputDate) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[inputDate.toDate().getMonth()];
}
// ParaMonth Date (Ex. 2025-08)
// to get the month name from the ParaMonth Date (Ex. 2025-08) or from (YYYY-MM)
export function getMonthNamesSingleDigit(paramMonth) {
    const monthNo = paramMonth.split("-")[1] - 1
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNo];
}
// Helper to format "2026-05" to "May 2026"
export const getMonthNamesWithYear = (dateStr) => {
    const [year, month] = dateStr.split('-');
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    // console.log(parseInt(month) - 1)
    return `${monthNames[parseInt(month) - 1]} ${year}`;
};
// to get the last day of the month (Ex. 2025-08) 
export function getLastDayOfTheMonth(paramMonth) {
    // Set the last day of the month based on paramMonth for the default due date
    const [yearStr, monthStr] = paramMonth.split("-");
    // Ensure year and month are parsed as integers and add "10" to month for zero-padding [ex. 8 will be 08]
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    // Calculate the last day of the month [the 0th day will give the last day of the month]
    // Note: month is 1-indexed in the input, so we use it directly 
    const lastDayDate = new Date(year, month, 1).toISOString().split('T')[0];
    return lastDayDate;
}

export function componentIcons(type, customIcon = null, customColor = null) {
    const colors = {
        income: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500',
        savings: 'bg-pink-50 dark:bg-pink-500/10 text-pink-500',
        savingsTracker: 'bg-pink-50 dark:bg-pink-500/10 text-pink-500',
        bills: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500',
        billsExtension: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500',
        expenses: 'bg-red-50 dark:bg-red-500/10 text-red-500',
        expensesTracker: 'bg-red-50 dark:bg-red-500/10 text-red-500',
        wallet: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500',
    };

    const icons = {
        income: 'LuHandCoins',
        savings: 'FaPiggyBank',
        savingsTracker: 'FaPiggyBank',
        bills: 'FaBolt',
        billsExtension: 'FaBolt',
        expenses: 'FaArrowTrendDown',
        expensesTracker: 'LuCoins',
        wallet: 'FaWallet',
    };

    return {
        icon: customIcon || icons[type] || 'FaWallet',
        iconBackground: customColor || colors[type] || 'bg-gray-100 dark:bg-white/10 text-gray-500'
    };
}

export function generateUniqueID() {
    // 13 digits for timestamp + 2 digits for random = 15 digits
    return `${Date.now()}${Math.floor(Math.random() * 90 + 10)}`;
}

export function accurateDecimal(amount) {
    if (!amount) return new Big(0);
    return new Big(amount);
}