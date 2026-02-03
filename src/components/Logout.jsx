import { logout, collectedData } from "../firebase/controller";
export default function Logout({ onLogout }) {
    const clickLogout = () => {
        try {
            const response = logout();
            console.log(response.status, response.message);
            onLogout(); // Call the onLogout function passed as a prop
            logout()
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
    return (
        <>
            <div>
                <button onClick={clickLogout}>Logout</button>
            </div>
            {/* <div>
                <button onClick={() => collectedData('2025-6-1')}>Collected Data</button>
            </div> */}
        </>
    );
}
