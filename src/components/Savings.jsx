import { useState, useEffect } from 'react';
import { savings, getSavings, deleteDataController } from '../firebase/controller';
import { useParams, useNavigate } from 'react-router-dom';

const Savings = () => {
    const { paramMonth } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!paramMonth) {
            navigate('/monthSelect'); // Redirect to home if paramMonth is missing
        }
    }, [paramMonth, navigate]);
    const [formCategory, setFormCategory] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formTarget, setFormTarget] = useState('');
    const [formStatus, setFormStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [savingsData, setSavingsData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateId, setUpdateId] = useState('');

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formCategory || !formTarget)
            return console.log('Please fill up all fields.')
        await savings({
            category: formCategory,
            description: formDescription,
            target: parseInt(formTarget),
            status: formStatus,
            date: paramMonth,
        }).then((response) => {
            if (response && response.status == 'success') {
                console.log('Savings Added.')
            } else {
                console.log('Failed to Add Savings.')
                console.log(response)
            }
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
            return await getSavings(paramMonth, setSavingsData, setIsFetching);
        }

        returnSavings();
    }, []);

    return (
        <>
            <div>
                <form onSubmit={fromSubmit}>
                    <div>
                        <label htmlFor="categorySavings">Category:</label>
                        <input
                            type="text"
                            id="categorySavings"
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="descSavings">description:</label>
                        <textarea
                            type="text"
                            id="descSavings"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="targetSavings">Target Amount:</label>
                        <input
                            type='text'
                            id="targetSavings"
                            value={formTarget}
                            onChange={(e) => setFormTarget(e.target.value)}
                        />
                    </div>
                    {
                        updateDataStatus &&
                        <div>
                            <label htmlFor="statusSavings">Status</label>
                            <select
                                id="statusSavings"
                                value={formStatus}
                                onChange={(e) => setFormStatus(e.target.value)}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                    }

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
                            <th>Target</th>
                            <th>Total</th>
                            <th>Remaining</th>
                            {/* <th>Date</th> */}
                            <th>Status</th>
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
                                        <td>{item.category}</td>
                                        <td>{item.target.toFixed(2)}</td>
                                        <td>{!item.actual ? 0.00 : item.actual.toFixed(2)}</td>
                                        <td>{!item.actual ? item.target.toFixed(2) : (item.target - item.actual).toFixed(2)}</td>
                                        <td>{item.status}</td>
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
        setFormCategory('')
        setFormDescription('')
        setFormTarget('')
        // setFormActual('')
        setLoading(false)
    }
}
export default Savings;

