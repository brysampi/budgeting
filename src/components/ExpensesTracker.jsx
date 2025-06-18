import React, { useState, useEffect } from 'react';
import { expensesTracker, getExpensesTracker } from '../firebase/controller';

const ExpensesTracker = () => {
    const [formCategory, setFormCategory] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formAmount, setFormAmount] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [expensesTrackerData, setExpensesTrackerData] = useState([]);

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formDescription || !formCategory || !formAmount)
            return console.log('Please fill up all fields.')
        expensesTracker({
            category: formCategory,
            description: formDescription,
            amount: parseInt(formAmount),
            date: date,
        }).then((response) => {
            // console.log(response)
            if (response && response.status == 'success') {
                console.log('Expenses Tracker Added.')
            } else {
                console.log('Failed to Add Expenses Tracker.')
            }
        }).catch((error) => { console.log(error) }).finally(() => {
            clearForm()
            setLoading(false)
        })
    }
    useEffect(() => {
        const a = async () => {
            setIsFetching(true);
            return await getExpensesTracker(setExpensesTrackerData, setIsFetching);
        }

        return () => a();
    }, []);

    return (
        <>
            <div>
                <form onSubmit={fromSubmit}>
                    <div>
                        <label htmlFor="expensesTrackerCategory">Category:</label>
                        <input
                            type='text'
                            id="expensesTrackerCategory"
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="expensesTrackerDescription">Description:</label>
                        <input
                            type="text"
                            id="expensesTrackerDescription"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="expensesTrackerAmount">Amount:</label>
                        <input
                            type="text"
                            id="expensesTrackerAmount"
                            value={formAmount}
                            onChange={(e) => setFormAmount(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="expensesTrackerDate">Date:</label>
                        <input
                            type="date"
                            id="expensesTrackerDate"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
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
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            expensesTrackerData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                expensesTrackerData.map((item, index) => (
                                    <tr key={index + 1}>
                                        <td>{item.category}</td>
                                        <td>{item.description}</td>
                                        <td>{item.amount}</td>
                                        <td>{item.date}</td>
                                        <td><button>Delete</button></td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
                <div>
                    {
                        console.log("Fetching Income : ", isFetching)
                    }
                </div>
            </div>
        </>
    )

    function clearForm() {
        setFormDescription('')
        setFormCategory('')
        setFormAmount('')
        setDate('')
        setLoading(false)
    }
}
export default ExpensesTracker;

