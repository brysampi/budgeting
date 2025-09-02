import { Outlet } from 'react-router-dom';
import SideNav from '../components/SideNav';
import Logout from '../components/Logout';
import { useState, useRef, useEffect } from 'react';
const MainLayout = () => {
    const [hideNav, setHideNav] = useState(false);
    const sidenavRef = useRef();
    // const mainRef = useRef();
    const backdropRef = useRef(); // Reference for the backdrop overlay
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
            {hideNav && <div ref={backdropRef} className="backdrop-sidenav" onClick={() => setHideNav(false)} />}

            <SideNav hide={[hideNav, setHideNav]} sidenavRef={sidenavRef} />
            <main
                // ref={contentRef}
                // onClick={() => setHideNav(false)}
                className={`main-content transition-all duration-300 mt-[2.5vh] mb-[2.5vh] mr-5 
                    ${hideNav ? 'ml-[60px]  sm:ml-[60px]' : 'ml-[60px]  sm:ml-[210px]'}
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