import { useState, useEffect } from 'react';
import { savings, getSavings, deleteDataController,updateDataController } from '../firebase/controller';
import { useParams, useNavigate } from 'react-router-dom';

const Savings = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect'); // Redirect to home if paramMonth is missing
        }
    }, [paramMonth, navigate]);
    const [formCategory, setFormCategory] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formTarget, setFormTarget] = useState('');
    const [formStatus, setFormStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [savingsData, setSavingsData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateId, setUpdateId] = useState('');

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formCategory || !formTarget)
            return console.log('Please fill up all fields.')
        await savings({
            category: formCategory,
            description: formDescription,
            target: parseInt(formTarget),
            status: formStatus,
            date: paramMonth,
        }).then((response) => {
            if (response && response.status == 'success') {
                console.log('Savings Added.')
            } else {
                console.log('Failed to Add Savings.')
                console.log(response)
            }
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
            return await getSavings(paramMonth, setSavingsData, setIsFetching);
        }

        returnSavings();
    }, []);
    const updateSetData = (id, arrayData) => {
        setUpdateStatus(true);
        setUpdateId(id)
        setFormCategory(arrayData.category)
        setFormDescription(arrayData.description)
        setFormTarget(arrayData.target)
        setFormStatus(arrayData.status)
    }
    const updateFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formCategory === '' || formTarget === '') {
            setLoading(false);
            return console.log('Please fill up all fields.')
        }

        let data = {
            category: formCategory,
            description: formDescription,
            target: parseInt(formTarget),
            status: formStatus,
            date: paramMonth,
        }
        const updateExpenses = await updateDataController('savings', updateId, data);

        if (updateExpenses.status === 'success') {
            setLoading(false);
            clearForm();
            setUpdateStatus(false);
        } else
            setLoading(false);
        console.log(updateExpenses.message);
    }

    return (
        <>
            <div className='card-container'>
                <div className='card card-no-bg flex-1'> </div>
                <div className='card card-main'>
                    <form onSubmit={!updateDataStatus ? fromSubmit : updateFormSubmit}>
                        <div className='floating-label-wrapper'>
                            <input
                                type="text"
                                id="categorySavings"
                                placeholder="Category"
                                value={formCategory}
                                onChange={(e) => setFormCategory(e.target.value)}
                            />
                            <label htmlFor="categorySavings">Category:</label>
                        </div>
                        <div className='floating-label-wrapper'>
                            <input
                                className='input'
                                type="text"
                                id="descSavings"
                                placeholder="Description"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                            />
                            <label htmlFor="descSavings">description:</label>
                        </div>
                        <div className='floating-label-wrapper'>
                            <input
                                type='text'
                                id="targetSavings"
                                placeholder="Target Amount"
                                value={formTarget}
                                onChange={(e) => setFormTarget(e.target.value)}
                            />
                            <label htmlFor="targetSavings">Target Amount:</label>
                        </div>
                        {
                            updateDataStatus &&
                            <div className='floating-label-wrapper'>
                                <select
                                    id="statusSavings"
                                    placeholder="Status"
                                    className='input'
                                    value={formStatus}
                                    onChange={(e) => setFormStatus(e.target.value)}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <label htmlFor="statusSavings">Status</label>
                            </div>

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
                </div>
            </div>
            <div className="card card-main">
                <table className="table">
                    <thead>
                        <tr>
                            {/* <th>#</th> */}
                            <th>Category</th>
                            <th>Target</th>
                            <th>Total</th>
                            <th>Remaining</th>
                            {/* <th>Date</th> */}
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            savingsData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                savingsData.map((item, index) => (
                                    <tr key={index + 1}>
                                        <td>{item.category}</td>
                                        <td>{item.target.toFixed(2)}</td>
                                        <td>{!item.actual ? 0.00 : item.actual.toFixed(2)}</td>
                                        <td>{!item.actual ? item.target.toFixed(2) : (item.target - item.actual).toFixed(2)}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <button onClick={async () => { await deleteDataController('savings', item.id) }}>Delete</button>
                                            <button onClick={() => updateSetData(item.id,
                                                {
                                                    category: item.category,
                                                    description: item.description,
                                                    target: item.target,
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
        setFormDescription('')
        setFormTarget('')
        setFormStatus('')
        setUpdateStatus(false)
        setUpdateId('')
        setLoading(false)
    }
}
export default Savings;

