import { Outlet } from 'react-router-dom';
import SideNav from '../components/SideNav';
import Logout from '../components/Logout';

const MainLayout = () => (
    <div className="app-container">
        <Logout />
        <SideNav />
        <div className="main-content">
            <Outlet />
        </div>
    </div>
);

export default MainLayout;