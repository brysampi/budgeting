import React, { useState, useEffect } from 'react';
import { getSavingsTracker, deleteDataController } from '../../library/firebase/controller';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { LuPlus, LuClipboardList, LuTrash2, LuSquarePen } from "react-icons/lu";
import Modal from '../../components/modal/Modal';
import ModalForms from './ModalForms';

const SavingsTracker = () => {
    const selectedWallet = useOutletContext();
    const { paramMonth } = useParams();
    const [isFetching, setIsFetching] = useState(true);
    const [savingsTrackerData, setSavingsTrackerData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateData, setUpdateData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const returnSavings = async () => {
            setIsFetching(true);
            await getSavingsTracker(paramMonth, setSavingsTrackerData, setIsFetching, selectedWallet);
        }
        returnSavings();
    }, [selectedWallet]);

    const updateSetData = (arrayData) => {
        setUpdateStatus(true);
        setUpdateData(arrayData)
        setIsModalOpen(true)
    }

    return (
        <>
            <Modal title={!updateDataStatus ? 'Add Savings' : 'Update Savings'} isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalForms
                    paramMonth={paramMonth}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    formType={'savingsTracker'}
                    selectedWallet={selectedWallet}
                    isUpdate={updateDataStatus}
                    setIsUpdate={setUpdateStatus}
                    updateData={updateData}
                    setUpdateData={setUpdateData}
                />
            </Modal >
            <div className="card-v1 card-main-v1">
                <div className='table-header-v1'>
                    <div>
                        {/* Table Title Here */}
                    </div>
                    <div className='multi-btn-v1'>
                        <button
                            className='btn-v1 btn-primary-v1'
                            onClick={() => setIsModalOpen(true)}>
                            <span><LuPlus /></span>
                            <span>Add</span>
                        </button>
                        <Link to={`/v1/savings/${paramMonth}`}>
                            <button
                                className='btn-v1 btn-primary-v1'>
                                <span><LuClipboardList /></span>
                                <span>Add Catergory</span>
                            </button>
                        </Link>
                    </div>
                </div>
                <table className="table-v1">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Action</th >
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            savingsTrackerData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                Object.entries(savingsTrackerData).map(([key, value]) => {
                                    let total = 0;
                                    return (
                                        <React.Fragment key={key}>
                                            {/* <tr><td colSpan={6} style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                backgroundColor: 'lightgray',
                                            }}> Day: {key}</td></tr> */}
                                            {
                                                value.map((item, index) => {
                                                    total += item.amount;
                                                    return (
                                                        <tr key={index}>
                                                            <td>{item.categoryName}</td>
                                                            <td>{item.description}</td>
                                                            <td>{item.amount.toFixed(2)}</td>
                                                            <td>
                                                                <div className="multi-btn-evenly-v1">
                                                                    <button
                                                                        className='btn-v1 btn-cancel-v1'
                                                                        onClick={async () => {
                                                                            await deleteDataController('savingsTracker', item.id)
                                                                        }}><LuTrash2 /></button>

                                                                    <button
                                                                        className='btn-v1 btn-cancel-v1'
                                                                        onClick={() => updateSetData(
                                                                            {
                                                                                id: item.id,
                                                                                category: item.category,
                                                                                description: item.description,
                                                                                amount: item.amount,
                                                                                wallet: item.wallet,
                                                                            }
                                                                        )
                                                                        }><LuSquarePen /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                ).reverse()
                                            }
                                        </React.Fragment >
                                    )
                                }
                                ).reverse()
                        )}
                    </tbody>
                </table>
            </div >
        </>
    )
}
export default SavingsTracker;

