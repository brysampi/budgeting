import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import Cookies from 'js-cookie';
import MainLayout from '../layouts/MainLayout';
import SimplifiedLayout from '../layouts/v2/SimplifiedLayout';

// Lazy load components
const Simplified = lazy(() => import('../components/v2/Simplified'))
const Income = lazy(() => import('../components/Income'));
const MonthSelection = lazy(() => import('../components/MonthSelector'));
const Savings = lazy(() => import('../components/Savings'));
const SavingsTracker = lazy(() => import('../components/SavingsTracker'));
const Bills = lazy(() => import('../components/Bills'));
const BillsSettings = lazy(() => import('../components/BillsSettings'));
const Expenses = lazy(() => import('../components/Expenses'));
const ExpensesTracker = lazy(() => import('../components/ExpensesTracker'));
// const ExpensesDefault = lazy(() => import('../components/ExpensesDefault'));
const ExpensesSettings = lazy(() => import('../components/ExpensesSettings'));
const LoginPage = lazy(() => import('../components/LoginPage'));
const Wallets = lazy(() => import('../components/Wallets'));
const Dashboard = lazy(() => import('../components/Dashboard'));


const AppRoutes = () => {
    const location = useLocation();
    // useEffect(() => {
    //     if (location.pathname === "/")
    //         document.title = "Budgeting App";

    // }, [location]);
    const [loggedIn, setLoggedIn] = useState(Cookies.get('logged_status') ? true : false)
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen text-[var(--color-light)]">Loading...</div>}>
            <Routes>
                {!loggedIn && (<Route path="/" element={<LoginPage onLogin={() => setLoggedIn(true)} />} />)}
                {loggedIn && (
                    <>
                        <Route element={<SimplifiedLayout />} >
                            <Route path="/" element={<Simplified />} />
                        </Route>
                        <Route path="/monthSelector" element={<MonthSelection onLogOut={() => setLoggedIn(false)} />} />
                        <Route element={<MainLayout />}>
                            <Route path="dashboard/:paramMonth" element={<Dashboard />} />
                            <Route path="wallets/:paramMonth" element={<Wallets />} />
                            <Route path="income/:paramMonth" element={<Income />} />
                            <Route path="savings/:paramMonth" element={<Savings />} />
                            <Route path="savingsTracker/:paramMonth" element={<SavingsTracker />} />
                            <Route path="bills/:paramMonth" element={<Bills />} />
                            <Route path="billsSettings/:paramMonth" element={<BillsSettings />} />
                            <Route path="expenses/:paramMonth" element={<Expenses />} />
                            <Route path="expensestracker/:paramMonth" element={<ExpensesTracker />} />
                            <Route path="expensesSettings/:paramMonth" element={<ExpensesSettings />} />
                        </Route>
                    </>
                )}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    )
};

export default AppRoutes;