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
        <div className="sidenav-container">
            <div className="shrink" onClick={() => setHideNav(!hideNav)}>
                <div className="shrink-icon">
                    C
                </div>
            </div>
            <div className={`sidenav ${hideNav ? 'w-[200px] sm:w-[50px]' : 'w-[50px] sm:w-[200px]'}`}>

                <div className="title">
                    <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                        My Logo here
                    </span>

                </div>

                <div className="sidenav-content">
                    <ul>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                <Link to={'/'}>Select Month</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                <Link to={`/income/${paramMonth}`}>Income</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                <Link to={`/savings/${paramMonth}`}>Savings</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                <Link to={`/savingsTracker/${paramMonth}`}>Savings Tracker</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                <Link to={`/bills/${paramMonth}`}>Bills</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                <Link to={`/expenses/${paramMonth}`}>Expenses</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                <Link to={`/expensestracker/${paramMonth}`}>Expenses Tracker</Link>
                            </span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                <Link to={`/expensesDefault/${paramMonth}`}>Expenses Default</Link>
                            </span>
                        </li>

                    </ul>
                    <ul>
                        <li onClick={onLogout}>
                            <span>A</span>
                            <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>Logout</span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>Settings</span>
                        </li>

                    </ul>
                </div>
                <ul>
                    <li>
                        <span>A</span>
                        <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>Profile</span>
                    </li>
                </ul>
            </div>

        </div >
    );
}