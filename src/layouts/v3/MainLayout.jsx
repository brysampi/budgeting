import Main from "../../pages/v3/Main";
import '../../css/v3/form.css';
const MainLayout = () => {
    return (
        <>
            <div className="w-full max-w-[var(--size-page)] mx-auto p-4 md:p-8 flex flex-col gap-8 min-h-screen relative font-sans pb-32">
                <Main />
            </div>
        </>
    );
}

export default MainLayout;