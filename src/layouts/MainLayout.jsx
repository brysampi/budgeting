import { Outlet, useParams, matchPath, useNavigate, useLocation } from 'react-router-dom';
import SideNav from '../layouts/SideNav';
import Navbar from '../layouts/Navbar';
import Logout from '../components/Logout';
import { useState, useRef, useEffect, useMemo } from 'react';
// import '../css/main.css';
const routes = [
    { path: "/", title: "Bell Budgeting App" },
    { path: "/wallets/:paraMonth", title: "Wallets" },
    { path: "/income/:paraMonth", title: "Income" },
    { path: "/savings/:paraMonth", title: "Savings Summary / Category" },
    { path: "/savingsTracker/:paraMonth", title: "Savings Tracker" },
    { path: "/bills/:paraMonth", title: "Bills" },
    { path: "/billsSettings/:paraMonth", title: "Bills Settings" },
    { path: "/expenses/:paraMonth", title: "Expenses" },
    { path: "/expensesTracker/:paraMonth", title: "Expenses Tracker" },
    { path: "/expensesSettings/:paraMonth", title: "Expenses Settings" },
];

const MainLayout = () => {
    const { paramMonth } = useParams();
    const location = useLocation();
    // console.log('paramonth to ', paramMonth)
    const [selectedWallet, setSelectedWallet] = useState('')

    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect'); // Redirect to home if paramMonth is missing
        }
    }, [paramMonth, navigate]);

    const currentRoute = useMemo(() =>
        routes.find((r) => matchPath({ path: r.path, end: true }, location.pathname)) ||
        { title: "Bell Budgeting App" },
        [location.pathname]);

    useEffect(() => {
        // console.log('Current Route:', currentRoute);
        document.title = `${currentRoute.title} - Bell Budgeting App` || "Bell Budgeting App";
    }, [currentRoute]);

    const [hideNav, setHideNav] = useState(false);
    const sidenavRef = useRef();
    const backdropSidenavRef = useRef(); // Reference for the backdrop overlay
    const clickOutSideOfSidenav = (e) => {
        // console.log(mainRef.current)
        if (window.innerWidth <= 670 || window.innerHeight <= 600) {
            if (sidenavRef.current && !sidenavRef.current.contains(e.target)) {
                setHideNav(false);
                // console.log(mainRef.current)
            }
        }
        // setHideNav(true);
    }

    useEffect(() => {
        document.addEventListener('mousedown', clickOutSideOfSidenav)

        return () => {
            document.removeEventListener('mousedown', clickOutSideOfSidenav);
        };
    }, [hideNav])
    return (
        <div
            // ref={mainRef}
            className="app-container">
            {/* <Logout /> */}
            {hideNav && <div ref={backdropSidenavRef} className="backdrop-sidenav" onClick={() => setHideNav(false)} />}

            <SideNav hide={[hideNav, setHideNav]} sidenavRef={sidenavRef} />
            <main
                // ref={contentRef}
                // onClick={() => setHideNav(false)}
                className={`main-content transition-all duration-300 m-[10px] mt-[2.5vh]
                    ${hideNav ? 'ml-[60px]  sm:ml-[80px]' : 'ml-[60px]  sm:ml-[230px] '}
                    `}
                onClick={() => {
                    if (window.innerWidth <= 768) {
                        setHideNav(false);
                    }
                }}
            >
                <Navbar
                    title={currentRoute.title}
                    paramMonth={paramMonth}
                    selectedWallet={selectedWallet}
                    setSelectedWallet={setSelectedWallet}
                // walletsData={walletsData}
                // setWalletsData={setWalletsData}
                />
                <Outlet context={selectedWallet} />
            </main>

        </div>
    );
}

export default MainLayout;