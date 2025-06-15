import React, { useState } from 'react';
import { login,refreshPage } from "../firebase/controller";

export default function LoginPage({onLogin}) {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false)
    const loginAccount = async (event) => {
        event.preventDefault();
        setLoading(true)
        if (!user) {
            clearForm()
            console.log('Input Username.')
            return false
        }
        if (!pass) {
            clearForm()
            console.log('Input Password.')
            return false
        }
        try {
            const test = await login(user, pass)
            console.log(test.status)
            if (test.status === 'success' && test.boolean && test.data) {
                // console.log('Login successful:', test.data);
                // test.data && Object.entries(test.data).forEach(([key, value]) => {
                //     console.log(`${key}: ${value}`);
                //     // localStorage.setItem(key, value);
                // })
                onLogin();
            } else {
                console.log('Login failed:', test.message);
            }
            clearForm()
        } catch (error) {
            clearForm()
            console.error('Error during login:', error);
        }
    }
    return (
        <>
            <div>
                <form onSubmit={loginAccount}>
                    Username
                    <input type="text" onChange={(e) => { setUser(e.target.value) }} value={user} name="" id="user" />
                    Password
                    <input type="password" onChange={(e) => { setPass(e.target.value) }} value={pass} name="" id="pass" />
                    <button disabled={loading}>{loading ? 'Loading' : 'Submit'} </button>
                </form>
                {/* <button onClick={setCookie}>Set Cookie</button>
                <button onClick={updateCookie}>update Cookie</button>
                <button onClick={destroyToken}>delete Cookie</button> */}
            </div>
        </>
    )

    function clearForm() {
        setUser('')
        setPass('')
        setLoading(false)
    }
}   