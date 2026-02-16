import { Outlet } from 'react-router-dom';
// import '../css/v2/main.css';
const SimplifiedLayout = () => {
    return (
        <div className="bg-[var(--color-theme-background)] min-h-screen">
            <Outlet />
        </div>
    )
}

export default SimplifiedLayout