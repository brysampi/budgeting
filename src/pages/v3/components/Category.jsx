import { useState, useEffect, useMemo, use } from 'react';
import { getExpenses, unsubscribeForAll } from '../../../library/firebase/controller';
import { expensesCategoryStore } from '../../../library/zustand/storage';
import { IconCard, Icons, Icon } from '../../../assets/Icons';
import CategoryForm from '../forms/CategoryForm';
import Modal from '../../../components/modal/Modal';
import Card from '../../../components/cards/Card';
import ProgressBar from '../../../components/charts/ProgressBar';
import BottomSheet from '../../../components/modal/BottomSheetModal';

const Category = ({ paramMonth }) => {
    const [categoriesData, setCategoriesData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const storeExpensesCategory = expensesCategoryStore((state) => state.data) || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const iconSize = 24;
    const incomeData = 22000;
    const [transactionData, setTransactionData] = useState([
        {
            id: 1,
            category: "OetCHDe8V3f4ARenYU1F",
            amount: 850,

        },
        // {
        //     id: 2,
        //     category: "sKvLuUBctnH1nyfl77eZ",
        //     amount: 320,
        // },
    ]);
    // const [categoriesData, setCategoriesData] = useState([
    //     {
    //         id: 1,
    //         category: 'Housing',
    //         budget: 1200,
    //         actual: 850,
    //         icon: 'FaHouse',
    //         // iconBackground: 'bg-blue-500',
    //         color: '#34A853',
    //     },
    //     {
    //         id: 2,
    //         category: 'Transportation',
    //         budget: 300,
    //         actual: 320,
    //         icon: 'FaCar',
    //         // iconBackground: 'bg-orange-500',
    //         color: '#34A853',
    //     },
    //     {
    //         id: 3,
    //         category: 'Food',
    //         budget: 400,
    //         actual: 250,
    //         icon: 'FaUtensils',
    //         // iconBackground: 'bg-red-500',
    //         color: '#34A853',
    //     },
    //     {
    //         id: 4,
    //         category: 'Utilities',
    //         budget: 200,
    //         actual: 10,
    //         icon: 'FaBolt',
    //         // iconBackground: 'bg-cyan-500',
    //         color: '#34A853',
    //     },
    //     {
    //         id: 5,
    //         category: 'Entertainment',
    //         // budget: 150,
    //         actual: 15000,
    //         icon: 'FaWallet',
    //         // iconBackground: 'bg-purple-500',
    //         color: '#34A853',
    //     },
    //     {
    //         id: 6,
    //         category: 'Savings',
    //         budget: 500,
    //         actual: 500,
    //         icon: 'FaPiggyBank',
    //         // iconBackground: 'bg-green-500',
    //         color: '#34A853',
    //     },
    // ]);

    // useEffect(() => {
    //     const returnExpensesDefault = async () => {
    //         setIsFetching(true);
    //         return await getExpenses(paramMonth, setCategoriesData, setIsFetching);

    //     }
    //     return unsubscribeForAll(returnExpensesDefault());
    // }, [paramMonth]);

    // useEffect(() => {
    //     // console.log('categoriesData2', categoriesData)
    //     storeExpensesCategory.setData(categoriesData);
    // }, [categoriesData]);

    const test = useMemo(() => {
        const result = storeExpensesCategory.map(categoryItem => {
            // use the second array (transactionData) to find all transactions that match the current category's id
            const total = transactionData
                // find the transactions that match the current category in the loop
                .filter(transactionItem => transactionItem.category === categoryItem.id)
                // sum up the amounts of the matching transactions
                .reduce((sum, item) => sum + item.amount, 0);

            return {
                ...categoryItem,
                amount: total
            };
        });
        // console.log('Result', result)
        setCategoriesData(result);

        // console.log('Categories Data', categoriesData)
    }, [storeExpensesCategory, transactionData])

    // const fetchTransactions = async () => {
    //     setIsFetching(true);
    //     await getTransactions(paramMonth, setTransactionData, setIsFetching);
    // }
    useEffect(() => {
        // fetchTransactions();
        console.log('Category ParamMonth', paramMonth)
    }, [paramMonth]);

    const addCategoryModal = () => {

    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-xl font-bold text-[var(--color-light)] tracking-tight">Expenses Categories</h2>
                    {/* <button onClick={() => setIsModalOpen(true)} className="text-[#34A853] hover:underline text-xs md:text-sm font-semibold">See all</button> */}
                    <div className="text-xs text-[var(--color-theme-secondary-text)] font-medium flex items-center gap-3">
                        <button
                            onClick={() => console.log('View All Categories')}
                            className="hover:text-[var(--color-theme-important)] text-xs text-[var(--color-theme-secondary-text)] font-medium">
                            {categoriesData.length} {categoriesData.length === 1 ? 'Category' : 'Categories'}
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="hover:text-[var(--color-theme-important)] text-xs text-[var(--color-theme-secondary-text)] font-medium">
                            Add Category
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    {
                        isFetching ?
                            <div
                                className="w-full h-[110px] rounded-2xl border-2 border-dashed border-[var(--color-theme-important)]/30 bg-[var(--color-theme-important)]/5 flex items-center justify-center gap-4 hover:bg-[var(--color-theme-important)]/10 hover:border-[var(--color-theme-important)]/50 transition-all cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-full bg-[var(--color-theme-important)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Icon name="LuLoader" size={iconSize} className="text-[var(--color-theme-important)] animate-spin" strokeWidth={2.5} />
                                </div>
                                <span className="text-sm font-bold text-[var(--color-theme-important)]">Fetching Categories</span>
                            </div> :
                            categoriesData.length === 0 ? (
                                <button
                                    onClick={addCategoryModal}
                                    className="w-full h-[110px] rounded-2xl border-2 border-dashed border-[var(--color-theme-important)]/30 bg-[var(--color-theme-important)]/5 flex items-center justify-center gap-4 hover:bg-[var(--color-theme-important)]/10 hover:border-[var(--color-theme-important)]/50 transition-all cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-theme-important)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Icon name="LuPlus" size={iconSize} className="text-[var(--color-theme-important)]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-sm font-bold text-[var(--color-theme-important)]">Add Expenses Category</span>
                                </button>
                            ) : (
                                [...categoriesData]
                                    .sort((a, b) => {
                                        // Calculate percentage for a and b
                                        // For categories with budget: actual / budget
                                        // For categories without budget: actual / incomeData (Monthly Salary)
                                        const percentA = a.budget ? (a.amount / a.budget) : (a.amount / incomeData);
                                        const percentB = b.budget ? (b.amount / b.budget) : (b.amount / incomeData);

                                        return percentB - percentA;
                                    })
                                    .slice(0, isCategoriesExpanded ? 10 : 3)
                                    .map((cat, index) => {
                                        const remaining = cat.amount ? cat.budget - cat.amount : cat.budget;
                                        const categoryId = `category-${cat.name.replace(/\s+/g, '-').toLowerCase()}`;
                                        const isOver = cat.amount > cat.budget;
                                        // console.log('remaining', remaining)
                                        // console.log('categoryId', categoryId)
                                        // console.log('isOver', isOver)
                                        // console.log('cat', cat)
                                        return (
                                            <Card padding="p-4" key={index} noHover={true} className={`group ${categoryId} flex flex-col justify-between`}>
                                                {/* 1. Custom Header (Icon | Title/Budget | Status) */}
                                                <div className="flex items-start justify-between w-full">
                                                    <div className="flex items-center gap-3">
                                                        {/* Premium Icon Container */}
                                                        {/* <span
                                                            className="category-form-icon-preview-v3"
                                                        > */}
                                                        <IconCard
                                                            name={cat.icon || "FaHouse"}
                                                            // size={iconSize}
                                                            textColor={cat.color}
                                                            bgColor={`${cat.color}20`}
                                                        />
                                                        {/* </span> */}


                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-[var(--color-light)] group-hover:text-[var(--color-theme-important)] transition-all leading-tight">
                                                                {cat.name.toUpperCase()}
                                                            </span>
                                                            <span className="text-[10px] text-[var(--color-theme-secondary-text)] font-semibold mt-0.5 opacity-50">
                                                                {cat.amount ? `${cat.amount.toLocaleString()}` : 0} of {cat.budget ? `${cat.budget.toLocaleString()}-(Monthly Budget)` : `${incomeData}-(This Month's Income)`}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Right Aligned Status Label */}
                                                    {!cat.amount || !cat.budget ? '' : (
                                                        <div className="pt-0.5">
                                                            <span className="text-[10px] text-[var(--color-theme-secondary-text)] font-bold opacity-70">
                                                                {Math.abs(remaining).toLocaleString()} {isOver ? 'over' : 'left'}
                                                                {/* {remaining} */}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 2. Progress Bar */}
                                                <div className='mt-2'>
                                                    <ProgressBar
                                                        data={[{ label: cat.name.toUpperCase(), value: cat.amount, max: cat.budget ? Math.max(cat.budget, 0.01) : incomeData }]}
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
                                <Icon name="LuArrowLeft" className={`transition-transform duration-300 ${isCategoriesExpanded ? 'rotate-90' : '-rotate-90'}`} size={14} />
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
            <Modal
                title="Add Category"
                isModalOpen={isModalOpen}
                fullscreen={false}
                maxWidth='550px'
                closeOnOverlay={false}
                onClose={() => setIsModalOpen(false)}
            >
                <CategoryForm />
            </Modal>
        </>
    )
}

export default Category;
