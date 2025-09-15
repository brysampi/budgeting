import { useState, useEffect } from 'react';
import { addBills, getDataRealTimeController, deleteDataController, updateBills } from '../firebase/controller';
import { convertToDate, convertToTimeStamp, getLastDayOfTheMonth } from '../firebase/utils';
import { useParams, useNavigate,useOutletContext } from 'react-router-dom';
import Modal from '../layouts/Modal';
import { LuPlus } from "react-icons/lu";

const Bills = () => {
    const { wallets, walletsData } = useOutletContext();
    const { paramMonth } = useParams();
    const [formDescription, setFormDescription] = useState('');
    const [formDueDate, setFormDueDate] = useState(getLastDayOfTheMonth(paramMonth)); // Default to today's date
    const [formBudget, setFormBudget] = useState('');
    const [formActual, setFormActual] = useState('');
    const [formWallet, setFormWallet] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [billsData, setBillsData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formDescription || !formDueDate || !formBudget) {
            setLoading(false);
            alert('Please fill up all fields.')
            console.log('Please fill up all fields.')
            return
        }
        const addReturn = await addBills({
            description: formDescription,
            dueDate: formDueDate,
            budget: !formBudget ? 0 : parseFloat(formBudget),
            actual: !formActual ? 0 : parseFloat(formActual),
            wallet: formWallet,
            date: paramMonth,
        })
        if (addReturn.status === 'success') {
            console.log(addReturn.message);
            setLoading(false);
            clearForm();
        } else
            setLoading(false);
        console.log(addReturn.message);
    }
    useEffect(() => {
        const returnBills = async () => {
            setIsFetching(true);
            return await getDataRealTimeController('bills', paramMonth, setBillsData, setIsFetching,wallets);
        }
        returnBills();
        setFormWallet(wallets)
    }, [wallets]);
    useEffect(() => {
        if (!formWallet && walletsData && walletsData.length > 0) {
            setFormWallet(walletsData[walletsData.length - 1].id);
        }
    }, [walletsData, formWallet]);
    const updateSetData = (id, arrayData) => {
        setUpdateStatus(true);
        setUpdateId(id)
        setFormDescription(arrayData.description)
        setFormDueDate(convertToDate(arrayData.dueDate))
        setFormBudget(arrayData.budget)
        setFormActual(arrayData.actual)
        setPaymentStatus(arrayData.paymentStatus)
        setIsModalOpen(true)
        setFormWallet(arrayData.wallet)
    }
    const updateFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formDescription || !formDueDate || !formBudget) {
            setLoading(false);
            alert('Please fill up all fields.')
            console.log('Please fill up all fields.')
            return
        }

        const updateReturn = await updateBills(updateId, {
            description: formDescription,
            dueDate: convertToTimeStamp(formDueDate),
            budget: !formBudget ? 0 : parseFloat(formBudget),
            actual: !formActual ? 0 : parseFloat(formActual),
            date: paramMonth,
            paymentStatus: paymentStatus,
            wallet: formWallet,
        });

        if (updateReturn.status === 'success') {
            console.log(updateReturn.message);
            setLoading(false);
            clearForm();
            setUpdateStatus(false);
        } else {
            setLoading(false);
            console.log(updateReturn.message);
        }
    }
    const openModal = () => {
        setFormDueDate(getLastDayOfTheMonth(paramMonth))
        setIsModalOpen(true)
    }
    const closeModal = () => {
        clearForm();
        setIsModalOpen(false)
    }
    return (
        <>
            <div className="card-container">
                <div className="card card-no-bg flex-1"></div>
                <div className="card card-main">

                </div>
            </div>

            <div className="card card-main">
                <div className='table-header'>
                    <div>
                        {/* Table Title Here */}
                    </div>
                    <div>
                        <button
                            className='btn btn-primary'
                            onClick={openModal}>
                            <span><LuPlus /></span>
                            <span>Add</span>
                        </button>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            {/* <th>#</th> */}
                            <th>Description</th>
                            <th>Due-Date</th>
                            <th>Budget</th>
                            <th>Actual</th>
                            {/* <th>Date</th> */}
                            {/* <th>Status</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            billsData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                billsData.map((item, index) => (
                                    <tr key={index + 1}>
                                        {/* <td>{item.wallet}</td> */}
                                        <td>{item.description}</td>
                                        <td>{convertToDate(item.dueDate)}</td>
                                        <td>{item.budget.toFixed(2)}</td>
                                        <td className={`${item.budget < item.actual ? 'text-[var(--theme-one-tertiary)] font-bold' : ''}`}>{item.actual.toFixed(2)}</td>
                                        {/* <td>{item.status}</td> */}
                                        {/* <td>{convertToDate(item.paidAt)}</td> */}
                                        <td>
                                            {/* <button onClick={async () => { await deleteDataController('bills', item.id) }}>Delete</button> */}
                                            <button onClick={() => updateSetData(item.id,
                                                {
                                                    description: item.description,
                                                    dueDate: convertToDate(item.dueDate),
                                                    budget: item.budget,
                                                    actual: item.actual,
                                                    paymentStatus: !item.status ? '' : item.status,
                                                    wallet: item.wallet
                                                }
                                            )
                                            }>Update</button>
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
            <Modal title={!updateDataStatus ? 'Add Income' : 'Update Income'} isOpen={isModalOpen} onClose={closeModal}>
                <form onSubmit={!updateDataStatus ? fromSubmit : updateFormSubmit}>
                    <div className="floating-label-wrapper">
                        <input
                            type="text"
                            id="descBills"
                            placeholder="Description"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                        <label htmlFor="descBills">description</label>
                    </div>
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
                    <div className="floating-label-wrapper">
                        <input
                            type='text'
                            id="budgetBills"
                            placeholder="Budget"
                            value={formBudget}
                            onChange={(e) => setFormBudget(e.target.value)}
                        />
                        <label htmlFor="budgetBills">Budget:</label>
                    </div>
                    <div className="floating-label-wrapper">
                        <input
                            type="text"
                            id="actualBills"
                            placeholder="Actual"
                            value={formActual}
                            onChange={(e) => setFormActual(e.target.value)}
                        />
                        <label htmlFor="actualBills">Actual:</label>
                    </div>
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
                    <div className="multi-btn">
                        <button
                            className={`btn btn-primary ${loading ? 'cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={loading}>{
                                loading ? "Loading" :
                                    !updateDataStatus ? 'Add' : 'Update'
                            }
                        </button>
                        <button
                            className={`btn btn-cancel ${loading ? 'cursor-not-allowed' : ''}`}
                            type="button"
                            onClick={clearForm}
                            disabled={loading}>{
                                loading ? 'Loading' :
                                    !updateDataStatus ? 'Clear' : 'Cancel'}
                        </button>
                    </div>
                </form>
            </Modal >
        </>
    )

    function clearForm() {
        setFormDescription('')
        setFormDueDate(getLastDayOfTheMonth(paramMonth))
        setFormBudget('')
        setFormActual('')
        setLoading(false)
        setUpdateStatus(false)
        setUpdateId('')
        setPaymentStatus('')
    }
}
export default Bills;

