import MainLayout from "../layouts/v3/MainLayout";
import Main from "../pages/v3/Main";
import { Routes, Route } from "react-router-dom";
const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainLayout />} />
                {/* <Route element={<MainLayout />}>
                    <Route path="v1/dashboard/:paramMonth" element={<Dashboard />} />
                </Route> */}
            </Routes>
        </>
    )
};

export default AppRoutes;