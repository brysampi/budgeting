import { useEffect, useState } from "react";
import Dropdown from "../../../components/Dropdown";
import {
    NotificationIcon as FaBell,
    SettingsIcon as FaGear,
    SunIcon as FaSun,
    MoonIcon as FaMoon,
    IconCard,
    Icon
} from "../../../assets/Icons";
import Cookies from "js-cookie";
import { logout } from "../../../library/firebase/controller";
// const Header = ({ isDarkMode, setIsDarkMode }) => {
const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const handleLogout = async () => {
        const response = await logout();
        if (response.status === 'success') {
            window.location.href = '/login';
        }
        // console.log('Logout');
    };

    const settingItems = [
        {
            label: 'General Settings', icon:
                <IconCard name="LuSettings" iconColor="bg-orange-500/10 text-orange-500" />
            //  <Icons.LuSettings size={18} />
            , onClick: () => console.log('Settings clicked')
        },
        {
            label: 'Security', icon:
                <IconCard name="LuLock" iconColor="bg-orange-500/10 text-orange-500" />
            //  <Icons.LuLock size={18} />
            , onClick: () => console.log('Security clicked')
        },
        {
            label: 'Help & Support', icon:
                <IconCard name="LuCircleHelp" iconColor="bg-orange-500/10 text-orange-500" />
            //  <Icons.LuCircleHelp size={18} />
            , onClick: () => console.log('Help clicked')
        },
    ];

    const profileItems = [
        {
            label: 'View Profile', icon:
                <IconCard name="LuUser" iconColor="bg-orange-500/10 text-orange-500" />
            //  <Icons.LuUser size={18} />
            , onClick: () => console.log('Profile clicked')
        },
        {
            label: 'Settings', icon:
                <IconCard name="LuSettings" iconColor="bg-orange-500/10 text-orange-500" />
            //  <Icons.LuSettings size={18} />
            , onClick: () => console.log('Settings clicked')
        },
        {
            label: 'Logout', icon:
                <IconCard name="LuLogOut" iconColor="bg-orange-500/10 text-orange-500" />
            //  <Icons.LuLogOut size={18} />
            , onClick: handleLogout, type: 'danger'
        },
    ];

    useEffect(() => {
        if (!isDarkMode) {
            document.documentElement.classList.add('light-mode');
            document.documentElement.style.colorScheme = 'light';
        } else {
            document.documentElement.classList.remove('light-mode');
            document.documentElement.style.colorScheme = 'dark';
        }
    }, [isDarkMode]);
    const toggleTheme = () => setIsDarkMode(!isDarkMode);
    return (
        <>
            {/* Header */}
            <header className="flex justify-between items-center px-1">
                <div>
                    <h2 className="text-[var(--color-theme-secondary-text)] text-xs md:text-sm font-medium">Hello, </h2>
                    <h1 className="text-xl md:text-2xl font-extrabold text-[var(--color-light)] mt-1">{Cookies.get('name')}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-[var(--color-theme-secondary)] dark:bg-[var(--color-theme-secondary)] hover:bg-[var(--color-theme-important-light)] flex items-center justify-center text-[var(--color-theme-important-light)] hover:text-[var(--color-theme-secondary)] transition-all shadow-sm border border-black/5">
                        {isDarkMode ? <Icon name="FaSun" size={16} /> : <Icon name="FaMoon" size={16} />}
                    </button>
                    {/* <button className="w-10 h-10 rounded-full bg-white dark:bg-[var(--color-theme-secondary)] flex items-center justify-center text-[var(--color-theme-secondary-text)] hover:shadow-md transition-all border border-black/5">
                        <FaBell size={16} />
                    </button> */}

                    {/* <Dropdown
                        items={settingItems}
                        trigger={
                            <button className="w-10 h-10 rounded-full bg-white dark:bg-[var(--color-theme-secondary)] flex items-center justify-center text-[var(--color-theme-secondary-text)] hover:shadow-md transition-all border border-black/5">
                                <FaGear size={16} />
                            </button>
                        }
                    /> */}

                    <Dropdown
                        items={profileItems}
                        trigger={
                            <div className="w-10 h-10 rounded-full bg-[#34A853] text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white/20 hover:scale-105 transition-transform">
                                {Cookies.get('name')?.split(" ").slice(0, 2).map((name) => name.charAt(0)).join("").toUpperCase() || 'Bell Tamad'}
                                {/* {("John Kamad talaga").split(" ").slice(0, 2).map((name) => name.charAt(0)).join("").toUpperCase()} */}
                            </div>
                        }
                    />
                </div>
            </header>
        </>
    )
}

export default Header;