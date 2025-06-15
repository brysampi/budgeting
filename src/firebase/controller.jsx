import { getUser } from '../firebase/model';
import Cookies from 'js-cookie';

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
export function logout() {
    Object.keys(Cookies.get()).forEach(cookieName => {
        Cookies.remove(cookieName);
    });
    // refreshPage();
    return successMsg('Logout successful');
}
export function successMsg(message, data) {
    return { status: 'success', message: message, data: data, boolean: true };
}
export function errorMsg(message) {
    return { status: 'error', message: message, boolean: false };
}
export function refreshPage() {
    window.location.reload();
}