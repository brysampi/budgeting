import { getUser } from '../firebase/model';
import Cookies from 'js-cookie';
import { successMsg, errorMsg, getUserID } from '../firebase/utils';
import { addData, getData } from '../firebase/model';


export async function login(user, password) {
    return await getUser(user, password).then((response) => {
        // console.log(response)
        // console.log(!response ? 'No Response' : response)
        Object.entries(response).forEach(([key, value]) => {
            // console.log(`${key}: ${value}`);
            Cookies.set(key, value);
        });
        Cookies.set('logged_status', true);
        if (response && response.id) {
            // console.log('Successful LogIn.');
            // console.log(response)
            // logSession(true)
            // window.location.reload();
            // refreshPage();
            return successMsg('Login successful', response);
        } else {
            // console.log('Failed to Login.');
            return errorMsg('Login failed. Please check your username and password.');
        }
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
    if (arrayData.description === '' || arrayData.expected === 0 || arrayData.amount === 0) {
        return errorMsg('Please fill up all fields.')
    }
    if (arrayData.amount <= 0) {
        return errorMsg("Amount Can't be negative.")
    }
    if (arrayData.expected <= 0) {
        return errorMsg("expected can't be negative.")
    }
    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        description: arrayData.description,
        expected: arrayData.expected,
        amount: arrayData.amount,
        date: arrayData.date,
        user: getUserID(),
    }
    return await addData('income', data)
}
export async function getIncome(setIncomeData, isFetching) {
    try {
        await getData('income', setIncomeData, isFetching);
    } catch (error) {
        console.error("Error fetching income:", error);
    }
}
// -------------------------- Bills -----------------------------------
export async function bills(arrayData) {
    console.log(getUserID())
    if (arrayData.description === '' || arrayData.dueDate === '' || arrayData.budget === 0 || arrayData.actual === 0 || arrayData.date === '') {
        return errorMsg('Please fill up all fields.')
    }
    if (arrayData.actual <= 0) {
        return errorMsg("Actual Can't be negative.")
    }
    if (arrayData.budget <= 0) {
        return errorMsg("Budget can't be negative.")
    }
    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        description: arrayData.description,
        budget: arrayData.budget,
        actual: arrayData.actual,
        date: arrayData.date,
        user: getUserID().toString(),
    }
    return await addData('bills', data)
}
export async function getBills(setBillsData, isFetching) {
    try {
        await getData('bills', setBillsData, isFetching);
    } catch (error) {
        console.error("Error fetching bills:", error);
    }
}
// -------------------------- Expenses -----------------------------------
export async function expenses(arrayData) {
    if (arrayData.description === '' || arrayData.budget === 0 || arrayData.actual === 0 || arrayData.date === '') {
        return errorMsg('Please fill up all fields.')
    }
    if (arrayData.actual <= 0) {
        return errorMsg("Actual Can't be negative.")
    }
    if (arrayData.budget <= 0) {
        return errorMsg("Budget can't be negative.")
    }
    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        category: arrayData.category,
        budget: arrayData.budget,
        actual: arrayData.actual,
        date: arrayData.date,
        user: getUserID(),
    }
    return await addData('expenses', data)
}
export async function getExpenses(setExpensesData, isFetching) {
    try {
        await getData('expenses', setExpensesData, isFetching);
    } catch (error) {
        console.error("Error fetching expenses:", error);
    }
}
// -------------------------- Expenses Tracker -----------------------------------
export async function expensesTracker(arrayData) {
    if (arrayData.description === '' || arrayData.category === 0 || arrayData.amount === 0) {
        return errorMsg('Please fill up all fields.')
    }
    if (arrayData.amount <= 0) {
        return errorMsg("Amount Can't be negative.")
    }
    if (arrayData.expected <= 0) {
        return errorMsg("expected can't be negative.")
    }
    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        category: arrayData.category,
        description: arrayData.description,
        amount: arrayData.amount,
        date: arrayData.date,
        user: getUserID(),
    }
    return await addData('expensesTracker', data)
}
export async function getExpensesTracker(setExpensesData, isFetching) {
    try {
        await getData('expensesTracker', setExpensesData, isFetching);
    } catch (error) {
        console.error("Error fetching Expenses Tracker:", error);
    }
}
// --------------------------------------------------------------------
export function logout() {
    Object.keys(Cookies.get()).forEach(cookieName => {
        Cookies.remove(cookieName);
    });
    // refreshPage();
    return successMsg('Logout successful');
}