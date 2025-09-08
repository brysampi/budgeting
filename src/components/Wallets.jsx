import React, { useState, useEffect } from 'react';
import { LuPlus } from 'react-icons/lu';
import Modal from '../layouts/Modal';
import { useParams } from 'react-router-dom';
import { addWallets, getAllDataRealTimeController,updateDataController } from '../firebase/controller';


const Wallets = () => {
    const { paramMonth } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formName, setFormName] = useState('');
    const [walletsData, setWalletsData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [formStatus, setFormStatus] = useState('active');

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const addReturn = await addWallets({
            name: formName,
            date: paramMonth,
        })

        if (addReturn.status === 'success') {
            console.log(addReturn.message);
            setLoading(false);
            clearForm();
        } else
            setLoading(false);
        console.log(addReturn.message);
    }

    useEffect(() => {
        const returnWallets = async () => {
            setIsFetching(true);
            return await getAllDataRealTimeController('wallets', setWalletsData, setIsFetching);
        }
        returnWallets();
    }, []);

    const updateFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formName === '') {
            setLoading(false);
            return console.log('Please fill up all fields.')
        }

        let data = {
            name: formName,
            status: formStatus,
            date: paramMonth,
        }
        const updateExpenses = await updateDataController('wallets', updateId, data);

        if (updateExpenses.status === 'success') {
            setLoading(false);
            clearForm();
            setUpdateStatus(false);
        } else
            setLoading(false);
        console.log(updateExpenses.message);
    }

    const updateSetData = (id, arrayData) => {
        setUpdateStatus(true);
        setUpdateId(id)
        setFormName(arrayData.name)
        setFormStatus(arrayData.status)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        clearForm();
        setIsModalOpen(false)
    }
    return (
        <>
            <div>
                <button
                    className='btn btn-primary'
                    onClick={() => setIsModalOpen(true)}>
                    <span><LuPlus /></span>
                    <span>Add</span>
                </button>
            </div>
            <Modal title='Wallet' isOpen={isModalOpen} onClose={closeModal}>
                <form onSubmit={!updateDataStatus ? fromSubmit : updateFormSubmit}>
                    <div className="floating-label-wrapper">
                        <input
                            type="text"
                            id="descBills"
                            placeholder="Description"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                        />
                        <label htmlFor="descBills">Name</label>
                    </div>
                    {
                        updateDataStatus &&
                        <div className='floating-label-wrapper'>
                            <select
                                id="statusSavings"
                                placeholder="Status"
                                className='input'
                                value={formStatus}
                                onChange={(e) => setFormStatus(e.target.value)}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <label htmlFor="statusSavings">Status</label>
                        </div>

                    }
                    <div className="multi-btn">
                        <button
                            className={`btn btn-primary ${loading ? 'cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={loading}>{
                                loading ? "Loading" :
                                    !updateDataStatus ? 'Add' : 'Update'
                            }
                        </button>
                        <button
                            className={`btn btn-cancel ${loading ? 'cursor-not-allowed' : ''}`}
                            type="button"
                            onClick={clearForm}
                            disabled={loading}>{
                                loading ? 'Loading' :
                                    !updateDataStatus ? 'Clear' : 'Cancel'}
                        </button>
                    </div>
                </form>
            </Modal>
            <div className="card-container">
                <div className="card card-no-bg flex-1"></div>
                <div className="card card-main">

                </div>
            </div>

            <div className="card card-main">
                <div className='table-header'>
                    <div>
                        {/* Table Title Here */}
                    </div>
                    <div>
                        <button
                            className='btn btn-primary'
                            onClick={() => setIsModalOpen(true)}>
                            <span><LuPlus /></span>
                            <span>Add</span>
                        </button>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            {/* <th>#</th> */}
                            <th>Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            walletsData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                walletsData.map((item, index) => (
                                    <tr key={index + 1}>
                                        <td>{item.name}</td>
                                        <td>{item.status}</td>
                                        {/* <td>{convertToDate(item.paidAt)}</td> */}
                                        <td>
                                            {/* <button onClick={async () => { await deleteDataController('bills', item.id) }}>Delete</button> */}
                                            <button onClick={() => updateSetData(item.id,
                                                {
                                                    name: item.name,
                                                    status: item.status,
                                                }
                                            )
                                            }>Update</button>
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
    function clearForm() {
        // Clear form fields here
        setFormName('');
    }
}
export default Wallets;