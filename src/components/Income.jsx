import React, { useState, useEffect } from 'react';
import { income, getIncome, deleteDataController } from '../firebase/controller';
import { getTodayDate } from '../firebase/utils';
import { useParams, useNavigate } from 'react-router-dom';



const Income = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/'); // Redirect to home if paramMonth is missing
        }
    }, [paramMonth, navigate]);
    const [formDescription, setFormDescription] = useState('');
    const [formExpected, setFormExpected] = useState('');
    const [formAmount, setFormAmount] = useState('');
    const [date, setDate] = useState(getTodayDate());
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [incomeData, setIncomeData] = useState([]);


    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formDescription || !formExpected || !formAmount)
            return console.log('Please fill up all fields.')
        income({
            description: formDescription,
            expected: parseFloat(formExpected),
            amount: parseFloat(formAmount),
            date: date,
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
            return await getIncome(setIncomeData, setIsFetching, paramMonth);
        }
        returnIncome();
    }, []);

    return (
        <>
            <div>
                <form onSubmit={fromSubmit}>
                    <div>
                        <label htmlFor="descIncome">description:</label>
                        <input
                            type="text"
                            id="descIncome"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="expectedIncome">Expected:</label>
                        <input
                            type='text'
                            id="expectedIncome"
                            value={formExpected}
                            onChange={(e) => setFormExpected(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="amountIncome">Amount:</label>
                        <input
                            type="text"
                            id="amountIncome"
                            value={formAmount}
                            onChange={(e) => setFormAmount(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="incomeDate">Date:</label>
                        <input
                            type="date"
                            id="incomeDate"
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
                            <th>Description</th>
                            <th>Expected</th>
                            <th>Amount</th>
                            {/* <th>Date</th> */}
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
                                        {/* <td>{item.date}</td> */}
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
        setDate(getTodayDate())
        setLoading(false)
    }
}
export default Income;

