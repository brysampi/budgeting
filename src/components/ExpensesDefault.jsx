import { useState, useEffect } from 'react';
import { expensesDefault, getAllDataRealTimeController, deleteDataController } from '../firebase/controller';
import { useParams, useNavigate } from 'react-router-dom';

const ExpensesDefault = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect');
        }
    }, [paramMonth, navigate]);
    const [formDescription, setFormDescription] = useState('');
    const [formBudget, setFormBudget] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [expensesDefaultData, setExpensesDefaultData] = useState([]);

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formDescription || !formBudget)
            return console.log('Please fill up all fields.')
        expensesDefault({
            description: formDescription,
            budget: parseFloat(formBudget),
            date: paramMonth,
        }).then((response) => {
            if (response && response.status == 'success')
                console.log('Expenses Default Added.')
            else
                console.log('Failed to Add Expenses Default.')

        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            clearForm()
            setLoading(false)
        })
    }
    useEffect(() => {
        const returnExpensesDefault = async () => {
            setIsFetching(true);
            return await getAllDataRealTimeController('expensesDefault', setExpensesDefaultData, setIsFetching);

        }
        returnExpensesDefault();
    }, []);

    return (
        <>
            <div>
                <form onSubmit={fromSubmit}>
                    <div>
                        <label htmlFor="descExpensesDefault">description:</label>
                        <input
                            type="text"
                            id="descExpensesDefault"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="budgetExpensesDefault">Budget:</label>
                        <input
                            type='text'
                            id="budgetExpensesDefault"
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
                            <th>Description</th>
                            <th>Budget</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            expensesDefaultData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                expensesDefaultData.map((item, index) => (
                                    <tr key={index + 1}>
                                        <td>{item.description}</td>
                                        <td>{item.budget.toFixed(2)}</td>
                                        <td><button onClick={async () => { await deleteDataController('expensesDefault', item.id) }}>Delete</button></td>
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
        setFormBudget('')
        setLoading(false)
    }
}
export default ExpensesDefault;

