import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { logout } from '../firebase/controller';
import '../css/sidenav.css';

export default function SideNav({ hide, sidenavRef }) {
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
        <aside
            ref={sidenavRef}
            className="sidenav-container">
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
                        <Link to={'/'}>
                            <li>
                                <span>A</span>
                                <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                    Select Month
                                </span>
                            </li>
                        </Link>
                        <Link to={`/income/${paramMonth}`}>
                            <li>
                                <span>A</span>
                                <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                    Income
                                </span>
                            </li>
                        </Link>
                        <Link to={`/savings/${paramMonth}`}>
                            <li>
                                <span>A</span>
                                <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                    Savings
                                </span>
                            </li>
                        </Link>
                        <Link to={`/savingsTracker/${paramMonth}`}>
                            <li>
                                <span>A</span>
                                <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                    Savings Tracker
                                </span>
                            </li>
                        </Link>
                        <Link to={`/bills/${paramMonth}`}>
                            <li>
                                <span>A</span>
                                <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                    Bills
                                </span>
                            </li>
                        </Link>
                        <Link to={`/expenses/${paramMonth}`}>
                            <li>
                                <span>A</span>
                                <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                    Expenses
                                </span>
                            </li>
                        </Link>
                        <Link to={`/expensestracker/${paramMonth}`}>
                            <li>
                                <span>A</span>
                                <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                    Expenses Tracker
                                </span>
                            </li>
                        </Link>
                        {/* <Link to={`/expensesDefault/${paramMonth}`}>
                            <li>
                                <span>A</span>
                                <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>
                                    Expenses Default
                                </span>
                            </li>
                        </Link> */}

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
                </div >
                <ul>
                    <li>
                        <span>A</span>
                        <span className={`${hideNav ? 'inline sm:hidden' : 'hidden sm:inline'}`}>Profile</span>
                    </li>
                </ul>
            </div >

        </aside >
    );
}