import { useState, useEffect } from 'react';
import { expenses, getExpenses, deleteDataController } from '../firebase/controller';
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
            return await getExpenses(paramMonth, setExpensesData, setIsFetching);
        }

        returnExpenses();
    }, []);

    return (
        <>
            <div>
                <form onSubmit={fromSubmit}>
                    <div>
                        <label htmlFor="categoryExpenses">Category:</label>
                        <input
                            type="text"
                            id="categoryExpenses"
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="budgetExpenses">Budget:</label>
                        <input
                            type='text'
                            id="budgetExpenses"
                            value={formBudget}
                            onChange={(e) => setFormBudget(e.target.value)}
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
        setLoading(false)
    }
}
export default Expenses;

