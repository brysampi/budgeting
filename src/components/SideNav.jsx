import { Link } from 'react-router-dom';
export default function SideNav() {
    return (
        <div className="sidenav">
            <h2>Expense Tracker</h2>
            <ul>
                <li><Link to="/income">Income</Link></li>
                <li><Link to="/bills">Bills</Link></li>
                <li><Link to="/expenses">Expenses</Link></li>
                <li><Link to="/expensestracker">Expenses Tracker</Link></li>
            </ul>
        </div>
    );
}