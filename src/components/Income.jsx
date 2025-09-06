import { useState, useEffect } from 'react';
import { income, getDataRealTimeController, deleteDataController, updateDataController } from '../firebase/controller';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../layouts/Modal';
import { LuPlus } from "react-icons/lu";

const Income = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect'); // Redirect to home if paramMonth is missing
        }
    }, [paramMonth, navigate]);
    const [formDescription, setFormDescription] = useState('');
    const [formExpected, setFormExpected] = useState('');
    const [formAmount, setFormAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [incomeData, setIncomeData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formDescription || !formExpected) {
            setLoading(false);
            alert('Please fill up all fields.')
            console.log('Please fill up all fields.')
            return
        }
        const addData = await income({
            description: formDescription,
            expected: !formExpected ? 0 : parseFloat(formExpected),
            amount: !formAmount ? 0 : parseFloat(formAmount),
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
        const returnIncome = async () => {
            setIsFetching(true);
            return await getDataRealTimeController('income', paramMonth, setIncomeData, setIsFetching);
        }
        returnIncome();
    }, []);
    const updateSetData = (id, arrayData) => {
        setUpdateStatus(true);
        setUpdateId(id)
        setFormDescription(arrayData.description)
        setFormExpected(arrayData.expected)
        setFormAmount(arrayData.amount)
        setIsModalOpen(true)
    }
    const updateFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formDescription === '') {
            setLoading(false);
            return console.log('Please fill up all fields.')
        }

        let data = {
            description: formDescription,
            expected: !formExpected ? 0 : parseFloat(formExpected),
            amount: !formAmount ? 0 : parseFloat(formAmount),
            date: paramMonth,
        }
        const updateExpenses = await updateDataController('income', updateId, data);

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
            <div className="card-container">
                <div className="card card-no-bg flex-1"> </div>
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
                            onClick={() => setIsModalOpen(true)}>
                            <span><LuPlus /></span>
                            <span>Add</span>
                        </button>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Expected</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            incomeData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                incomeData.map((item, index) => (
                                    <tr key={index + 1}>
                                        <td>{item.description}</td>
                                        <td>{item.expected.toFixed(2)}</td>
                                        <td>{item.amount.toFixed(2)}</td>
                                        <td>
                                            {/* <button onClick={async () => { await deleteDataController('income', item.id) }}>Delete</button> */}
                                            <button onClick={() => updateSetData(item.id,
                                                {
                                                    description: item.description,
                                                    expected: item.expected,
                                                    amount: item.amount,
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
                {/* <form onSubmit={fromSubmit}> */}
                <form onSubmit={!updateDataStatus ? fromSubmit : updateFormSubmit}>
                    <div className="floating-label-wrapper">
                        <input
                            type="text"
                            id="descIncome"
                            placeholder="Description"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                        <label htmlFor="descIncome">Description</label>
                    </div>
                    <div className="floating-label-wrapper">
                        <input
                            type="text"
                            id="expectedIncome"
                            placeholder="Expected"
                            value={formExpected}
                            onChange={(e) => setFormExpected(e.target.value)}
                        />
                        <label htmlFor="expectedIncome">Expected</label>
                    </div>
                    <div className="floating-label-wrapper">
                        <input
                            type="text"
                            id="amountIncome"
                            placeholder="Amount"
                            value={formAmount}
                            onChange={(e) => setFormAmount(e.target.value)}
                        />
                        <label htmlFor="amountIncome">Amount</label>
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
                            onClick={closeModal}
                            disabled={loading}>{
                                loading ? 'Loading' :
                                    !updateDataStatus ? 'Close' : 'Cancel'}
                        </button>
                    </div>
                </form>
            </Modal >
        </>
    )

    function clearForm() {
        setFormDescription('')
        setFormExpected('')
        setFormAmount('')
        setUpdateStatus(false)
        setUpdateId('')
        setLoading(false)
    }
}
export default Income;

