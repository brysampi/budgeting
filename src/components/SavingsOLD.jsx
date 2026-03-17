import { useState, useEffect } from 'react';
import { savings, getSavings, deleteDataController } from '../library/firebase/controller';
import { useParams, useNavigate } from 'react-router-dom';



const Savings = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect'); // Redirect to home if paramMonth is missing
        }
    }, [paramMonth, navigate]);
    const [formDescription, setFormDescription] = useState('');
    const [formAmount, setFormAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [savingsData, setSavingsData] = useState([]);

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formDescription || !formAmount)
            return console.log('Please fill up all fields.')
        savings({
            description: formDescription,
            amount: parseFloat(formAmount),
            date: paramMonth,
        }).then((response) => {
            if (response && response.status == 'success')
                console.log('Savings Added.')
            else
                console.log('Failed to Add Savings.')

        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            clearForm()
            setLoading(false)
        })
    }
    useEffect(() => {
        const returnSavings = async () => {
            setIsFetching(true);
            return await getSavings(setSavingsData, setIsFetching, paramMonth);
        }
        returnSavings();
    }, []);

    return (
        <>
            <div>
                <form onSubmit={fromSubmit}>
                    <div>
                        <label htmlFor="descSavings">description:</label>
                        <input
                            type="text"
                            id="descSavings"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="amountSavings">Amount:</label>
                        <input
                            type="text"
                            id="amountSavings"
                            value={formAmount}
                            onChange={(e) => setFormAmount(e.target.value)}
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
                            {/* <th>Expected</th> */}
                            <th>Amount</th>
                            {/* <th>Date</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            savingsData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                savingsData.map((item, index) => (
                                    <tr key={index + 1}>
                                        <td>{item.description}</td>
                                        {/* <td>{item.expected}</td> */}
                                        <td>{item.amount.toFixed(2)}</td>
                                        {/* <td>{item.date}</td> */}
                                        <td><button onClick={async () => { await deleteDataController('savings', item.id) }}>Delete</button></td>
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
        setFormAmount('')
        setLoading(false)
    }
}
export default Savings;

