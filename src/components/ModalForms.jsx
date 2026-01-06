import { LuPlus } from "react-icons/lu";
import { useState, useEffect } from "react";
import {
    addWallets, income, savings, savingsTracker, bills, expenses, expensesTracker,
    getSavings, getExpenses,
    getAllDataActiveRealTimeController,
    updateDataController, updateBills, updateExpenses_extension, expensesTrackerUpdate,
} from '../firebase/controller'
import { getMonthNamesSingleDigit } from "../firebase/utils";
import { convertToDate, convertToTimeStamp, getLastDayOfTheMonth } from '../firebase/utils';

const ModalForms = ({ paramMonth, isModalOpen, setIsModalOpen, formType, selectedWallet, isUpdate, setIsUpdate, updateData, setUpdateData }) => {
    const [updateId, setUpdateId] = useState('');
    const [formCategory, setFormCategory] = useState('');
    const [formCategoryText, setFormCategoryText] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formDueDate, setFormDueDate] = useState(getLastDayOfTheMonth(paramMonth));
    const [formPrice, setFormPrice] = useState('');
    const [formDiscount, setFormDiscount] = useState('');
    const [formExpected, setFormExpected] = useState('');
    const [formAmount, setFormAmount] = useState('');
    const [formWallet, setFormWallet] = useState('');
    const [formMonthlyBudget, setFormMonthlyBudget] = useState('');
    const [formStatus, setFormStatus] = useState('');
    const [changeDate, setChangeDate] = useState('');
    const [changeDateIsChecked, setChangeDateIsChecked] = useState(false);


    // console.log('Update Data ', isUpdate)
    // console.log('FOrm TYpe ', formType)
    const [loading, setLoading] = useState(false);
    // const [updateStatus, setUpdateStatus] = useState(false);
    const [isWalletsFetching, setIsWalletsFetching] = useState(true);

    const [isCategotyFetching, setIsCategoryFetching] = useState(true);
    const [categoryData, setCategoryData] = useState([]);

    const [walletsData, setWalletsData] = useState([]);

    // Fetch All Active Wallets
    useEffect(() => {
        if (formType !== 'expenses' && formType !== 'savings' && formType !== 'savingsSettings' && formType !== 'expensesSettings' && formType !== 'wallets') {
            const returnWalletActive = async () => {
                await getAllDataActiveRealTimeController('wallets', setWalletsData, setIsWalletsFetching);
            }
            returnWalletActive();
        }

        if (formType === 'savingsTracker') {
            const returnSavingsCategory = async () => {
                await getSavings(paramMonth, setCategoryData, setIsCategoryFetching, true);
            }
            returnSavingsCategory();
        }

        if (formType === 'expensesTracker') {
            const returnSavingsCategory = async () => {
                await getExpenses(paramMonth, setCategoryData, setIsCategoryFetching, true);
            }
            returnSavingsCategory();
        }
    }, [])
    // Modal Close - Clear Form
    useEffect(() => {
        if (isModalOpen === false) {
            clearForm();
        }

    }, [isModalOpen])

    useEffect(() => {
        if (changeDateIsChecked === true && isUpdate === false)
            setChangeDate(getLastDayOfTheMonth(paramMonth))
        if (changeDateIsChecked === false && isUpdate === false)
            setChangeDate('')
        // console.log('Change Date Is Checked ' + changeDate)
    }, [changeDateIsChecked])

    // set Update Data to Form
    useEffect(() => {
        // console.log('Update Data ', updateData)
        setUpdateId(updateData.id || '')
        setFormCategory(updateData.category || '')
        setFormCategoryText(updateData.categoryText || '')
        setFormDescription(updateData.description || '')
        setFormPrice(updateData.price || '')
        setFormDiscount(updateData.discount || '')
        setFormExpected(updateData.expected || '')
        setFormAmount(updateData.amount || '')
        setFormWallet(updateData.wallet || '')
        setFormMonthlyBudget(updateData.monthlyBudget || '')
        setFormStatus(updateData.status || '')
        setFormDueDate(updateData.dueDate || '')
        // if (updateData.date !== undefined && updateData.date !== null && updateData.date !== '') {
        // setChangeDateIsChecked(true)
        if (isUpdate === true) {
            // setChangeDateIsChecked(true)
            setChangeDate(updateData.date || '')
        }

        // }

        // console.log('Use Effect Update Data Called', formWallet)
    }, [isUpdate, updateData])
    // Set The First Wallet as Default
    useEffect(() => {
        // console.log('Selected Wallet ', selectedWallet)
        selectedWallet && setFormWallet(selectedWallet);
        if (!formWallet && walletsData && walletsData.length > 0) {
            setFormWallet(walletsData[walletsData.length - 1].id);
        }
    }, [walletsData])

    const formSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const returnAdd = async () => {

            if (formType === 'wallets')
                return addWallets({
                    name: formDescription,
                    date: paramMonth,
                })
            else if (formType === 'income')
                return income({
                    description: formDescription,
                    expected: !formExpected ? 0 : parseFloat(formExpected),
                    amount: !formAmount ? 0 : parseFloat(formAmount),
                    wallet: formWallet,
                    date: paramMonth,
                })
            else if (formType === 'savings')
                return savings({
                    category: formCategoryText,
                    description: formDescription,
                    target: parseInt(formAmount),
                    status: formStatus,
                    wallet: formWallet,
                    date: paramMonth,
                })
            else if (formType === 'savingsTracker')
                return savingsTracker({
                    category: formCategory,
                    description: formDescription,
                    amount: parseFloat(formAmount),
                    wallet: formWallet,
                    date: paramMonth,
                })
            else if (formType === 'bills')
                return bills({
                    description: formDescription,
                    dueDate: formDueDate,
                    budget: !formExpected ? 0 : parseFloat(formExpected),
                    actual: !formAmount ? 0 : parseFloat(formAmount),
                    wallet: formWallet,
                    date: paramMonth,
                })
            else if (formType === 'expenses')
                return expenses({
                    category: formCategoryText,
                    budget: !formExpected ? 0 : parseFloat(formExpected),
                    date: paramMonth,
                })
            else if (formType === 'expensesSettings')
                return expenses({
                    category: formCategoryText,
                    budget: !formExpected ? 0 : parseFloat(formExpected),
                    monthlyBudget: parseInt(formMonthlyBudget),
                    status: 'active',
                    date: paramMonth,
                })
            else if (formType === 'expensesTracker')
                return expensesTracker({
                    category: formCategory,
                    description: formDescription,
                    price: !formPrice ? 0 : parseFloat(formPrice),
                    discount: !formDiscount ? 0 : parseFloat(formDiscount),
                    wallet: formWallet,
                    date: changeDateIsChecked ? changeDate : null,
                })
            else
                return { status: 'error', message: 'No form selected.' }
            // return satus
        }
        const returnAddStatus = await returnAdd();
        // console.log('status aa kaya to 2 ', status )
        if (returnAddStatus.status === 'success') {
            // console.log(addStatus().message);
            // setLoading(false);
            // console.log(returnAddStatus.data.id);
            clearForm();
        }
        setLoading(false);
        console.log(returnAddStatus.message);
    }
    const updateFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log('Update Form Submit Called')

        const data = () => {
            if (formType === 'wallets')
                return {
                    name: formDescription,
                    status: formStatus,
                    date: paramMonth,
                }
            else if (formType === 'income')
                return {
                    description: formDescription,
                    expected: !formExpected ? 0 : parseFloat(formExpected),
                    amount: !formAmount ? 0 : parseFloat(formAmount),
                    wallet: formWallet,
                    date: paramMonth,
                }
            else if (formType === 'savings')
                return {
                    category: formCategoryText,
                    description: formDescription,
                    target: parseInt(formAmount),
                    status: formStatus,
                    wallet: formWallet,
                    date: paramMonth,
                }
            else if (formType === 'savingsTracker')
                return {
                    category: formCategory,
                    description: formDescription,
                    amount: parseFloat(formAmount),
                    wallet: formWallet,
                    date: paramMonth,
                }

            else
                return { status: 'error', message: 'No form selected.' }
        }
        if (formType == '')
            return console.log(data())

        const updateExpenses = async () => {
            if (formType === 'bills') {
                return await updateBills(updateId, {
                    description: formDescription,
                    dueDate: convertToTimeStamp(formDueDate),
                    budget: !formExpected ? 0 : parseFloat(formExpected),
                    actual: !formAmount ? 0 : parseFloat(formAmount),
                    wallet: formWallet,
                    date: paramMonth,
                });
            } else if (formType === 'expenses') {
                return await updateExpenses_extension(updateId, {
                    category: formCategoryText,
                    monthlyBudget: !formExpected ? null : parseFloat(formExpected),
                    date: paramMonth,
                });
            } else if (formType === 'expensesSettings') {
                return await updateExpenses_extension(updateId, {
                    category: formCategoryText,
                    budget: !formExpected ? null : parseFloat(formExpected),
                    monthlyBudget: !formMonthlyBudget ? null : parseInt(formMonthlyBudget),
                    status: formStatus,
                    date: paramMonth,
                });
            } else if (formType === 'expensesTracker') {
                let data = {
                    category: formCategory,
                    description: formDescription,
                    price: parseFloat(formPrice),
                    discount: parseFloat(formDiscount),
                    wallet: formWallet,
                }
                if (changeDateIsChecked)
                    data.date = changeDate;
                return await expensesTrackerUpdate(updateId, data, paramMonth);
            }
            else {
                return await updateDataController(formType, updateId, data());
            }
        }
        const updateExpensesStatus = await updateExpenses();
        console.log('Update Expenses Status Forms: ', updateExpensesStatus)
        if (updateExpensesStatus.status === 'success') {
            setIsModalOpen(false);
            clearForm();
        }
        setLoading(false);
        console.log(updateExpensesStatus.message);
    }
    // const closeModal = () => {
    //     setIsModalOpen(false);
    //     setIsModalOpen(false);
    //     clearForm();
    // }
    const clearForm = () => {
        // console.log('Clear Form Called')
        setUpdateId('')
        setFormCategoryText('')
        setFormDescription('')
        setFormPrice('')
        setFormDiscount('')
        setFormExpected('')
        setFormAmount('')
        setFormWallet('')
        setFormStatus('')

        // setChangeDate(getLastDayOfTheMonth(paramMonth))
        // console.log('Is Update ', isUpdate)
        // console.log('Change Date ', formCategory)
        if (isUpdate === true) {
            // setChangeDateIsChecked(false)
            setChangeDate('')
            setFormCategory('')
        }
        // console.log('Change Date 222 ', formCategory)
        setLoading(false)
        setIsUpdate(false);
        setUpdateData([]);
    }
    return (
        <>
            <form onSubmit={!isUpdate ? formSubmit : updateFormSubmit}>
                {
                    (formType === 'savingsTracker' || formType === 'expensesTracker') &&
                    (
                        <>
                            <div className="floating-label-wrapper">
                                <select
                                    className="input"
                                    value={formCategory}
                                    onChange={(e) => { setFormCategory(e.target.value) }}
                                    name="formCategory"
                                    id="formCategory"
                                    placeholder="Category"
                                >
                                    <option value="" disabled>
                                        Select a category
                                    </option>
                                    {isCategotyFetching ? (
                                        <option value="" disabled>Fetching Data Please Wait. . .</option>
                                    ) : (
                                        categoryData.length === 0 ?
                                            <option value="" disabled>No Data Found</option> :
                                            categoryData.map((item, index) => (
                                                <option value={item.id} key={index + 1}>{item.category}</option>
                                            )).reverse()
                                    )}
                                </select>
                                <label htmlFor="formCategory">Category</label>
                            </div>
                        </>
                    )
                }
                {
                    (formType === 'savings' || formType === 'expenses' || formType === 'expensesSettings') &&
                    (
                        <>
                            <div className='floating-label-wrapper'>
                                <input
                                    type="text"
                                    id="formCategoryText"
                                    placeholder="Category"
                                    value={formCategoryText}
                                    onChange={(e) => setFormCategoryText(e.target.value)}
                                />
                                <label htmlFor="formCategoryText">Category</label>
                            </div>
                        </>
                    )
                }
                {
                    (formType === 'wallets' || formType === 'income' || formType === 'savingsTracker' || formType === 'savings' || formType === 'bills' || formType === 'expensesTracker') &&
                    (
                        <>
                            <div className="floating-label-wrapper">
                                <input
                                    type="text"
                                    id="formDescription"
                                    placeholder="Description"
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                />
                                <label htmlFor="formDescription">{formType === 'wallets' ? 'Name' : 'Description'}</label>
                            </div>
                        </>
                    )
                }
                {
                    (formType === 'expensesTracker') &&
                    (
                        <>
                            <div className="floating-label-wrapper">
                                <input
                                    type="text"
                                    id="priceExpensesTracker"
                                    placeholder="Price"
                                    value={formPrice}
                                    onChange={(e) => setFormPrice(e.target.value)}
                                />
                                <label htmlFor="priceExpensesTracker">Price</label>
                            </div>
                            <div className="floating-label-wrapper">
                                <input
                                    type="text"
                                    id="formDiscount"
                                    placeholder="Discount"
                                    value={formDiscount}
                                    onChange={(e) => setFormDiscount(e.target.value)}
                                />
                                <label htmlFor="formDiscount">Discount</label>
                            </div>
                        </>
                    )
                }
                {
                    (formType === 'bills') &&
                    (
                        <>
                            <div className="floating-label-wrapper">
                                <input
                                    type="date"
                                    id="dueDateBills"
                                    placeholder="Due-Date"
                                    value={formDueDate}
                                    onChange={(e) => setFormDueDate(e.target.value)}
                                />
                                <label htmlFor="dueDateBills">Due-Date:</label>
                            </div>
                        </>
                    )
                }
                {
                    (formType === 'income' || formType === 'bills' || formType === 'expenses' || formType === 'expensesSettings') &&
                    (
                        <>
                            <div className="floating-label-wrapper">
                                <input
                                    type="text"
                                    id="formExpected"
                                    placeholder="Expected"
                                    value={formExpected}
                                    onChange={(e) => setFormExpected(e.target.value)}
                                />
                                <label htmlFor="formExpected">{formType === 'bills' || formType === 'expenses' || formType === 'expensesSettings' ? 'Budget' : 'Expected'}</label>
                            </div>
                        </>
                    )
                }
                {
                    (formType === 'income' || formType === 'savingsTracker' || formType === 'savings' || formType === 'bills') &&
                    (
                        <>
                            <div className="floating-label-wrapper">
                                <input
                                    type="text"
                                    id="formAmount"
                                    placeholder="Amount"
                                    value={formAmount}
                                    onChange={(e) => setFormAmount(e.target.value)}
                                />
                                <label htmlFor="formAmount">
                                    {formType === 'savings' ? 'Target Amount' :
                                        formType === 'bills' ? 'Actual' : 'Amount'
                                    }
                                </label>
                            </div>
                        </>
                    )
                }
                {
                    (formType !== 'expenses' && formType !== 'savings' && formType !== 'savingsSettings' && formType !== 'expensesSettings' && formType !== 'wallets') &&
                    (
                        <>
                            <div className="floating-label-wrapper">
                                <select
                                    id="selectWallet"
                                    placeholder="Select Wallet"
                                    className='input'
                                    value={formWallet}
                                    onChange={(e) => setFormWallet(e.target.value)}
                                >
                                    {walletsData &&
                                        walletsData.map((data) => (
                                            <option key={data.id} value={data.id}>{data.name}</option>
                                        )).reverse()
                                    }
                                </select>
                            </div>
                        </>
                    )
                }
                {
                    (formType === 'expensesSettings') &&
                    (
                        <>
                            <div className="floating-label-wrapper">
                                <input
                                    type='text'
                                    id="monthlyBudgetExpenses"
                                    placeholder="Monthly Budget"
                                    value={formMonthlyBudget}
                                    onChange={(e) => setFormMonthlyBudget(e.target.value)}
                                />
                                <label htmlFor="monthlyBudgetExpenses">{getMonthNamesSingleDigit(paramMonth)} Budget</label>
                            </div>
                        </>
                    )
                }
                {
                    (isUpdate && (formType === 'wallets' || formType === 'savings' || formType === 'expensesSettings')) &&
                    (
                        <>
                            <div className='floating-label-wrapper'>
                                <select
                                    id="formStatus"
                                    placeholder="Status"
                                    className='input'
                                    value={formStatus}
                                    onChange={(e) => setFormStatus(e.target.value)}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <label htmlFor="formStatus">Status</label>
                            </div>
                        </>

                    )

                }
                {
                    (formType === 'expensesTracker') &&
                    (
                        <>
                            <input type="checkBox" name="changeDate" id="changeDate" value={changeDateIsChecked} onChange={(e) => setChangeDateIsChecked(e.target.checked)} />
                            <label htmlFor="changeDate">Change Date</label>
                            {changeDateIsChecked && (
                                <div className="floating-label-wrapper">
                                    <input
                                        type="date"
                                        id="dateExpensesTracker"
                                        placeholder="Date"
                                        value={changeDate}
                                        onChange={(e) => setChangeDate(e.target.value)}
                                    />
                                    <label htmlFor="dateExpensesTracker">Date</label>
                                </div>
                            )}
                        </>
                    )
                }
                <div className="multi-btn">
                    <button
                        className={`btn btn-primary ${loading ? 'cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={loading}>{
                            loading ? "Loading" :
                                !isUpdate ? 'Add' : 'Update'
                        }
                    </button>
                    <button
                        className={`btn btn-cancel ${loading ? 'cursor-not-allowed' : ''}`}
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        disabled={loading}>{
                            loading ? 'Loading' :
                                !isUpdate ? 'Close' : 'Cancel'}
                    </button>
                </div>
            </form>
        </>
    )
}
export default ModalForms;