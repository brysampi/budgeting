import React, { useState, useEffect } from 'react';
import { expensesTracker, getExpensesTracker, getExpenses, expensesTrackerUpdate, deleteDataController, checkStaticData } from '../firebase/controller';
import { useParams, useNavigate } from 'react-router-dom';



const ExpensesTracker = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect');
        }
    }, [paramMonth, navigate]);
    const [formCategory, setFormCategory] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formDiscount, setFormDiscount] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isFetchingTracker, setIsFetchingTracker] = useState(true);
    const [expensesTrackerData, setExpensesTrackerData] = useState([]);
    const [expensesData, setExpensesData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateId, setUpdateId] = useState('');

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formDescription || !formCategory || !formPrice)
            return console.log('Please fill up all fields.')

        const addData = expensesTracker({
            category: formCategory,
            description: formDescription,
            price: parseFloat(formPrice),
            discount: parseFloat(formDiscount),
            date: paramMonth,
        })
        // if (addData.status === 'success') {
        //     console.log(addData.message);
        //     setLoading(false);
        //     clearForm();
        // } else
        //     setLoading(false);
        console.log(addData.message);
        setLoading(false);
        clearForm();
    }
    useEffect(() => {
        const returnSavings = async () => {
            setIsFetching(true);
            await getExpenses(paramMonth, setExpensesData, setIsFetching, true);
            // setFormCategory();
            await getExpensesTracker(paramMonth, setExpensesTrackerData, setIsFetchingTracker);
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
        setFormPrice(arrayData.price)
        setFormDiscount(arrayData.discount)
    }
    const updateFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let data = {
            category: formCategory,
            description: formDescription,
            price: parseFloat(formPrice),
            discount: parseFloat(formDiscount),
            date: paramMonth,
        }
        const updateResult = await expensesTrackerUpdate(updateId, data);
        if (updateResult.status === 'success') {
            setLoading(false);
            clearForm();
            setUpdateStatus(false);
        } else
            setLoading(false);
        console.log(updateResult.message);
    }
    return (
        <>
            <div className="card-container">
                <div className="card card-no-bg flex-1"></div>
                <div className="card card-main">
                    {/* <button onClick={() => checkStaticData(paramMonth)}>Check Data</button> */}
                    <form onSubmit={!updateDataStatus ? fromSubmit : updateFormSubmit}>
                        <div className="floating-label-wrapper">
                            <select
                                className="input"
                                value={formCategory}
                                onChange={(e) => { setFormCategory(e.target.value) }}
                                name="categoryExpensesTracker"
                                id="categoryExpensesTracker"
                                placeholder="Category"
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                {isFetching ? (
                                    <option value="" disabled>Fetching Data Please Wait. . .</option>
                                ) : (
                                    expensesData.length === 0 ?
                                        <option value="" disabled>No Data Found</option> :
                                        expensesData.map((item, index) => (
                                            <option value={item.id} key={index + 1}>{item.category}</option>
                                        )).reverse()
                                )}
                            </select>
                            <label htmlFor="categoryExpensesTracker">Category</label>
                        </div>
                        <div className="floating-label-wrapper">
                            <input
                                type="text"
                                id="descriptionExpensesTracker"
                                placeholder="Description"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                            />
                            <label htmlFor="descriptionExpensesTracker">Description</label>
                        </div>
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
                                id="discountExpensesTracker"
                                placeholder="Discount"
                                value={formDiscount}
                                onChange={(e) => setFormDiscount(e.target.value)}
                            />
                            <label htmlFor="discountExpensesTracker">Discount</label>
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
                                onClick={clearForm}
                                disabled={loading}>{
                                    loading ? 'Loading' :
                                        !updateDataStatus ? 'Clear' : 'Cancel'
                                }
                            </button>
                        </div>
                    </form>
                </div >
            </div>

            <div className="card card-main">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Action</th >
                        </tr>
                    </thead>
                    <tbody>
                        {isFetchingTracker ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            expensesTrackerData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                Object.entries(expensesTrackerData).map(([key, value]) => {
                                    let total = 0;
                                    return (
                                        <React.Fragment key={key}>
                                            <tr><td colSpan={6}
                                                // style={{
                                                //     textAlign: 'center',
                                                //     fontWeight: 'bold',
                                                //     backgroundColor: 'lightgray',
                                                // }}
                                                className="text-center font-bold bg-[var(--theme-one-neutral-light)]"
                                            > Day: {key}</td></tr>
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
                                                                    await deleteDataController('expensesTracker', item.id)
                                                                }}>Delete</button>
                                                            </td> */}
                                                            <td><button onClick={() => updateSetData(item.id,
                                                                {
                                                                    id: item.id,
                                                                    category: item.category,
                                                                    description: item.description,
                                                                    price: item.price,
                                                                    discount: item.discount
                                                                }
                                                            )
                                                            }>Update</button></td>
                                                        </tr>
                                                    )
                                                }
                                                ).reverse()
                                            }
                                            <tr><td colSpan={3} ></td>
                                                <td
                                                    className="font-blod align-right bg-[var(--theme-one-tertiary)]"
                                                >
                                                    Total: {total.toFixed(2)}
                                                </td>
                                            </tr>
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
        setFormPrice('')
        setFormDiscount('')
        setUpdateStatus(false)
        setUpdateId('')
        setLoading(false)
    }
}
export default ExpensesTracker;

