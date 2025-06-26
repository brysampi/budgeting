import { getUser } from '../firebase/model';
import Cookies from 'js-cookie';
import { successMsg, errorMsg, getUserID, convertToTimeStamp } from '../firebase/utils';
import {
    addData, deleteData, getData,
    getDataRealTime, getExpensesTrackerDataRealTime, getExpensesDataRealTime, getCollectedDataRealTime,
} from '../firebase/model';

export async function login(user, password) {
    return await getUser(user, password).then((response) => {
        Object.entries(response).forEach(([key, value]) => {
            Cookies.set(key, value);
        });
        Cookies.set('logged_status', true);
        if (response && response.id)
            return successMsg('Login successful', response);
        else
            return errorMsg('Login failed. Please check your username and password.');

    }).catch((error) => {
        return errorMsg('An error occurred during login');
    })
}
// -------------------------- Collected Data -----------------------------------
export async function getCollectedData(setData, isFetching) {
    await getCollectedDataRealTime('collectedData', setData, isFetching)
}
export async function collectedData(inputDate) {
    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    let totalIncomeData = 0, totalBillsData = 0, totalExpensesData = 0;
    let remainingIncomeData = 0;
    const databaseTable = ['income', 'bills', 'expensesTracker']
    try {
        for (const databaseItem of databaseTable) {
            const fetch = await getData(databaseItem, inputDate)
            fetch.forEach(data => {
                if (databaseItem == 'income')
                    totalIncomeData += data.amount

                if (databaseItem == 'bills')
                    totalBillsData += data.actual

                if (databaseItem == 'expensesTracker')
                    totalExpensesData += data.amount
            })
        }

        remainingIncomeData = totalIncomeData - totalBillsData - totalExpensesData;

        const data = {
            remainingIncome: remainingIncomeData,
            totalIncome: totalIncomeData,
            // totalSavings: totalSavingsData,
            totalBills: totalBillsData,
            totalExpenses: totalExpensesData,
            date: convertToTimeStamp(inputDate),
            user: getUserID(),
        }
        console.log(data)
        return data
    }
    catch (error) {
        console.log(error)
        return errorMsg('check console for error.')
    }
}
export async function checkCollectedData(table, inputDate) {
    const getDataCollected = await getData(table, inputDate)
    if (getDataCollected.length === 0 || getDataCollected.length < 1 || !getDataCollected)
        return false
    else
        return true
}
export async function addCollectedData(arrayData) {
    const addReturn = await addData('collectedData', arrayData)
    return successMsg('Successfully Added.', addReturn);
}
export async function getCollectedDataByMonth(inputDate) {
    const checked = await checkCollectedData('collectedData', inputDate);
    if (!checked) {
        const collect = await collectedData(inputDate);
        if (collect) {
            const addCollect = await addCollectedData(collect)
            return successMsg('Successfully Added.', addCollect);
        } else {
            console.log('Failed to Add Data in Controller.')
            return errorMsg('check console for error.')
        }
    }
    else {
        console.log('Already Have Data.')
        return errorMsg('Already Have Data.')
    }
}
// -------------------------- Income -----------------------------------
export async function income(arrayData) {
    if (arrayData.description === '' || arrayData.expected === 0 || arrayData.amount === 0)
        return errorMsg('Please fill up all fields.')

    if (arrayData.amount <= 0)
        return errorMsg("Amount Can't be negative.")

    if (arrayData.expected <= 0)
        return errorMsg("expected can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        description: arrayData.description,
        expected: arrayData.expected,
        amount: arrayData.amount,
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('income', data)
    return successMsg('Successfully Added.', addReturn)
}
export async function getIncome(setIncomeData, isFetching, inputDate) {
    try {
        await getDataRealTime('income', setIncomeData, isFetching, inputDate)
    } catch (error) {
        console.error("Error fetching income in Controller:", error);
    }
}
// -------------------------- Savings -----------------------------------
export async function savings(arrayData) {
    if (arrayData.description === '' || arrayData.amount === 0)
        return errorMsg('Please fill up all fields.')

    if (arrayData.amount <= 0)
        return errorMsg("Amount Can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        description: arrayData.description,
        amount: arrayData.amount,
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('savings', data)
    return successMsg('Successfully Added.', addReturn)
}
export async function getSavings(setSavingsData, isFetching, inputDate) {
    try {
        await getDataRealTime('savings', setSavingsData, isFetching, inputDate)
    } catch (error) {
        console.error("Error fetching savings in Controller:", error);
    }
}

// -------------------------- Bills -----------------------------------
export async function bills(arrayData) {
    if (arrayData.description === '' || arrayData.dueDate === '' || arrayData.budget === 0 || arrayData.actual === 0 || arrayData.date === '')
        return errorMsg('Please fill up all fields.')

    if (arrayData.actual <= 0)
        return errorMsg("Actual Can't be negative.")

    if (arrayData.budget <= 0)
        return errorMsg("Budget can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        description: arrayData.description,
        dueDate: convertToTimeStamp(arrayData.dueDate),
        budget: arrayData.budget,
        actual: arrayData.actual,
        date: convertToTimeStamp(arrayData.date),
        user: getUserID().toString(),
    }
    const addReturn = await addData('bills', data)
    return successMsg('Successfully Added.', addReturn)
}
export async function getBills(setBillsData, isFetching, inputDate) {
    try {
        await getDataRealTime('bills', setBillsData, isFetching, inputDate)
    } catch (error) {
        console.error("Error fetching bills in Controller:", error);
    }
}
// -------------------------- Expenses -----------------------------------
export async function expenses(arrayData) {
    if (arrayData.description === '' || arrayData.budget === 0 || arrayData.date === '')
        return errorMsg('Please fill up all fields.')

    if (arrayData.budget <= 0)
        return errorMsg("Budget can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        category: arrayData.category,
        budget: arrayData.budget,
        // actual: arrayData.actual,
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('expenses', data)
    return successMsg('Successfully Added.', addReturn)
}
export async function getExpenses(setExpensesData, isFetching, inputDate) {
    try {
        await getExpensesDataRealTime(setExpensesData, isFetching, inputDate)
    } catch (error) {
        console.error("Error fetching expenses in Controller:", error);
    }
}
// -------------------------- Expenses Tracker -----------------------------------
export async function expensesTracker(arrayData) {
    if (arrayData.description === '' || arrayData.category === '' || arrayData.amount === 0)
        return errorMsg('Please fill up all fields.')

    if (arrayData.amount <= 0)
        return errorMsg("Amount Can't be negative.")

    if (arrayData.expected <= 0)
        return errorMsg("expected can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')

    const discountPrice = !arrayData.discount || arrayData.discount === '' ? 0 : arrayData.discount;
    const data = {
        category: arrayData.category,
        description: arrayData.description,
        price: arrayData.price,
        discount: discountPrice,
        amount: arrayData.price - discountPrice,
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('expensesTracker', data)
    return successMsg('Successfully Added.', addReturn)
}
export async function getExpensesTracker(setExpensesData, isFetching, inputDate) {
    try {
        await getExpensesTrackerDataRealTime(setExpensesData, isFetching, inputDate);
    } catch (error) {
        console.error("Error fetching Expenses Tracker in Controller:", error);
    }
}

// --------------------------------------------------------------------
export function logout() {
    Object.keys(Cookies.get()).forEach(cookieName => {
        Cookies.remove(cookieName);
    });
    return successMsg('Logout successful');
}
export async function deleteDataController(table, id) {
    await deleteData(table, id).then((response) => {
        if (response && response.status === 'success')
            console.log('Data deleted successfully.');
        else
            console.log('Failed to delete data.');

    }).catch((error) => {
        console.error('Error deleting data:', error);
    });
    console.log('Delete is Working But Will Not Delete in Production.');
}
