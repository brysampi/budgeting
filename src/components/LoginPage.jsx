import React, { useState } from 'react';
import { login } from "../firebase/controller";
// import '../css/login.css';
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
            <div className='flex flex-col items-center justify-center h-screen'>
                <div className='card card-login'>
                    <div className='text-center font-bold text-2xl p-10 text-[var(--theme-one-neutral-dark)]'>
                        My Logo Here
                    </div>
                    <form onSubmit={loginAccount}
                        className='
                        flex flex-col items-center
                        '>
                        <div className='floating-label-wrapper input-login max-w-[300px]'>
                            <input id="user" type="text" onChange={(e) => setUser(e.target.value)} value={user} placeholder='Username' />
                            <label htmlFor="user">Username</label>
                        </div>
                        <div className='floating-label-wrapper input-login max-w-[300px]'>
                            <input id="pass" type={viewPassword === false ? 'password' : 'text'} onChange={(e) => setPass(e.target.value)} value={pass} placeholder='Password' />
                            <label htmlFor="pass">Password</label>
                        </div>
                        <div className='flex items-center justify-left w-full max-w-[300px]'>
                            <input type='checkbox' id='checkbox' onClick={seePassword} />
                            <label htmlFor='checkbox' className='ml-2' >Show Password</label>
                        </div>

                        {/* <div> */}
                        <button
                            className='btn btn-primary-gradient 
                                max-w-[300px] w-full sm:w-ful'
                            disabled={loading}>{loading ? 'Loading' : 'Login'}
                        </button>
                        {/* </div> */}
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
