import React, { useState, useEffect } from 'react';
import { bills, getBills } from '../firebase/controller';

const Bills = () => {
    const [formDescription, setFormDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [formBudget, setFormBudget] = useState('');
    const [formActual, setFormActual] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [billsData, setBillsData] = useState([]);

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formDescription || !dueDate || !formBudget || !formActual)
            return console.log('Please fill up all fields.')
        bills({
            description: formDescription,
            dueDate: dueDate,
            budget: parseInt(formBudget),
            actual: parseInt(formActual),
            date: date,
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
        const a = async () => {
            setIsFetching(true);
            return await getBills(setBillsData, setIsFetching);
        }

        return () => a();
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
                        <label htmlFor="billsDueDate">Due-Date:</label>
                        <input
                            type="date"
                            id="billsDueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
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
                    <div>
                        <label htmlFor="BillsDate">Date:</label>
                        <input
                            type="date"
                            id="BillsDate"
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
                                        <td>{item.dueDate}</td>
                                        <td>{item.budget}</td>
                                        <td>{item.actual}</td>
                                        {/* <td>{item.date}</td> */}
                                        <td><button>Delete</button></td>
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
        setDueDate('')
        setFormBudget('')
        setFormActual('')
        setDate('')
        setLoading(false)
    }
}
export default Bills;

