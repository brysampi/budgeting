import { useState, useEffect } from 'react';
import { income, getDataRealTimeController, deleteDataController } from '../firebase/controller';
import { useParams, useNavigate } from 'react-router-dom';

const Income = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect'); // Redirect to home if paramMonth is missing
        }
    }, [paramMonth, navigate]);
    const [formDescription, setFormDescription] = useState('');
    const [formExpected, setFormExpected] = useState('');
    const [formAmount, setFormAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [incomeData, setIncomeData] = useState([]);

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formDescription || !formExpected) {
            setLoading(false);
            alert('Please fill up all fields.')
            console.log('Please fill up all fields.')
            return
        }
        income({
            description: formDescription,
            expected: !formExpected ? 0 : parseFloat(formExpected),
            amount: !formAmount ? 0 : parseFloat(formAmount),
            date: paramMonth,
        }).then((response) => {
            if (response && response.status == 'success')
                console.log('Income Added.')
            else
                console.log('Failed to Add Income.')

        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            clearForm()
            setLoading(false)
        })
    }
    useEffect(() => {
        const returnIncome = async () => {
            setIsFetching(true);
            return await getDataRealTimeController('income', paramMonth, setIncomeData, setIsFetching);
        }
        returnIncome();
    }, []);

    return (
        <>
            <div className="card-container">
                <div className="card card-no-bg flex-1"> </div>
                <div className="card card-main">
                    <form
                        className="form-pannel"
                        onSubmit={fromSubmit}>
                        <div className="floating-label-wrapper">
                            <input
                                type="text"
                                id="descIncome"
                                placeholder="Description"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                            />
                            <label htmlFor="descIncome">Description</label>
                        </div>
                        <div className="floating-label-wrapper">
                            <input
                                type="text"
                                id="expectedIncome"
                                placeholder="Expected"
                                value={formExpected}
                                onChange={(e) => setFormExpected(e.target.value)}
                            />
                            <label htmlFor="expectedIncome">Expected</label>
                        </div>
                        <div className="floating-label-wrapper">
                            <input
                                type="text"
                                id="amountIncome"
                                placeholder="Amount"
                                value={formAmount}
                                onChange={(e) => setFormAmount(e.target.value)}
                            />
                            <label htmlFor="amountIncome">Amount</label>
                        </div>
                        <div className="multi-btn">
                            <button
                                className={`btn btn-primary ${loading ? 'cursor-not-allowed' : ''}`}
                                type="submit"
                                disabled={loading}>{loading ? "Loading" : "Add"}
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
                            <th>Description</th>
                            <th>Expected</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            incomeData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                incomeData.map((item, index) => (
                                    <tr key={index + 1}>
                                        <td>{item.description}</td>
                                        <td>{item.expected.toFixed(2)}</td>
                                        <td>{item.amount.toFixed(2)}</td>
                                        <td><button onClick={async () => { await deleteDataController('income', item.id) }}>Delete</button></td>
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
        setFormExpected('')
        setFormAmount('')
        setLoading(false)
    }
}
export default Income;

