import { useState, useEffect } from 'react';
import { expensesTracker, getExpensesTracker, getExpenses, deleteDataController } from '../firebase/controller';
import { useParams, useNavigate } from 'react-router-dom';



const ExpensesTracker = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect'); // Redirect to home if paramMonth is missing
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

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formDescription || !formCategory || !formPrice || !formDate)
            return console.log('Please fill up all fields.')
        expensesTracker({
            category: formCategory,
            description: formDescription,
            price: parseFloat(formPrice),
            discount: parseFloat(formDiscount),
            date: paramMonth,
        }).then((response) => {
            if (response && response.status == 'success')
                console.log('Expenses Tracker Added.')
            else
                console.log('Failed to Add Expenses Tracker.')

        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            clearForm()
            setLoading(false)
        })
    }
    useEffect(() => {
        let unsubscribe;
        const returnSavings = async () => {
            setIsFetching(true);
            await getExpenses(setExpensesData, setIsFetching, paramMonth);
            // setFormCategory();
            await getExpensesTracker(setExpensesTrackerData, setIsFetchingTracker, paramMonth);
            clearForm();
        }
        returnSavings();
    }, []);

    return (
        <>
            <div>
                <form onSubmit={fromSubmit}>
                    <div>
                        <label htmlFor="categoryExpensesTracker">Category:</label>
                        <select
                            value={formCategory}
                            onChange={(e) => { setFormCategory(e.target.value) }}
                            name="categoryExpensesTracker"
                            id="categoryExpensesTracker"
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
                                    ))
                            )}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="descriptionExpensesTracker">Description:</label>
                        <input
                            type="text"
                            id="descriptionExpensesTracker"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="priceExpensesTracker">Price:</label>
                        <input
                            type="text"
                            id="priceExpensesTracker"
                            value={formPrice}
                            onChange={(e) => setFormPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="discountExpensesTracker">Discount:</label>
                        <input
                            type="text"
                            id="discountExpensesTracker"
                            value={formDiscount}
                            onChange={(e) => setFormDiscount(e.target.value)}
                        />
                    </div>
                    <button disabled={loading}>{loading ? 'Loading' : 'Submit'}</button>
                </form>
                <button onClick={clearForm}>Clear Form</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            {/* <th>#</th> */}
                            <th>Category</th>
                            <th>Description</th>
                            <th>Price</th>
                            {/* <th>Date</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetchingTracker ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            expensesTrackerData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                expensesTrackerData.map((item, index) => (
                                    <tr key={index + 1}>
                                        <td>{item.category}</td>
                                        <td>{item.description}</td>
                                        <td>{item.amount.toFixed(2)}</td>
                                        {/* <td>{item.date}</td> */}
                                        {/* <td>{convertToDate(item.date)}</td> */}
                                        <td><button onClick={async () => { await deleteDataController('expensesTracker', item.id) }}>Delete</button></td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )

    function clearForm() {
        setFormDescription('')
        setFormCategory('')
        setFormPrice('')
        setFormDiscount('')
        setLoading(false)
    }
}
export default ExpensesTracker;

