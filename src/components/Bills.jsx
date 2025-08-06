import { useState, useEffect } from 'react';
import { addBills, getDataRealTimeController, deleteDataController } from '../firebase/controller';
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
        if (!formDescription || !formDueDate || !formBudget) {
            setLoading(false);
            alert('Please fill up all fields.')
            console.log('Please fill up all fields.')
            return
        }
        addBills({
            description: formDescription,
            dueDate: formDueDate,
            budget: !formBudget ? 0 : parseFloat(formBudget),
            actual: !formActual ? 0 : parseFloat(formActual),
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
            return await getDataRealTimeController('bills', paramMonth, setBillsData, setIsFetching);
        }
        returnBills();
    }, []);

    return (
        <>
            <div className="card-container">
                <div className="card card-no-bg flex-1"></div>
                <div className="card card-main">
                    <form
                        className="form-pannel"
                        onSubmit={fromSubmit}>
                        <div className="floating-label-wrapper">
                            <input
                                type="text"
                                id="descBills"
                                placeholder="Description"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                            />
                            <label htmlFor="descBills">description</label>
                        </div>
                        <div className="floating-label-wrapper">
                            <input
                                type="date"
                                id="dueDateBills"
                                placeholder="Due-Date"
                                value={formDueDate}
                                onChange={(e) => setFormDueDate(e.target.value)}
                            />
                            <label htmlFor="dueDateBills">Due-Date:</label>
                        </div>
                        <div className="floating-label-wrapper">
                            <input
                                type='text'
                                id="budgetBills"
                                placeholder="Budget"
                                value={formBudget}
                                onChange={(e) => setFormBudget(e.target.value)}
                            />
                            <label htmlFor="budgetBills">Budget:</label>
                        </div>
                        <div className="floating-label-wrapper">
                            <input
                                type="text"
                                id="actualBills"
                                placeholder="Actual"
                                value={formActual}
                                onChange={(e) => setFormActual(e.target.value)}
                            />
                            <label htmlFor="actualBills">Actual:</label>
                        </div>
                        <div className="multi-btn">
                            <button
                                className={`btn btn-primary ${loading ? 'cursor-not-allowed' : ''}`}
                                type="submit"
                                disabled={loading}>
                                {loading ? 'Loading' : 'Add'}
                            </button>
                            <button
                                className={`btn btn-cancel ${loading ? 'cursor-not-allowed' : ''}`}
                                type="button"
                                onClick={clearForm}
                                disabled={loading}>
                                {loading ? 'Loading' : 'Clear'}
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

