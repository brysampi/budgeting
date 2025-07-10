import React, { useState, useEffect } from 'react';
import { savingsTracker, getSavingsTracker, getSavings, allUpdate, checkStaticData } from '../firebase/controller';
import { useParams, useNavigate } from 'react-router-dom';



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
    const updateSetData = (id, arrayData) => {
        setUpdateStatus(true);
        // console.log(arrayData.category)
        setUpdateId(id)
        setFormCategory(arrayData.category)
        setFormDescription(arrayData.description)
        setFormAmount(arrayData.amount)
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
    return (
        <>
            <button onClick={() => checkStaticData(paramMonth)}>Check Data</button>
            <div>
                <form onSubmit={!updateDataStatus ? fromSubmit : updateFormSubmit}>
                    <div>
                        <label htmlFor="categorySavingsTracker">Category:</label>
                        <select
                            value={formCategory}
                            onChange={(e) => { setFormCategory(e.target.value) }}
                            name="categorySavingsTracker"
                            id="categorySavingsTracker"
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
                    </div>
                    <div>
                        <label htmlFor="descriptionSavingsTracker">Description:</label>
                        <input
                            type="text"
                            id="descriptionSavingsTracker"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="amountSavingsTracker">Amount:</label>
                        <input
                            type="text"
                            id="amountSavingsTracker"
                            value={formAmount}
                            onChange={(e) => setFormAmount(e.target.value)}
                        />
                    </div>
                    <button disabled={loading}>{
                        loading ? 'Loading' :
                            !updateDataStatus ? 'Add' : 'Update'
                    }</button>
                </form>
                <button disabled={loading} onClick={clearForm}>{
                    loading ? 'Loading' :
                        !updateDataStatus ? 'Clear Form' : 'Cancel Update'
                }</button>
            </div >
            <div>
                <table>
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
                                                                    id: item.id,
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

