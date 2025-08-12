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
    async function onLogout() {
        if (Cookies.get('logged_status')) {
            const response = await logout();
            console.log(response.status, response.message);
            navigate('/');
        }
    }
    const hideText = hideNav ? 'inline sm:hidden' : 'hidden sm:inline';
    const menuItems = [
        { to: '/', label: 'Select Month', icon: 'A' },
        { to: `/income/${paramMonth}`, label: 'Income', icon: 'A' },
        { to: `/savings/${paramMonth}`, label: 'Savings', icon: 'A' },
        { to: `/savingsTracker/${paramMonth}`, label: 'Savings Tracker', icon: 'A' },
        { to: `/bills/${paramMonth}`, label: 'Bills', icon: 'A' },
        { to: `/expenses/${paramMonth}`, label: 'Expenses', icon: 'A' },
        { to: `/expensestracker/${paramMonth}`, label: 'Expenses Tracker', icon: 'A' },
        { to: `/expensesSettings/${paramMonth}`, label: 'Expenses Settings', icon: 'X' },
    ];
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
                    <span className={hideText}>
                        My Logo here
                    </span>

                </div>

                <div className="sidenav-content">
                    <ul>
                        {menuItems.map((item, idx) => (
                            <Link key={idx} to={item.to}>
                                <li>
                                    <span>{item.icon}</span>
                                    <span className={hideText}>{item.label}</span>
                                </li>
                            </Link>
                        ))}
                    </ul>
                    <ul>
                        <li onClick={onLogout}>
                            <span>A</span>
                            <span className={hideText}>Logout</span>
                        </li>
                        <li>
                            <span>A</span>
                            <span className={hideText}>Settings</span>
                        </li>

                    </ul>
                </div >
                <ul>
                    <li>
                        <span>A</span>
                        <span className={hideText}>Profile</span>
                    </li>
                </ul>
            </div >

        </aside >
    );
}