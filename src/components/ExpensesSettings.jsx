import { useState, useEffect } from 'react';
import { expenses, getExpenses, deleteDataController, getExpenses_v2, allUpdate, updateExpenses_extension } from '../firebase/controller';
import { useParams, useNavigate,Link } from 'react-router-dom';
import { getMonthNamesSingleDigit } from '../firebase/utils';
import Modal from '../layouts/Modal';
import { LuPlus,LuArrowLeft } from "react-icons/lu";

const ExpensesSettings = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect'); // Redirect to home if paramMonth is missing
        }
    }, [paramMonth, navigate]);
    const [formCategory, setFormCategory] = useState('');
    const [formBudget, setFormBudget] = useState('');
    const [formMonthlyBudget, setFormMonthlyBudget] = useState('');
    const [formStatus, setFormStatus] = useState('active');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [expensesData, setExpensesData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formCategory || !formBudget)
            return console.log('Please fill up all fields.')
        expenses({
            category: formCategory,
            budget: parseInt(formBudget),
            monthlyBudget: parseInt(formMonthlyBudget),
            status: formStatus,
            date: paramMonth,
        }).then((response) => {
            if (response && response.status == 'success') {
                console.log('Expense Added.')
            } else {
                console.log('Failed to Add Expense.')
            }
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            clearForm()
            setLoading(false)
        })
    }
    useEffect(() => {
        const returnExpenses = async () => {
            setIsFetching(true);
            return await getExpenses_v2(paramMonth, setExpensesData, setIsFetching);
        }

        returnExpenses();
    }, []);
    const updateSetData = (id, arrayData) => {
        setUpdateStatus(true);
        // console.log(arrayData.category)
        setUpdateId(id)
        setFormCategory(arrayData.category)
        setFormBudget(arrayData.budget)
        setFormMonthlyBudget(!arrayData.monthlyBudget ? '' : arrayData.monthlyBudget)
        setFormStatus(arrayData.status)
        setIsModalOpen(true)
    }
    const updateFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let data = {
            category: formCategory,
            budget: parseInt(formBudget),
            monthlyBudget: !formMonthlyBudget ? null : parseInt(formMonthlyBudget),
            status: formStatus,
            date: paramMonth,
        }
        const updateExpenses = await updateExpenses_extension(updateId, data);
        if (updateExpenses.status === 'success') {
            setLoading(false);
            clearForm();
            setUpdateStatus(false);
        } else {
            setLoading(false);
        }
        console.log(updateExpenses.message);
    }
    const closeModal = () => {
        clearForm();
        setIsModalOpen(false)
    }
    return (
        <>
            <Modal title={!updateDataStatus ? 'Add Savings' : 'Update Savings'} isOpen={isModalOpen} onClose={closeModal}>
                <form onSubmit={!updateDataStatus ? fromSubmit : updateFormSubmit}>
                    <div className="floating-label-wrapper">
                        <input
                            type="text"
                            id="categoryExpenses"
                            placeholder="Category"
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                        />
                        <label htmlFor="categoryExpenses">Category</label>
                    </div>
                    <div className="floating-label-wrapper">
                        <input
                            type='text'
                            id="budgetExpenses"
                            placeholder="Budget"
                            value={formBudget}
                            onChange={(e) => setFormBudget(e.target.value)}
                        />
                        <label htmlFor="budgetExpenses">Budget:</label>
                    </div>
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
                    {

                        updateDataStatus && (
                            <>

                                <div className='floating-label-wrapper'>
                                    <select
                                        id="statusExpensesSettings"
                                        className="input"
                                        placeholder="Status"
                                        value={formStatus}
                                        onChange={(e) => setFormStatus(e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    <label htmlFor="statusExpensesSettings">Status</label>
                                </div>
                            </>

                        )

                    }
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
            <div className="card-container">
                <div className="card card-no-bg flex-1"> </div>
                <div className="card card-main">


                </div>
            </div>
            <div className="card card-main">
                <div className='table-header'>
                    <div>
                        {/* Table Title Here */}
                        <Link to={`/expenses/${paramMonth}`}>
                            <button
                                className='btn btn-secondary'>
                                <span><LuArrowLeft  /></span>
                                <span>Back</span>
                            </button>
                        </Link>
                    </div>
                    <div>
                        <button
                            className='btn btn-primary'
                            onClick={() => setIsModalOpen(true)}>
                            <span><LuPlus /></span>
                            <span>Add</span>
                        </button>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            {/* <th>#</th> */}
                            <th>Category</th>
                            <th>Default Budget</th>
                            <th>{getMonthNamesSingleDigit(paramMonth)} Budget</th>
                            <th>Status</th>
                            {/* <th>Date</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            expensesData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                expensesData.map((item, index) => (
                                    <tr key={index + 1}>
                                        <td>{item.category}</td>
                                        <td>{item.budget}</td>
                                        <td>{!item.monthlyBudget ? '' : item.monthlyBudget}</td>
                                        <td>{item.status}</td>
                                        {/* <td>{item.date}</td> */}
                                        <td>
                                            {/* <button onClick={async () => { await deleteDataController('expenses', item.id) }}>
                                                Delete
                                            </button> */}
                                            <button onClick={() => updateSetData(item.id,
                                                {
                                                    // id: item.id,
                                                    category: item.category,
                                                    budget: item.budget,
                                                    monthlyBudget: !item.monthlyBudget ? '' : item.monthlyBudget,
                                                    status: item.status,
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
        </>
    )

    function clearForm() {
        setFormCategory('')
        setFormBudget('')
        setFormMonthlyBudget('')
        setFormStatus('active')
        setLoading(false)
        setUpdateStatus(false)
        setUpdateId('')
    }
}
export default ExpensesSettings;

