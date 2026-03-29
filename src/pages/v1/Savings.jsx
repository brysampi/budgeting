import { useState, useEffect } from 'react';
import { getSavings, deleteDataController } from '../../library/firebase/controller';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { LuPlus, LuArrowLeft, LuTrash2, LuSquarePen } from "react-icons/lu";
import Modal from '../../components/modal/Modal';
import ModalForms from './ModalForms';

const Savings = () => {
    const selectedWallet = useOutletContext();
    const { paramMonth } = useParams();
    const [isFetching, setIsFetching] = useState(true);
    const [savingsData, setSavingsData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateData, setUpdateData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const returnSavings = async () => {
            setIsFetching(true);
            return await getSavings(paramMonth, setSavingsData, setIsFetching);
        }
        returnSavings();
    }, []);

    const updateSetData = (arrayData) => {
        setUpdateStatus(true);
        setUpdateData(arrayData)
        setIsModalOpen(true)
    }
    return (
        <>
            <Modal title={!updateDataStatus ? 'Add Savings Category' : 'Update Savings Category'} isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalForms
                    paramMonth={paramMonth}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    formType={'savings'}
                    selectedWallet={selectedWallet}
                    isUpdate={updateDataStatus}
                    setIsUpdate={setUpdateStatus}
                    updateData={updateData}
                    setUpdateData={setUpdateData}
                />
            </Modal >
            <div className='card-container-v1'>
                <div className='card-v1 card-no-bg-v1 flex-1'> </div>
                <div className='card-v1 card-main-v1'>

                </div>
            </div>
            <div className="card-v1 card-main-v1">
                <div className='table-header-v1'>
                    <div>
                        {/* Table Title Here */}
                        <Link to={`/v1/savingsTracker/${paramMonth}`}>
                            <button
                                className='btn-v1 btn-cancel-v1'>
                                <span><LuArrowLeft /></span>
                                <span>Back</span>
                            </button>
                        </Link>
                    </div>
                    <div>
                        <button
                            className='btn-v1 btn-primary-v1'
                            onClick={() => setIsModalOpen(true)}>
                            <span><LuPlus /></span>
                            <span>Add</span>
                        </button>
                    </div>
                </div>
                <table className="table-v1">
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
                                        <td>
                                            <div className="multi-btn-evenly-v1">
                                                <button
                                                    className='btn-v1 btn-cancel-v1'
                                                    onClick={async () => { await deleteDataController('savings', item.id) }}>
                                                    <LuTrash2 /></button>
                                                <button
                                                    className='btn-v1 btn-cancel-v1'
                                                    onClick={() => updateSetData(
                                                        {
                                                            id: item.id,
                                                            categoryText: item.category,
                                                            description: item.description,
                                                            amount: item.target,
                                                            status: item.status,
                                                        }
                                                    )
                                                    }><LuSquarePen /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>

        </>
    )
}
export default Savings;
