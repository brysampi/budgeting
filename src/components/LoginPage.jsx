import React, { useState } from 'react';
import { login } from "../firebase/controller";
import '../css/login.css';
export default function LoginPage({ onLogin }) {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false)
    const [viewPassword, setViewPassword] = useState(false)
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
            if (test.status === 'success' && test.boolean && test.data)
                onLogin();
            else
                console.log('Login failed:', test.message);

            clearForm()
        } catch (error) {
            clearForm()
            console.error('Error during login:', error);
        }

    }
    const seePassword = () => {
        // document.getElementById('pass').setAttribute('type', viewPassword === false ? 'text' : 'password')
        setViewPassword(!viewPassword)
    }
    return (
        <>
            <div className='flex flex-col items-center justify-center h-screen bg-[var(--theme-one-seven)]'>
                <div className='
                flex flex-col justify-center rounded-lg
                h-full w-full sm:h-auto sm:w-auto py-[50px] px-[100px]
                bg-[var(--theme-one-five)]  shadow-[0px_0px_20px_rgba(0,0,0,0.2)]
                '>
                    <div className='text-center font-bold text-2xl p-10'>
                        My Logo Here
                    </div>
                    <form onSubmit={loginAccount}
                        className='
                        flex flex-col items-center
                        '>
                        <div className='floating-label-wrapper'>
                            <input id="user" type="text" onChange={(e) => setUser(e.target.value)} value={user} placeholder='Username' />
                            <label htmlFor="user">Username</label>
                        </div>
                        <div className='floating-label-wrapper'>
                            <input id="pass" type={viewPassword === false ? 'password' : 'text'} onChange={(e) => setPass(e.target.value)} value={pass} placeholder='Password' />
                            <label htmlFor="pass">Password</label>
                        </div>
                        <div >
                            <input type='checkbox' id='checkbox' onClick={seePassword} />
                            <label htmlFor='checkbox' className='ml-2' >Show Password</label>
                        </div>

                        <button
                            className='
                        bg-[var(--theme-one-three)] hover:bg-[var(--theme-one-four)]
                        py-2 px-6 rounded-lg shadow-[0px_0px_5px_rgba(0,0,0,0.3)] mt-3
                        '
                            disabled={loading}>{loading ? 'Loading' : 'Submit'} </button>
                    </form>
                    {/* <button onClick={setCookie}>Set Cookie</button>
                <button onClick={updateCookie}>update Cookie</button>
                <button onClick={destroyToken}>delete Cookie</button> */}
                </div>
            </div>
        </>
    )

    function clearForm() {
        setUser('')
        setPass('')
        setLoading(false)
    }
}   