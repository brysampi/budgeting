import { Outlet } from 'react-router-dom';
import SideNav from '../components/SideNav';
import Logout from '../components/Logout';
import { useState, useRef, useEffect } from 'react';
const MainLayout = () => {
    const [hideNav, setHideNav] = useState(false);
    const contentRef = useRef();
    const mainRef = useRef();
    const clickOutSideOfSidenav = (e) => {
        // console.log(mainRef.current)
        if (window.innerWidth <= 768) {
            if (contentRef.current && !contentRef.current.contains(e.target)) {
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
    }, [])
    return (
        <div ref={mainRef}
            className="app-container">
            {/* <Logout /> */}
            <SideNav hide={[hideNav, setHideNav]} />
            <main
                ref={contentRef}
                // onClick={() => setHideNav(false)}
                className={`main-content transition-all duration-300 mt-[2.5vh] mb-[2.5vh] mr-5 
                    ${hideNav ? 'ml-[60px]' : 'ml-[60px]  sm:ml-[220px]'}
                    `}
                onClick={() => {
                    if (window.innerWidth <= 768) {
                        setHideNav(false);
                    }
                }}
            >
                <Outlet />
            </main>

        </div>
    );
}

export default MainLayout;