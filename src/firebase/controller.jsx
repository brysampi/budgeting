import { getUser } from '../firebase/model';
import Cookies from 'js-cookie';
import { successMsg, errorMsg, getUserID, convertDate } from '../firebase/utils';
import { addData, getData, getExpensesTrackerData, deleteData, getExpensesData, getTotal } from '../firebase/model';


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
        date: convertDate(arrayData.date),
        user: getUserID(),
    }
    return await addData('income', data)
}
export async function getIncome(setIncomeData, isFetching) {
    try {
        await getData('income', setIncomeData, isFetching).catch(error => {
            console.error("🔥 Fetch error:", error);
        });
    } catch (error) {
        console.error("Error fetching income:", error);
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
        budget: arrayData.budget,
        actual: arrayData.actual,
        date: convertDate(arrayData.date),
        user: getUserID().toString(),
    }
    return await addData('bills', data)
}
export async function getBills(setBillsData, isFetching) {
    try {
        await getData('bills', setBillsData, isFetching).catch(error => {
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
        date: convertDate(arrayData.date),
        user: getUserID(),
    }
    // await getExpensesData('expenses', data);
    return await addData('expenses', data)
}
// export async function getExpenses(setExpensesData, isFetching) {
//     try {
//         await getData('expenses', setExpensesData, isFetching).catch(error => {
//             console.error("🔥 Fetch error:", error);
//         });
//     } catch (error) {
//         console.error("Error fetching expenses:", error);
//     }
// }
export async function getExpenses(setExpensesData, isFetching) {
    try {
        // await getData('expenses', setExpensesData, isFetching).catch(error => {
        //     console.error("🔥 Fetch error:", error);
        // });
        await getExpensesData(setExpensesData, isFetching).catch(error => {
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
        date: convertDate(arrayData.date),
        user: getUserID(),
    }
    // console.log('data: ',data)
    return await addData('expensesTracker', data)
}
export async function getExpensesTracker(setExpensesData, isFetching) {
    try {
        await getExpensesTrackerData(setExpensesData, isFetching);
    } catch (error) {
        console.error("Error fetching Expenses Tracker:", error);
    }
}
// --------------------------------------------------------------------
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
        date: convertDate(arrayData.date),
        user: getUserID(),
    }
    return await addData('savings', data)
}
export async function getSavings(setSavingsData, isFetching) {
    try {
        await getData('savings', setSavingsData, isFetching)
        // .catch(error => {
        //     console.error("🔥 Fetch error:", error);
        // });
    } catch (error) {
        console.error("Error fetching savings:", error);
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
    // await deleteData(table, id).then((response) => {
    //     if (response && response.status === 'success') {
    //         console.log('Data deleted successfully.');
    //     } else {
    //         console.log('Failed to delete data.');
    //     }
    // }).catch((error) => {
    //     console.error('Error deleting data:', error);
    // });
    console.log('Delete is Working But Will Not Delete in Production.');
}
// --------------------------------------------------------------------
export async function collectedData() {
    let totalIncome = 0, totalSavings = 0, totalBills = 0, totalExpenses = 0;
    let remainingIncome = 0;

    const database = ['income', 'savings', 'bills', 'expensesTracker']

    for (const items of database) {
        const fetch = await getTotal(items, '2025-06-01')
        fetch.forEach(data => {
            if (items == 'income')
                totalIncome += data.amount

            if (items == 'savings')
                totalSavings += data.amount

            if (items == 'bills')
                totalBills += data.actual

            if (items == 'expensesTracker')
                totalExpenses += data.amount
        })
    }

    remainingIncome = totalIncome - totalSavings - totalBills - totalExpenses;

    const dataArray = {
        remainingIncome: remainingIncome,
        totalIncome: totalIncome,
        totalSavings: totalSavings,
        totalBills: totalBills,
        totalExpenses: totalExpenses,
    }
    console.log(dataArray)
    // return await collectedDataInput(dataArray)

}
export async function collectedDataInput(arrayData) {
    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        remainingIncome: arrayData.description,
        totalExpenses: arrayData.amount,
        totalBills: arrayData.date,
        totalSavings: arrayData.date,

        date: arrayData.date,
        user: getUserID(),
    }
    return await addData('collectedData', data)
}