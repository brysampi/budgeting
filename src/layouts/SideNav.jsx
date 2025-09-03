import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { logout } from '../firebase/controller';
import '../css/sidenav.css';
import { LuIndentDecrease, LuIndentIncrease, LuCalendarDays, LuCoins, LuHandCoins, LuClipboardList, LuNewspaper, LuShoppingBag, LuSettings, LuLogOut, LuCircleUserRound } from "react-icons/lu";
import { LiaCalendar, LiaCoinsSolid, LiaUserCogSolid } from "react-icons/lia";

export default function SideNav({ hide, sidenavRef }) {
    const [hideNav, setHideNav] = hide;
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    // console.log(paramMonth)
    const isActive = (path, exact = false) => {
        return exact
            ? location.pathname === path
            : location.pathname.startsWith(path);
    }
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
        { to: '/', label: 'Select Month', icon: <LuCalendarDays />, exact: true },
        { to: `/income/${paramMonth}`, label: 'Income', icon: <LiaCoinsSolid /> },
        // { to: `/savings/${paramMonth}`, label: 'Savings', icon: <LuHandCoins /> },
        // { to: `/savingsTracker/${paramMonth}`, label: 'Savings Tracker', icon: <LuClipboardList /> },
        { to: `/savingsTracker/${paramMonth}`, label: 'Savings', icon: <LuHandCoins /> },
        { to: `/bills/${paramMonth}`, label: 'Bills', icon: <LuNewspaper /> },
        { to: `/expenses/${paramMonth}`, label: 'Expenses', icon: <LuShoppingBag /> },
        { to: `/expensestracker/${paramMonth}`, label: 'Expenses Tracker', icon: <LuClipboardList /> },
        // { to: `/expensesSettings/${paramMonth}`, label: 'Expenses Settings', icon: <LuSettings /> },
        // { to: `/expensestracker/${paramMonth}`, label: 'Expenses', icon: <LuShoppingBag /> },
    ];
    return (
        <aside
            ref={sidenavRef}
            className="sidenav-container">
            <div className="shrink" onClick={() => setHideNav(!hideNav)}>
                <div className="shrink-icon">
                    {hideNav ? < LuIndentIncrease /> : <LuIndentDecrease />}
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
                                <li className={isActive(item.to, item.exact) ? 'active' : ''}>
                                    <span>{item.icon}</span>
                                    <span className={hideText}>{item.label}</span>
                                </li>
                            </Link>
                        ))}
                    </ul>
                    <ul>
                        <li onClick={onLogout}>
                            <span><LuLogOut /></span>
                            <span className={hideText}>Logout</span>
                        </li>
                        <li>
                            <span><LiaUserCogSolid /></span>
                            <span className={hideText}>Settings</span>
                        </li>

                    </ul>
                </div >
                <ul>
                    <li className="text-white rounded-b-lg">
                        <span><LuCircleUserRound /></span>
                        <span className={hideText}>Profile</span>
                    </li>
                </ul>
            </div >

        </aside >
    );
}