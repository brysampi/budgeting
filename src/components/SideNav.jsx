import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { logout } from '../firebase/controller';


export default function SideNav() {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    // console.log(paramMonth)
    useEffect(() => {
        if (!paramMonth) {
            navigate('/'); // Redirect to home if paramMonth is missing
        }
    }, [paramMonth, navigate]);
    function onLogout() {
        Cookies.get('logged_status') ? true : false
        const response = logout();
        console.log(response.status, response.message);
        window.location.href = '/';
    }
    return (
        <div className="sidenav">
            <h2>Nav</h2>
            <ul>
                <li><Link to={'/'}>Select Month</Link></li>
                <li><Link to={`/income/${paramMonth}`}>Income</Link></li>
                <li><Link to={`/savings/${paramMonth}`}>Savings</Link></li>
                <li><Link to={`/savingsTracker/${paramMonth}`}>Savings Tracker</Link></li>
                <li><Link to={`/bills/${paramMonth}`}>Bills</Link></li>
                <li><Link to={`/expenses/${paramMonth}`}>Expenses</Link></li>
                <li><Link to={`/expensestracker/${paramMonth}`}>Expenses Tracker</Link></li>
                <li><Link to={`/expensesDefault/${paramMonth}`}>Expenses Default</Link></li>
                <li onClick={onLogout}>Logout</li>
            </ul>
        </div >
    );
}