import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import Cookies from 'js-cookie';
import MainLayout_v1 from '../layouts/v1/MainLayout';
import MainLayout_v3 from '../layouts/v3/MainLayout';
import SimplifiedLayout from '../layouts/v2/SimplifiedLayout';
import IconLibrary from '../components/IconLibrary';

// Lazy load components
const Simplified = lazy(() => import('../pages/v2/Simplified'))
const Income = lazy(() => import('../pages/v1/Income'));
const MonthSelection = lazy(() => import('../pages/v1/MonthSelector'));
const Savings = lazy(() => import('../pages/v1/Savings'));
const SavingsTracker = lazy(() => import('../pages/v1/SavingsTracker'));
const Bills = lazy(() => import('../pages/v1/Bills'));
const BillsSettings = lazy(() => import('../pages/v1/BillsSettings'));
const Expenses = lazy(() => import('../pages/v1/Expenses'));
const ExpensesTracker = lazy(() => import('../pages/v1/ExpensesTracker'));
// const ExpensesDefault = lazy(() => import('../pages/v1/ExpensesDefault'));
const ExpensesSettings = lazy(() => import('../pages/v1/ExpensesSettings'));
const LoginPage = lazy(() => import('../pages/v1/LoginPage'));
const Wallets = lazy(() => import('../pages/v1/Wallets'));
const Dashboard = lazy(() => import('../pages/v1/Dashboard'));
// const IconLibrary = lazy(() => import('../components/IconLibrary'));

const AppRoutes = () => {
    const location = useLocation();
    // useEffect(() => {
    //     if (location.pathname === "/")
    //         document.title = "Budgeting App";

    // }, [location]);
    const [loggedIn, setLoggedIn] = useState(Cookies.get('logged_status') ? true : false)
    return (
        <>
            <Suspense fallback={<div className="flex items-center justify-center h-screen text-[var(--color-light)]">Loading...</div>}>
                <Routes>
                    {!loggedIn && (<Route path="/" element={<LoginPage onLogin={() => setLoggedIn(true)} />} />)}
                    {loggedIn && (
                        <>
                            <Route path="/" element={<MainLayout_v3 />} />
                            <Route path="icons" element={<IconLibrary />} />
                            <Route element={<SimplifiedLayout />} >
                                <Route path="v2" element={<Simplified />} />
                            </Route>
                            <Route path="v1" element={<MonthSelection onLogOut={() => setLoggedIn(false)} />} />
                            <Route element={<MainLayout_v1 />}>
                                <Route path="v1/dashboard/:paramMonth" element={<Dashboard />} />
                                <Route path="v1/wallets/:paramMonth" element={<Wallets />} />
                                <Route path="v1/income/:paramMonth" element={<Income />} />
                                <Route path="v1/savings/:paramMonth" element={<Savings />} />
                                <Route path="v1/savingsTracker/:paramMonth" element={<SavingsTracker />} />
                                <Route path="v1/bills/:paramMonth" element={<Bills />} />
                                <Route path="v1/billsSettings/:paramMonth" element={<BillsSettings />} />
                                <Route path="v1/expenses/:paramMonth" element={<Expenses />} />
                                <Route path="v1/expensestracker/:paramMonth" element={<ExpensesTracker />} />
                                <Route path="v1/expensesSettings/:paramMonth" element={<ExpensesSettings />} />
                            </Route>
                        </>
                    )}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </>
    )
};

export default AppRoutes;