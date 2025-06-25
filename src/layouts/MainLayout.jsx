import { Outlet } from 'react-router-dom';
import SideNav from '../components/SideNav';

const MainLayout = () => (
    <div className="app-container">
        <SideNav />
        <div className="main-content">
            <Outlet />
        </div>
    </div>
);

export default MainLayout;