import { getUser } from '../firebase/model';
import Cookies from 'js-cookie';
import { successMsg, errorMsg } from '../firebase/utils';
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
        return errorMsg("Amount can't be negative.")
    }
    const IdStored = Cookies.get('id') ? Cookies.get('id') : null;
    if (!IdStored)
        return errorMsg('No LoggedIn User Found.')
    const data = {
        description: arrayData.description,
        expected: arrayData.expected,
        amount: arrayData.amount,
        date: arrayData.date,
        user: IdStored,
    }
    return await addData('income', data)
}
export async function getIncome(setIncomeData,isFetching) {
    // console.log('Fetching income data...');
    try {
        const data = await getData('income', setIncomeData,isFetching);
        // console.log('data',data);  // Log the fetched data
        // console.log(JSON.stringify(data, null, 2));
        // data.map((doc: any) => {
        //   console.log(doc);
        // })
        // return data;
    } catch (error) {
        console.error("Error fetching income:", error);
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
// -------------------------- Utils -----------------------------------

