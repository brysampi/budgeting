import React, { useState, useEffect } from 'react';
import { savingsTracker, getSavingsTracker, getSavings, allUpdate, checkStaticData } from '../firebase/controller';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Modal from '../layouts/Modal';
import { LuPlus, LuClipboardList } from "react-icons/lu";


const SavingsTracker = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect'); // Redirect to home if paramMonth is missing
        }
    }, [paramMonth, navigate]);
    const [formCategory, setFormCategory] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formAmount, setFormAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isFetchingTracker, setIsFetchingTracker] = useState(true);
    const [savingsTrackerData, setSavingsTrackerData] = useState([]);
    const [savingsData, setSavingsData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formDescription || !formCategory || !formAmount)
            return console.log('Please fill up all fields.')
        savingsTracker({
            category: formCategory,
            description: formDescription,
            amount: parseFloat(formAmount),
            date: paramMonth,
        }).then((response) => {
            if (response && response.status == 'success')
                console.log('Savings Tracker Added.')
            else
                console.log('Failed to Add Savings Tracker.')

        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            clearForm()
            setLoading(false)
        })
    }
    useEffect(() => {
        const returnSavings = async () => {
            setIsFetching(true);
            await getSavings(paramMonth, setSavingsData, setIsFetching, true);
            // setFormCategory();
            await getSavingsTracker(paramMonth, setSavingsTrackerData, setIsFetchingTracker);
            clearForm();
        }
        returnSavings();
    }, []);
    const updateSetData = (id, arrayData) => {
        setUpdateStatus(true);
        // console.log(arrayData.category)
        setUpdateId(id)
        setFormCategory(arrayData.category)
        setFormDescription(arrayData.description)
        setFormAmount(arrayData.amount)
        setIsModalOpen(true)
    }
    const updateFormSubmit = async (e) => {
        e.preventDefault();
        // setLoading(true);
        let data = {
            category: formCategory,
            description: formDescription,
            amount: parseFloat(formAmount),
            date: paramMonth,
        }
        const test = await allUpdate('savingsTracker', updateId, data);
        // Object.entries(test).forEach(([key, value]) => {
        //     console.log(key, value)
        // })
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
                        <select
                            className="input"
                            value={formCategory}
                            onChange={(e) => { setFormCategory(e.target.value) }}
                            name="categorySavingsTracker"
                            id="categorySavingsTracker"
                            placeholder="Category"
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {isFetching ? (
                                <option value="" disabled>Fetching Data Please Wait. . .</option>
                            ) : (
                                savingsData.length === 0 ?
                                    <option value="" disabled>No Data Found</option> :
                                    savingsData.map((item, index) => (
                                        <option value={item.id} key={index + 1}>{item.category}</option>
                                    )).reverse()
                            )}
                        </select>
                        <label htmlFor="categorySavingsTracker">Category</label>
                    </div>
                    <div className="floating-label-wrapper">
                        <input
                            type="text"
                            id="descriptionSavingsTracker"
                            placeholder="Description"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                        <label htmlFor="descriptionSavingsTracker">Description</label>
                    </div>
                    <div className="floating-label-wrapper">
                        <input
                            type="text"
                            id="amountSavingsTracker"
                            placeholder="Amount"
                            value={formAmount}
                            onChange={(e) => setFormAmount(e.target.value)}
                        />
                        <label htmlFor="amountSavingsTracker">Amount:</label>
                    </div>
                    <div className="multi-btn">
                        <button
                            className={`btn btn-primary ${loading ? 'cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={loading}>{
                                loading ? 'Loading' :
                                    !updateDataStatus ? 'Add' : 'Update'
                            }
                        </button>
                        <button
                            className={`btn btn-cancel ${loading ? 'cursor-not-allowed' : ''}`}
                            type="button"
                            disabled={loading}
                            onClick={clearForm}>{
                                loading ? 'Loading' :
                                    !updateDataStatus ? 'Close' : 'Cancel'
                            }
                        </button>
                    </div>

                </form>
            </Modal >
            <div className="card-container">
                {/* <button onClick={() => checkStaticData(paramMonth)}>Check Data</button> */}
                <div className="card card-no-bg flex-1"></div>
                <div className="card card-main">

                </div >
            </div>

            <div className="card card-main">
                <div className='table-header'>
                    <div>
                        {/* Table Title Here */}
                    </div>
                    <div className='multi-btn'>
                        <button
                            className='btn btn-primary'
                            onClick={() => setIsModalOpen(true)}>
                            <span><LuPlus /></span>
                            <span>Add</span>
                        </button>
                        <Link to={`/expensesSettings/${paramMonth}`}>
                            <button
                                className='btn btn-primary'>
                                <span><LuClipboardList /></span>
                                <span>Add Catergory</span>
                            </button>
                        </Link>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Action</th >
                        </tr>
                    </thead>
                    <tbody>
                        {isFetchingTracker ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            savingsTrackerData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                Object.entries(savingsTrackerData).map(([key, value]) => {
                                    let total = 0;
                                    return (
                                        <React.Fragment key={key}>
                                            {/* <tr><td colSpan={6} style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                backgroundColor: 'lightgray',
                                            }}> Day: {key}</td></tr> */}
                                            {
                                                value.map((item, index) => {
                                                    // console.log(item)
                                                    total += item.amount;
                                                    return (
                                                        <tr key={index}>
                                                            <td>{item.categoryName}</td>
                                                            <td>{item.description}</td>
                                                            <td>{item.amount.toFixed(2)}</td>
                                                            {/* <td>
                                                                <button onClick={async () => {
                                                                    await deleteDataController('savingsTracker', item.id)
                                                                }}>Delete</button>
                                                            </td> */}
                                                            <td><button onClick={() => updateSetData(item.id,
                                                                {
                                                                    // id: item.id,
                                                                    category: item.category,
                                                                    description: item.description,
                                                                    amount: item.amount,
                                                                }
                                                            )
                                                            }>Update</button></td>
                                                        </tr>
                                                    )
                                                }
                                                ).reverse()
                                            }
                                            {/* <tr><td colSpan={6} style={{
                                                textAlign: 'right',
                                                fontWeight: 'bold',
                                                backgroundColor: 'yellow',
                                            }}>Total: {total.toFixed(2)}</td></tr> */}
                                        </React.Fragment >
                                    )
                                }
                                ).reverse()
                        )}
                    </tbody>
                </table>
            </div >
        </>
    )

    function clearForm() {
        setFormDescription('')
        setFormCategory('')
        setFormAmount('')
        setUpdateStatus(false)
        setUpdateId('')
        setLoading(false)
    }
}
export default SavingsTracker;

