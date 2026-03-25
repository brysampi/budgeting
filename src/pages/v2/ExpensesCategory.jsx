import Card from '../../components/cards/Card';
import ProgressBar from '../../components/charts/ProgressBar';
import { IconCard, Icons, Icon } from '../../assets/Icons';
import { useState, useEffect } from 'react';
import BottomSheet from '../../components/modal/BottomSheetModal';
import { getExpenses, unsubscribeForAll } from '../../library/firebase/controller';
import { expensesCategoryStore } from '../../library/zustand/storage';

const ExpensesCategory = ({ paramMonth, onClick = () => { } }) => {
    const [categoriesData, setCategoriesData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const storeExpensesCategory = expensesCategoryStore((state) => state);
    // const [categoriesData, setCategoriesData] = useState([
    //     {
    //         id: 1,
    //         category: 'Housing',
    //         budget: 1200,
    //         actual: 850,
    //         icon: 'FaHouse',
    //         iconBackground: 'bg-blue-500',
    //         iconColor: 'bg-blue-500/10 text-blue-500',
    //     },
    //     {
    //         id: 2,
    //         category: 'Transportation',
    //         budget: 300,
    //         actual: 320,
    //         icon: 'FaCar',
    //         iconBackground: 'bg-orange-500',
    //         iconColor: 'bg-orange-500/10 text-orange-500',
    //     },
    //     {
    //         id: 3,
    //         category: 'Food',
    //         budget: 400,
    //         actual: 250,
    //         icon: 'FaUtensils',
    //         iconBackground: 'bg-red-500',
    //         iconColor: 'bg-red-500/10 text-red-500',
    //     },
    //     {
    //         id: 4,
    //         category: 'Utilities',
    //         budget: 200,
    //         actual: 180,
    //         icon: 'FaBolt',
    //         iconBackground: 'bg-cyan-500',
    //         iconColor: 'bg-cyan-500/10 text-cyan-500',
    //     },
    //     {
    //         id: 5,
    //         category: 'Entertainment',
    //         budget: 150,
    //         actual: 150,
    //         icon: 'FaWallet',
    //         iconBackground: 'bg-purple-500',
    //         iconColor: 'bg-purple-500/10 text-purple-500',
    //     },
    //     {
    //         id: 6,
    //         category: 'Savings',
    //         budget: 500,
    //         actual: 500,
    //         icon: 'FaPiggyBank',
    //         iconBackground: 'bg-green-500',
    //         iconColor: 'bg-green-500/10 text-green-500',
    //     },
    // ]);

    useEffect(() => {
        const returnExpensesDefault = async () => {
            setIsFetching(true);
            return await getExpenses(paramMonth, setCategoriesData, setIsFetching);

        }
        return unsubscribeForAll(returnExpensesDefault());
    }, [paramMonth]);

    useEffect(() => {
        // console.log('categoriesData2', categoriesData)
        storeExpensesCategory.setData(categoriesData);
    }, [categoriesData]);
    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-xl font-bold text-[var(--color-light)] tracking-tight">Expenses Categories</h2>
                    {/* <button className="text-[#34A853] hover:underline text-xs md:text-sm font-semibold">See all</button> */}
                </div>
                <div className="flex flex-col gap-3">
                    {
                        isFetching ?
                            <div
                                className="w-full h-[110px] rounded-2xl border-2 border-dashed border-[var(--color-theme-important)]/30 bg-[var(--color-theme-important)]/5 flex items-center justify-center gap-4 hover:bg-[var(--color-theme-important)]/10 hover:border-[var(--color-theme-important)]/50 transition-all cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-full bg-[var(--color-theme-important)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Icons.LuLoader size={24} className="text-[var(--color-theme-important)] animate-spin" strokeWidth={2.5} />
                                </div>
                                <span className="text-sm font-bold text-[var(--color-theme-important)]">Fetching Categories</span>
                            </div> :
                            categoriesData.length === 0 ? (
                                <button
                                    onClick={onClick}
                                    className="w-full h-[110px] rounded-2xl border-2 border-dashed border-[var(--color-theme-important)]/30 bg-[var(--color-theme-important)]/5 flex items-center justify-center gap-4 hover:bg-[var(--color-theme-important)]/10 hover:border-[var(--color-theme-important)]/50 transition-all cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-theme-important)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Icons.LuPlus size={24} className="text-[var(--color-theme-important)]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-sm font-bold text-[var(--color-theme-important)]">Add Expenses Category</span>
                                </button>
                            ) : (
                                [...categoriesData]
                                    .sort((a, b) => (b.actual / (b.budget || 1)) - (a.actual / (a.budget || 1)))
                                    .slice(0, isCategoriesExpanded ? 10 : 3)
                                    .map(cat => {
                                        const remaining = cat.actual ? cat.budget - cat.actual : cat.budget;
                                        const categoryId = `category-${cat.category.replace(/\s+/g, '-').toLowerCase()}`;
                                        const isOver = cat.actual > cat.budget;
                                        // console.log('remaining', remaining)
                                        // console.log('categoryId', categoryId)
                                        // console.log('isOver', isOver)
                                        // console.log('cat', cat)
                                        return (
                                            <Card padding="p-4" key={cat.id} noHover={true} className={`group ${categoryId} h-[110px] flex flex-col justify-between`}>
                                                {/* 1. Custom Header (Icon | Title/Budget | Status) */}
                                                <div className="flex items-start justify-between w-full mb-2">
                                                    <div className="flex items-center gap-3">
                                                        {/* Premium Icon Container */}
                                                        <IconCard
                                                            name={cat.icon || "FaHouse"}
                                                            iconColor={cat.iconBackground}
                                                            className="!w-9 !h-9 shadow-sm"
                                                            size={18}
                                                        />

                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-[var(--color-light)] group-hover:text-[var(--color-theme-important)] transition-all leading-tight">
                                                                {cat.category}
                                                            </span>
                                                            <span className="text-[10px] text-[var(--color-theme-secondary-text)] font-semibold mt-0.5 opacity-50">
                                                                {cat.actual ? cat.actual.toLocaleString() : 0} of {cat.budget ? cat.budget.toLocaleString() : 0}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Right Aligned Status Label */}
                                                    {!cat.actual || !cat.budget ? '' : (
                                                        <div className="pt-0.5">
                                                            <span className="text-[10px] text-[var(--color-theme-secondary-text)] font-bold opacity-70">
                                                                {Math.abs(remaining).toLocaleString()} {isOver ? 'over' : 'left'}
                                                                {/* {remaining} */}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 2. Progress Bar */}
                                                <div>
                                                    <ProgressBar
                                                        data={[{ label: cat.category, value: cat.actual, max: Math.max(cat.budget, 0.01) }]}
                                                        enableDropdown={false}
                                                        showLabel={false}
                                                        showPercentage={true}
                                                        showWarning={false}
                                                        showValues={false}
                                                        currentLabel="Spent"
                                                        remainingLabel="Left"
                                                    />
                                                </div>
                                            </Card>
                                        );
                                    })
                            )}

                    <div className="flex flex-col gap-3">
                        {categoriesData.length > 3 && (
                            <button
                                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                                className="w-full py-3 rounded-2xl border border-[var(--color-theme-secondary)] text-[var(--color-theme-secondary-text)] font-semibold text-xs hover:bg-[var(--color-theme-secondary)]/5 transition-all flex items-center justify-center gap-2 group"
                            >
                                <span>{isCategoriesExpanded ? 'View Less' : `View More (${categoriesData.length - 3} more)`}</span>
                                <Icons.LuArrowLeft className={`transition-transform duration-300 ${isCategoriesExpanded ? 'rotate-90' : '-rotate-90'}`} size={14} />
                            </button>
                        )}

                        {/* <ExpensesCategory
                                    isAdd={true}
                                    onClick={() => {
                                        setModalFormType('expenses');
                                        setIsModalOpen(true);
                                    }}
                                /> */}
                    </div>
                </div>
            </div>
            {/* Bottom Sheet Modal */}
            <BottomSheet
                isVisible={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                title="Select Expenses Category"
            >
                {/* ... existing categories grid ... */}
                <div className="grid grid-cols-2 gap-4">
                    {categoriesData.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setIsBottomSheetOpen(false)}
                            className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/[0.03] hover:bg-white/[0.08] transition-all border border-white/5"
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cat.colorClass} ${cat.iconColorClass}`}>
                                <Icon name={cat.icon} size={24} />
                            </div>
                            <span className="text-sm font-bold text-[var(--color-light)]">{cat.title}</span>
                        </button>
                    ))}
                </div>
            </BottomSheet>
        </>
    )
}

export default ExpensesCategory;
