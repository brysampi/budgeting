import { useState, useEffect } from 'react';
import { getDataRealTimeController, deleteDataController } from '../firebase/controller';
import { convertToDate } from '../firebase/utils';
import { useParams, useOutletContext } from 'react-router-dom';
import { LuPlus, LuTrash2, LuSquarePen } from 'react-icons/lu';
import Modal from '../layouts/Modal';
import ModalForms from './ModalForms';

const Bills = () => {
    const selectedWallet = useOutletContext();
    const { paramMonth } = useParams();
    const [isFetching, setIsFetching] = useState(true);
    const [billsData, setBillsData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateData, setUpdateData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const returnBills = async () => {
            setIsFetching(true);
            return await getDataRealTimeController('bills', paramMonth, setBillsData, setIsFetching, selectedWallet);
        }
        returnBills();

    }, [selectedWallet]);

    const updateSetData = (arrayData) => {
        setUpdateStatus(true);
        setUpdateData(arrayData)
        setIsModalOpen(true)
    }

    return (
        <>
            <Modal title={!updateDataStatus ? 'Add Bill' : 'Update Bill'} isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalForms
                    paramMonth={paramMonth}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    formType={'bills'}
                    selectedWallet={selectedWallet}
                    isUpdate={updateDataStatus}
                    setIsUpdate={setUpdateStatus}
                    updateData={updateData}
                    setUpdateData={setUpdateData}
                />
            </Modal >
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
                            <th>Description</th>
                            <th>Due-Date</th>
                            <th>Budget</th>
                            <th>Actual</th>
                            {/* <th>Date</th> */}
                            {/* <th>Status</th> */}
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
                                        {/* <td>{item.wallet}</td> */}
                                        <td>{item.description}</td>
                                        <td>{convertToDate(item.dueDate)}</td>
                                        <td>{item.budget.toFixed(2)}</td>
                                        <td className={`${item.budget < item.actual ? 'text-[var(--theme-one-tertiary)] font-bold' : ''}`}>{!item.actual ? '' : item.actual.toFixed(2)}</td>
                                        {/* <td>{item.status}</td> */}
                                        {/* <td>{convertToDate(item.paidAt)}</td> */}
                                        <td>
                                            <div className="multi-btn-evenly">
                                                <button
                                                    className="btn btn-cancel"
                                                    onClick={async () => { await deleteDataController('bills', item.id) }}>
                                                    <LuTrash2 />
                                                </button>
                                                <button
                                                    className="btn btn-cancel"
                                                    onClick={() => updateSetData(
                                                        {
                                                            id: item.id,
                                                            description: item.description,
                                                            dueDate: convertToDate(item.dueDate),
                                                            expected: item.budget,
                                                            amount: item.actual,
                                                            paymentStatus: !item.status ? '' : item.status,
                                                            wallet: item.wallet
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
export default Bills;

