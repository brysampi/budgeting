import { Outlet } from 'react-router-dom';
import SideNav from '../components/SideNav';
import Logout from '../components/Logout';
import { useState } from 'react';
const MainLayout = () => {
    const [hideNav, setHideNav] = useState(false);

    return (
        <div className="app-container">
            {/* <Logout /> */}
            <div className="">
                <SideNav hide={[hideNav, setHideNav]} />
            </div>
            <div className={`main-content transition-all duration-300 ${hideNav ? 'm-[20px_20px_20px_220px] sm:m-[20px_20px_20px_60px]' : 'm-[20px_20px_20px_60px] sm:m-[20px_20px_20px_220px]'}`}>
                <Outlet />
            </div>
        </div>
    );
}

export default MainLayout;