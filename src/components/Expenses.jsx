import { useState, useEffect } from 'react';
import { expenses, getExpenses, deleteDataController, updateExpenses_extension } from '../firebase/controller';
import { useParams, useNavigate,Link } from 'react-router-dom';
import Modal from '../layouts/Modal';
import { LuPlus,LuArrowLeft  } from "react-icons/lu";

const Expenses = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect'); // Redirect to home if paramMonth is missing
        }
    }, [paramMonth, navigate]);
    const [formCategory, setFormCategory] = useState('');
    const [formBudget, setFormBudget] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [expensesData, setExpensesData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formCategory) {
            setLoading(false);
            return console.log('Please fill up Category.')
        }

        const addData = await expenses({
            category: formCategory,
            budget: parseInt(formBudget),
            date: paramMonth,
        })

        if (addData.status === 'success') {
            console.log(addData.message);
            setLoading(false);
            clearForm();
        } else
            setLoading(false);
        console.log(addData.message);
    }
    useEffect(() => {
        const returnExpenses = async () => {
            setIsFetching(true);
            return await getExpenses(paramMonth, setExpensesData, setIsFetching);
        }

        returnExpenses();
    }, []);

    const updateSetData = (id, arrayData) => {
        setUpdateStatus(true);
        setUpdateId(id)
        setFormCategory(arrayData.category)
        setFormBudget(arrayData.budget)
        setIsModalOpen(true)
    }
    const updateFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formCategory === '') {
            setLoading(false);
            return console.log('Please fill up all fields.')
        }

        let data = {
            category: formCategory,
            monthlyBudget: !formBudget ? null : parseFloat(formBudget),
            date: paramMonth,
        }
        const updateExpenses = await updateExpenses_extension(updateId, data);

        if (updateExpenses.status === 'success') {
            setLoading(false);
            clearForm();
            setUpdateStatus(false);
        } else
            setLoading(false);
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
                        <Link to={`/expensesTracker/${paramMonth}`}>
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
                            <th>Budget</th>
                            <th>Actual</th>
                            <th>Remaining</th>
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
                                        <td>{
                                            !item.monthlyBudget || item.monthlyBudget <= 0 ?
                                                item.budget.toFixed(2) :
                                                item.monthlyBudget.toFixed(2)
                                        }</td>
                                        <td>{!item.actual ? 0.00 : item.actual.toFixed(2)}</td>
                                        <td>{
                                            !item.monthlyBudget || item.monthlyBudget <= 0 ?
                                                !item.actual ? item.budget.toFixed(2) : (item.budget - item.actual).toFixed(2) :
                                                !item.actual ? item.monthlyBudget.toFixed(2) : (item.monthlyBudget - item.actual).toFixed(2)
                                        }</td>
                                        {/* <td>{item.date}</td> */}
                                        <td>
                                            {/* <button onClick={async () => { await deleteDataController('expenses', item.id) }}>Delete</button> */}
                                            <button onClick={() => updateSetData(item.id,
                                                {
                                                    // id: item.id,
                                                    category: item.category,
                                                    budget: !item.monthlyBudget ? item.budget : item.monthlyBudget,
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
        setUpdateStatus(false)
        setUpdateId('')
        setLoading(false)
    }
}
export default Expenses;

