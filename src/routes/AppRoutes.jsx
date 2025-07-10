import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie';
import MainLayout from '../layouts/MainLayout';
import Income from '../components/Income';
import MonthSelection from '../components/MonthSelector';
import Savings from '../components/Savings';
import SavingsTracker from '../components/SavingsTracker';
import Bills from '../components/Bills';
import Expenses from '../components/Expenses';
import ExpensesTracker from '../components/ExpensesTracker';
import LoginPage from '../components/LoginPage';


const AppRoutes = () => {
    const [loggedIn, setLoggedIn] = useState(Cookies.get('logged_status') ? true : false)
    return (
        <Routes>
            {!loggedIn && (<Route path="/" element={<LoginPage onLogin={() => setLoggedIn(true)} />} />)}
            {loggedIn && (
                <>
                    <Route path="/" element={<MonthSelection onLogOut={() => setLoggedIn(false)} />} />
                    <Route element={<MainLayout />}>
                        <Route path="income/:paramMonth" element={<Income />} />
                        <Route path="savings/:paramMonth" element={<Savings />} />
                        <Route path="savingsTracker/:paramMonth" element={<SavingsTracker />} />
                        <Route path="bills/:paramMonth" element={<Bills />} />
                        <Route path="expenses/:paramMonth" element={<Expenses />} />
                        <Route path="expensestracker/:paramMonth" element={<ExpensesTracker />} />
                    </Route>
                </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
};

export default AppRoutes;