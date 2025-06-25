import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Income from '../components/Income';
import MonthSelection from '../components/MonthSelector';
import Savings from '../components/Savings';
import Bills from '../components/Bills';
import Expenses from '../components/Expenses';
import ExpensesTracker from '../components/ExpensesTracker';


const AppRoutes = () => (
    <Routes>
        {/* No sidebar layout */}
        <Route path="/" element={<MonthSelection />} />

        {/* Routes with sidebar layout */}
        <Route element={<MainLayout />}>
            {/* <Route path="income/:paramMonth" element={<Income />} /> */}
            <Route path="income/:paramMonth" element={<Income />} />
            <Route path="savings/:paramMonth" element={<Savings />} />
            <Route path="bills/:paramMonth" element={<Bills />} />
            <Route path="expenses/:paramMonth" element={<Expenses />} />
            <Route path="expensestracker/:paramMonth" element={<ExpensesTracker />} />
        </Route>
    </Routes>
);

export default AppRoutes;