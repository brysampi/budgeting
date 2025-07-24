import { Outlet } from 'react-router-dom';
import SideNav from '../components/SideNav';
import Logout from '../components/Logout';
import { useState, useRef, useEffect } from 'react';
const MainLayout = () => {
    const [hideNav, setHideNav] = useState(false);
    const mainRef = useRef();
    const clickOutSideOfSidenav = (e) => {
        console.log(mainRef.current)
        if (mainRef.current && !mainRef.current.contains(e.target)) {
            setHideNav(true);
            console.log(mainRef.current)
        }
        // setHideNav(true);
    }
    useEffect(() => {
        document.addEventListener('mousedown', clickOutSideOfSidenav)
    })
    return (
        <div ref={mainRef}
            className="app-container">
            {/* <Logout /> */}
            <SideNav hide={[hideNav, setHideNav]} />
            <main
                onClick={() => setHideNav(true)}
                className={`main-content transition-all duration-300 mt-5 mr-5 mb-5 ml-[60px] sm:ml-15`}
            >
                <Outlet />
            </main>

        </div>
    );
}

export default MainLayout;