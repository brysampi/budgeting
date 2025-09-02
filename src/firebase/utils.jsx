import Cookies from 'js-cookie';
import { Timestamp } from 'firebase/firestore';

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
export function convertToTimeStamp(date) {
    const dateObject = new Date(date); // JS Date object
    const timestamp = Timestamp.fromDate(dateObject); // Firestore Timestamp
    return timestamp;
}
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
export function getMonthRangeFromInput(inputDateString) {
    const inputDate = new Date(inputDateString); // e.g. "2025-06-01"
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth(); // 0-based: Jan = 0, June = 5

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
export function getMonthNamesSingleDigit(paramMonth) {
    const monthNo = paramMonth.split("-")[1] - 1
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNo];
}
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