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
        // console.error('Error during login:', error);
        return errorMsg('An error occurred during login');
    }).finally(() => {
        // clearForm()
        // window.location.reload();
    })
    // return getUser(user, password)
}
// -------------------------- Collected Data -----------------------------------
export async function getCollectedData(setData, isFetching) {
    try {
        await getCollectedDataRealTime('collectedData', setData, isFetching)
    }
    catch (error) {
        console.log(error)
    }

}
export async function collectedData(inputDate) {
    let totalIncomeData = 0, totalSavingsData = 0, totalBillsData = 0, totalExpensesData = 0;
    let remainingIncomeData = 0;

    const database = ['income', 'savings', 'bills', 'expensesTracker']

    try {
        for (const items of database) {
            const fetch = await getData(items, inputDate)
            fetch.forEach(data => {
                if (items == 'income')
                    totalIncomeData += data.amount

                if (items == 'savings')
                    totalSavingsData += data.amount

                if (items == 'bills')
                    totalBillsData += data.actual

                if (items == 'expensesTracker')
                    totalExpensesData += data.amount
            })
        }

        remainingIncomeData = totalIncomeData - totalSavingsData - totalBillsData - totalExpensesData;
        if (!getUserID())
            return errorMsg('No LoggedIn User Found.')
        const data = {
            remainingIncome: remainingIncomeData,
            totalIncome: totalIncomeData,
            totalSavings: totalSavingsData,
            totalBills: totalBillsData,
            totalExpenses: totalExpensesData,
            date: convertToTimeStamp(inputDate),
            user: getUserID(),
        }

        return data
    }
    catch (error) {
        console.log(error)
    }
}

export async function addCollectedData(data) {
    try {
        const add = await addData('collectedData', data)
        return add;
    }
    catch (error) {
        console.log(error)
    }
}
export async function checkCollectedData(table, inputDate) {
    try {
        const getDataCollected = await getData(table, inputDate)
        if (getDataCollected.length === 0 || getDataCollected.length < 1 || !getDataCollected)
            return false
        else
            return true
    }
    catch (error) {
        console.log(error)
    }

}
export async function getCollectedDataByMonth(inputDate) {
    const checked = await checkCollectedData('collectedData', inputDate);
    if (!checked) {
        const collect = await collectedData(inputDate);
        if (collect) {
            const addCollect = await addCollectedData(collect)
            return addCollect;
        }
    }
    else {
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
    return await addData('income', data)
}
export async function getIncome(setIncomeData, isFetching, inputDate) {
    try {
        await getDataRealTime('income', setIncomeData, isFetching, inputDate).catch(error => {
            console.error("🔥 Fetch error:", error);
        });
    } catch (error) {
        console.error("Error fetching income:", error);
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
    return await addData('savings', data)
}
export async function getSavings(setSavingsData, isFetching, inputDate) {
    try {
        await getDataRealTime('savings', setSavingsData, isFetching, inputDate)
        // .catch(error => {
        //     console.error("🔥 Fetch error:", error);
        // });
    } catch (error) {
        console.error("Error fetching savings:", error);
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
    return await addData('bills', data)
}
export async function getBills(setBillsData, isFetching, inputDate) {
    try {
        await getDataRealTime('bills', setBillsData, isFetching, inputDate).catch(error => {
            console.error("🔥 Fetch error:", error);
        });
    } catch (error) {
        console.error("Error fetching bills:", error);
    }
}
// -------------------------- Expenses -----------------------------------
export async function expenses(arrayData) {
    if (arrayData.description === '' || arrayData.budget === 0 || arrayData.date === '')
        return errorMsg('Please fill up all fields.')

    // if (arrayData.actual <= 0)
    //     return errorMsg("Actual Can't be negative.")

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
    // await getExpensesDataRealTime('expenses', data);
    return await addData('expenses', data)
}
// export async function getExpenses(setExpensesData, isFetching) {
//     try {
//         await getDataRealTime('expenses', setExpensesData, isFetching).catch(error => {
//             console.error("🔥 Fetch error:", error);
//         });
//     } catch (error) {
//         console.error("Error fetching expenses:", error);
//     }
// }
export async function getExpenses(setExpensesData, isFetching, inputDate) {
    try {
        // await getDataRealTime('expenses', setExpensesData, isFetching).catch(error => {
        //     console.error("🔥 Fetch error:", error);
        // });
        await getExpensesDataRealTime(setExpensesData, isFetching, inputDate).catch(error => {
            console.error("🔥 Fetch error:", error);
        });
    } catch (error) {
        console.error("Error fetching expenses:", error);
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
    // console.log('data: ',data)
    return await addData('expensesTracker', data)
}
export async function getExpensesTracker(setExpensesData, isFetching, inputDate) {
    try {
        await getExpensesTrackerDataRealTime(setExpensesData, isFetching, inputDate);
    } catch (error) {
        console.error("Error fetching Expenses Tracker:", error);
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
        if (response && response.status === 'success') {
            console.log('Data deleted successfully.');
        } else {
            console.log('Failed to delete data.');
        }
    }).catch((error) => {
        console.error('Error deleting data:', error);
    });
    console.log('Delete is Working But Will Not Delete in Production.');
}
