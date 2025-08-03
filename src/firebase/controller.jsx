import { } from '../firebase/model';
import Cookies from 'js-cookie';
import { successMsg, errorMsg, getUserID, convertToTimeStamp } from '../firebase/utils';
import {
    addData, updateData, deleteData, getData, getUser, getAllData, getAllDataRealtime,
    getDataRealTime,
    //  getExpensesTrackerDataRealTime, 
    getDataCategoryRealTime,
    getExpensesDataRealTime, getExpensesDataRealTime_v2,
    getCollectedDataRealTime,
    getSavingsDataRealTime,
} from '../firebase/model';

export async function checkStaticData(inputDate) {
    const getDataCollected = await getData('collectedData', inputDate)
    console.log(getDataCollected)

}

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
export async function getCollectedDataRealTimeController(setData, isFetching) {
    await getCollectedDataRealTime('collectedData', setData, isFetching)
}
export async function collectedData(inputDate) {
    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    let totalIncomeData = 0, totalBillsData = 0, totalExpensesData = 0, totalSavingsData = 0;
    let remainingIncomeData = 0;
    const databaseTable = ['income', 'bills', 'expensesTracker', 'savingsTracker'];
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

                if (databaseItem == 'savingsTracker')
                    totalExpensesData += data.amount
            })
        }

        remainingIncomeData = totalIncomeData - (totalBillsData + totalExpensesData + totalSavingsData);

        const data = {
            remainingIncome: remainingIncomeData,
            totalIncome: totalIncomeData,
            totalSavings: totalSavingsData,
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

export async function addCollectedData(inputDate, arrayData) {
    const addReturn = await addData('collectedData', arrayData)
    await updateCollectedData(inputDate)
    return successMsg('Successfully Added.', addReturn);
}
export async function creteCollectedData(inputDate) {
    const checked = await checkCollectedData('collectedData', inputDate);
    if (!checked) {
        const collect = await collectedData(inputDate);
        if (collect) {
            const addCollect = await addCollectedData(inputDate, collect)
            // const expensesDefault = await getAllData('expensesDefault', inputDate);
            // expensesDefault.forEach(async (exDefault) => {
            //     await addData('expenses', {
            //         category: exDefault.description,
            //         budget: exDefault.budget,
            //         date: convertToTimeStamp(inputDate),
            //         defaultCreatedId: exDefault.id,
            //         user: getUserID(),
            //     })
            // })
            // Object.entries(expensesDefault).forEach(async ([key, value]) => {
            //     await addData('expenses', {
            //         category: key,
            //         budget: value,
            //         date: convertToTimeStamp(inputDate),
            //         user: getUserID(),
            //     })
            // })
            // const addReturn = await addData('expenses', data)
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
export async function updateCollectedData(inputDate) {
    const getDataCollected = await getData('collectedData', inputDate)
    if (getDataCollected.length === 0 || getDataCollected.length < 1 || !getDataCollected) {
        console.log('No Data Found.')
        return false
    }
    else {
        const collect = await collectedData(inputDate);
        if (collect) {
            const updateReturn = await updateData('collectedData', getDataCollected[0].id, collect);
            return successMsg('Successfully Updated.', updateReturn);
        } else {
            console.log('Failed to Add Data in Controller.')
            return errorMsg('check console for error.')
        }
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
    await updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
}
// -------------------------- Savings -----------------------------------

// -------------------------- Savings-----------------------------------
export async function savings(arrayData) {
    if (arrayData.category === '' || arrayData.target === 0)
        return errorMsg('Please fill up all fields.')

    if (arrayData.target <= 0)
        return errorMsg("Amount Can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        category: arrayData.category,
        description: !arrayData.description ? '' : arrayData.description,
        target: arrayData.target,
        status: !arrayData.status ? 'active' : arrayData.status,
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('savings', data)
    await updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
}
export async function getSavings(inputDate, setSavingsData, isFetching, dropdownData = false) {
    try {
        await getSavingsDataRealTime(inputDate, setSavingsData, isFetching, dropdownData);
    } catch (error) {
        console.error("Error fetching savings in Controller:", error);
    }
}
export async function savingsTracker(arrayData) {

    if (arrayData.category === '' || arrayData.description === '' || arrayData.amount === 0)
        return errorMsg('Please fill up all fields.')

    if (arrayData.amount <= 0)
        return errorMsg("Amount Can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        category: arrayData.category,
        description: arrayData.description,
        amount: arrayData.amount,
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('savingsTracker', data)
    await updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
}
export async function getSavingsTracker(inputDate, setExpensesData, isFetching) {
    try {
        const table = {
            main: 'savings',
            tracker: 'savingsTracker'
        }
        await getDataCategoryRealTime(table, inputDate, setExpensesData, isFetching);
    } catch (error) {
        console.error("Error fetching Expenses Tracker in Controller:", error);
    }
}

// -------------------------- Bills -----------------------------------
export async function addBills(arrayData) {
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
    await updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
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
        status: "active",
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('expenses', data)
    await updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
}
export async function getExpenses(inputDate, setExpensesData, isFetching, dropdownData = false) {
    try {
        await getExpensesDataRealTime_v2(inputDate,setExpensesData, isFetching, dropdownData)
        // if (dropdownData)
        //     await getExpensesDataRealTime_v2(setExpensesData, isFetching)
        // else
        //     await getExpensesDataRealTime(inputDate, setExpensesData, isFetching)
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
    await updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
}
export async function getExpensesTracker(inputDate, setExpensesData, isFetching) {
    try {
        const table = {
            main: 'expenses',
            tracker: 'expensesTracker'
        }
        await getDataCategoryRealTime(table, inputDate, setExpensesData, isFetching);
    } catch (error) {
        console.error("Error fetching Expenses Tracker in Controller:", error);
    }
}
// -------------------------- Expenses Default -----------------------------------
export async function expensesDefault(arrayData) {
    if (arrayData.description === '' || arrayData.budget === 0 || arrayData.date === '')
        return errorMsg('Please fill up all fields.')

    if (arrayData.budget <= 0)
        return errorMsg("Budget can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')

    const data = {
        description: arrayData.description,
        budget: arrayData.budget,
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('expensesDefault', data)
    // await updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
}
export async function getAllDataController(table, setExpensesDefaultData, isFetching) {
    try {
        await getAllDataRealtime(table, setExpensesDefaultData, isFetching)
    } catch (error) {
        console.error("Error fetching Expenses Default in Controller:", error);
    }
}
export async function getDataRealTimeController(table, inputDate, setData, isFetching) {
    try {
        await getDataRealTime(table, inputDate, setData, isFetching);
    } catch (error) {
        console.error(`Error fetching data from ${table} in Controller:`, error);
    }

}
// --------------------------------------------------------------------
export async function allUpdate(table, id, arrayData) {
    const { date, ...removeDate } = arrayData;
    await updateData(table, id, removeDate).then((response) => {
        if (response && response.status === 'success') {
            console.log('Data updated successfully.');
            updateCollectedData(arrayData.date)
            return successMsg('Successfully Updated.')
        }
        else {
            console.log('Failed to update data.');
            return errorMsg('Failed to update data. Check console for error.')
        }
    }).catch((error) => {
        console.error('Error updating data:', error);
        return errorMsg('Failed to update data. Check console for error.')
    });
}
export async function expensesTrackerUpdate(id, arrayData) {
    const discountPrice = !arrayData.discount || arrayData.discount === '' ? 0 : arrayData.discount;
    const data = {
        category: arrayData.category,
        description: arrayData.description,
        price: arrayData.price,
        discount: discountPrice,
        amount: arrayData.price - discountPrice,
    }
    await updateData('expensesTracker', id, data).then((response) => {
        if (response && response.status === 'success') {
            console.log('Data updated successfully.');
            updateCollectedData(arrayData.date)
            return successMsg('Successfully Updated.')
        }
        else {
            console.log('Failed to update data.');
            return errorMsg('Failed to update data. Check console for error.')
        }
    }).catch((error) => {
        console.error('Error updating data:', error);
        return errorMsg('Failed to update data. Check console for error.')
    });
}
// --------------------------------------------------------------------
export function logout() {
    Object.keys(Cookies.get()).forEach(cookieName => {
        Cookies.remove(cookieName);
    });
    return successMsg('Logout successful');
}
export async function deleteDataController(table, id) {
    // await deleteData(table, id).then((response) => {
    //     if (response && response.status === 'success')
    //         console.log('Data deleted successfully.');
    //     else
    //         console.log('Failed to delete data.');

    // }).catch((error) => {
    //     console.error('Error deleting data:', error);
    // });
    console.log('Delete is Working But Will Not Delete in Production.');
}
