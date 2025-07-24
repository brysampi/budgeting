import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { logout } from '../firebase/controller';
import '../css/navbar.css';

export default function SideNav({ hide }) {
    const [hideNav, setHideNav] = hide;
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    // console.log(paramMonth)
    useEffect(() => {
        if (!paramMonth) {
            navigate('/'); // Redirect to home if paramMonth is missing
        }
    }, [paramMonth, navigate]);
    function onLogout() {
        Cookies.get('logged_status') ? true : false
        const response = logout();
        console.log(response.status, response.message);
        window.location.href = '/';
    }
    return (
        <aside className="sidenav-container">
            <div className="shrink" onClick={() => setHideNav(!hideNav)}>
                <div className="shrink-icon">
                    C
                </div>
            </div>
            <div className={`sidenav ${hideNav ? 'w-[50px] sm:w-[200px]' : 'w-[200px] sm:w-[50px]'}`}>

                <div className="title">
                    <span className={`${hideNav ? 'hidden sm:inline' : 'inline sm:hidden'}`}>
                        My Logo here
                    </span>

                </div>

                <div className="sidenav-content">
                    <ul>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'hidden sm:inline' : 'inline sm:hidden'}`}>
                                <Link to={'/'}>Select Month</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'hidden sm:inline' : 'inline sm:hidden'}`}>
                                <Link to={`/income/${paramMonth}`}>Income</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'hidden sm:inline' : 'inline sm:hidden'}`}>
                                <Link to={`/savings/${paramMonth}`}>Savings</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'hidden sm:inline' : 'inline sm:hidden'}`}>
                                <Link to={`/savingsTracker/${paramMonth}`}>Savings Tracker</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'hidden sm:inline' : 'inline sm:hidden'}`}>
                                <Link to={`/bills/${paramMonth}`}>Bills</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'hidden sm:inline' : 'inline sm:hidden'}`}>
                                <Link to={`/expenses/${paramMonth}`}>Expenses</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'hidden sm:inline' : 'inline sm:hidden'}`}>
                                <Link to={`/expensestracker/${paramMonth}`}>Expenses Tracker</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'hidden sm:inline' : 'inline sm:hidden'}`}>
                                <Link to={`/expensesDefault/${paramMonth}`}>Expenses Default</Link>
                            </span>
                        </li>

                    </ul>
                    <ul>
                        <li onClick={onLogout}>
                            <span>A</span>
                            <span className={`${hideNav ? 'hidden sm:inline' : 'inline sm:hidden'}`}>Logout</span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'hidden sm:inline' : 'inline sm:hidden'}`}>Settings</span>
                        </li>

                    </ul>
                </div>
                <ul>
                    <li>
                        <span>A</span>
                        <span className={`${hideNav ? 'hidden sm:inline' : 'inline sm:hidden'}`}>Profile</span>
                    </li>
                </ul>
            </div>

        </aside >
    );
}