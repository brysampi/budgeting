import { useState, useEffect } from 'react';
import { bills, getBills, deleteDataController } from '../firebase/controller';
import { convertToDate } from '../firebase/utils';
import { useParams, useNavigate } from 'react-router-dom';

const Bills = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect');
        }
    }, [paramMonth, navigate]);
    const [formDescription, setFormDescription] = useState('');
    const [formDueDate, setFormDueDate] = useState('');
    const [formBudget, setFormBudget] = useState('');
    const [formActual, setFormActual] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [billsData, setBillsData] = useState([]);

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formDescription || !formDueDate || !formBudget || !formActual)
            return console.log('Please fill up all fields.')
        bills({
            description: formDescription,
            dueDate: formDueDate,
            budget: parseFloat(formBudget),
            actual: parseFloat(formActual),
            date: paramMonth,
        }).then((response) => {
            if (response && response.status == 'success')
                console.log('Bill Added.')
            else
                console.log('Failed to Add Bill.')

        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            clearForm()
            setLoading(false)
        })
    }
    useEffect(() => {
        const returnBills = async () => {
            setIsFetching(true);
            return await getBills(setBillsData, setIsFetching, paramMonth);
        }
        returnBills();
    }, []);

    return (
        <>
            <div>
                <form onSubmit={fromSubmit}>
                    <div>
                        <label htmlFor="descBills">description:</label>
                        <input
                            type="text"
                            id="descBills"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="dueDateBills">Due-Date:</label>
                        <input
                            type="date"
                            id="dueDateBills"
                            value={formDueDate}
                            onChange={(e) => setFormDueDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="budgetBills">Budget:</label>
                        <input
                            type='text'
                            id="budgetBills"
                            value={formBudget}
                            onChange={(e) => setFormBudget(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="actualBills">Actual:</label>
                        <input
                            type="text"
                            id="actualBills"
                            value={formActual}
                            onChange={(e) => setFormActual(e.target.value)}
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
                            <th>Description</th>
                            <th>Due-Date</th>
                            <th>Budget</th>
                            <th>Actual</th>
                            {/* <th>Date</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            billsData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                billsData.map((item, index) => (
                                    <tr key={index + 1}>
                                        <td>{item.description}</td>
                                        <td>{convertToDate(item.dueDate)}</td>
                                        <td>{item.budget.toFixed(2)}</td>
                                        <td>{item.actual.toFixed(2)}</td>
                                        {/* <td>{item.date}</td> */}
                                        <td><button onClick={async () => { await deleteDataController('bills', item.id) }}>Delete</button></td>
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
        setFormDueDate('')
        setFormBudget('')
        setFormActual('')
        setLoading(false)
    }
}
export default Bills;

