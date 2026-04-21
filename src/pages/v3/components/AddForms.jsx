import ExpenseForm from "../forms/ExpenseForm";
import IncomeForm from "../forms/IncomeForm";
import BillsForm from "../forms/BillsForm";
import CategoryForm from "../forms/CategoryForm";
import { Icon, Icons } from "../../../assets/Icons";
import Modal from "../../../components/modal/Modal";
import { useState } from 'react';


export default function AddForms() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalFormType, setModalFormType] = useState('Expense');
    const [isUpdate, setIsUpdate] = useState(false);
    return (
        <>
            <button onClick={() => setIsModalOpen(true)}>Add New Entry</button>
            <Modal
                title={`Add New ${modalFormType}`}
                isModalOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fullscreen={false}
                maxWidth='550px'
                closeOnOverlay={false}
            >
                {/* <button
                    onClick={() => setIsBottomSheetOpen(true)}
                    className="w-full p-4 rounded-2xl bg-[var(--color-theme-secondary)] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-theme-important)]/10 flex items-center justify-center text-[var(--color-theme-important)]">
                            <Icons.LuShoppingBag size={20} />
                        </div>
                        <div className="text-left">
                            <div className="text-[var(--color-light)] font-bold">Quick Select Expenses Category</div>
                            <div className="text-[var(--color-theme-secondary-text)] text-xs">Choose from frequently used</div>
                        </div>
                    </div>
                    <Icons.LuArrowLeft className="rotate-180 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button> */}
                {/* {modalFormType === 'expensesTracker' && (
                    <>
                        <button
                            // onClick={() => setIsSettingsOpen(true)}
                            onClick={() => setIsModalOpenAI(true)}
                            className="w-full p-4 rounded-2xl bg-[var(--color-theme-secondary)] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                    <Icons.LuSparkles size={20} />
                                </div>
                                <div>
                                    <div className="text-[var(--color-light)] font-bold">AI Receipt Scanner</div>
                                    <div className="text-[var(--color-theme-secondary-text)] text-xs">Auto-extract details from photos</div>
                                </div>
                            </div>
                            <Icons.LuArrowLeft className="rotate-180 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                        <div className="h-[1px] bg-white/5 w-full my-2" />
                    </>
                )} */}

                {/* Modern Segmented Tab Bar for Transactions */}
                {!isUpdate && ['Expense', 'Income', 'Bill', 'Saving'].includes(modalFormType) && (
                    <div className="flex p-1 bg-black/20 dark:bg-white/[0.03] rounded-2xl border border-white/5 mb-6 gap-1 w-full">
                        {[
                            { label: 'Expense', type: 'Expense', icon: 'LuShoppingBag' },
                            { label: 'Income', type: 'Income', icon: 'LuHandCoins' },
                            { label: 'Bill', type: 'Bill', icon: 'FaBolt' },
                            // { label: 'Saving', type: 'Saving', icon: 'FaPiggyBank' }
                        ].map(tab => (
                            <button
                                key={tab.type}
                                onClick={() => setModalFormType(tab.type)}
                                className={`flex-1 py-2.5 px-1 rounded-xl text-[9px] xs:text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${modalFormType === tab.type
                                    ? 'bg-[var(--color-theme-important)] text-white shadow-lg'
                                    : 'text-[var(--color-theme-secondary-text)] hover:text-[var(--color-light)] hover:bg-white/5'
                                    }`}
                            >
                                <Icon name={tab.icon} size={14} />
                                <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* {modalFormType === 'expensesTracker' && !isUpdate && ( */}
                <div className="flex flex-col gap-6">

                    {modalFormType === 'Expense' && (
                        // <ExpensesForm onFinish={() => setIsModalOpen(false)} />
                        <ExpenseForm />
                        // console.log('expensesTracker')
                    )}

                    {modalFormType === 'Income' && (
                        // <IncomeForm onFinish={() => setIsModalOpen(false)} />
                        <IncomeForm />
                        // console.log('income')
                    )}

                    {modalFormType === 'Bill' && (
                        // <BillsForm onFinish={() => setIsModalOpen(false)} />
                        <BillsForm />
                        // <CategoryForm />
                        // console.log('bills')
                    )}

                    {modalFormType === 'Saving' && (
                        // <SavingsForm onFinish={() => setIsModalOpen(false)} />
                        <SavingForm />

                        // console.log('savingsTracker')
                    )}
                    {/* <div className="flex flex-col"> */}
                    <button
                        className="btn-cancel"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                    {/* </div> */}
                    {/* {isUpdate && (
                        <ModalForms
                            paramMonth={paramMonth}
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            formType={modalFormType}
                            isUpdate={isUpdate}
                            setIsUpdate={setIsUpdate}
                            updateData={updateData}
                            setUpdateData={setUpdateData}
                        />
                    )} */}
                </div>
                {/* )} */}
            </Modal>
        </>
    );
}