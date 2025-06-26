import React, { useState, useEffect } from 'react';
import { expenses, getExpenses, deleteDataController } from '../firebase/controller';
import { getTodayDate } from '../firebase/utils';
import { useParams, useNavigate } from 'react-router-dom';



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
    // const [formActual, setFormActual] = useState('');
    const [date, setDate] = useState(getTodayDate());
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [expensesData, setExpensesData] = useState([]);

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formCategory || !formBudget)
            return console.log('Please fill up all fields.')
        expenses({
            category: formCategory,
            budget: parseInt(formBudget),
            // actual: parseInt(formActual),
            date: date,
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
            return await getExpenses(setExpensesData, setIsFetching,paramMonth);
        }

        returnExpenses();
    }, []);

    return (
        <>
            <div>
                <form onSubmit={fromSubmit}>
                    <div>
                        <label htmlFor="expensesCategory">Category:</label>
                        <input
                            type="text"
                            id="expensesCategory"
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="expensesBudget">Budget:</label>
                        <input
                            type='text'
                            id="expensesBudget"
                            value={formBudget}
                            onChange={(e) => setFormBudget(e.target.value)}
                        />
                    </div>
                    {/* <div>
                        <label htmlFor="expensesActual">Actual:</label>
                        <input
                            type="text"
                            id="expensesActual"
                            value={formActual}
                            onChange={(e) => setFormActual(e.target.value)}
                        />
                    </div> */}
                    <div>
                        <label htmlFor="expensesDate">Date:</label>
                        <input
                            type="date"
                            id="expensesDate"
                            defaultValue={date}
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
                                        <td>{item.budget.toFixed(2)}</td>
                                        <td>{!item.actual ? 0.00 : item.actual.toFixed(2)}</td>
                                        <td>{!item.actual ? item.budget.toFixed(2) : (item.budget - item.actual).toFixed(2)}</td>
                                        {/* <td>{item.date}</td> */}
                                        <td><button onClick={async () => { await deleteDataController('expenses', item.id) }}>Delete</button></td>
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
        setFormActual('')
        setDate(getTodayDate())
        setLoading(false)
    }
}
export default Expenses;

