import { useState, useEffect } from 'react';
import { getDataRealTimeController, getBillsDataRealTimeController, deleteDataController } from '../../library/firebase/controller';
import { convertToDate, getMonthNamesSingleDigit } from '../../library/utils';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { LuPlus, LuTrash2, LuSquarePen, LuArrowLeft } from 'react-icons/lu';
import Modal from '../../components/modal/Modal';
import ModalForms from './ModalForms';

const BillsSettings = () => {
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
            // return await getDataRealTimeController('bills', paramMonth, setBillsData, setIsFetching, selectedWallet);
            // return await getBillsDataRealTimeController(paramMonth, setBillsData, setIsFetching, selectedWallet);
            return await getBillsDataRealTimeController(paramMonth, setBillsData, setIsFetching, selectedWallet);
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
            <Modal title={!updateDataStatus ? 'Add Bill Settings' : 'Update Bills Settings'} isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalForms
                    paramMonth={paramMonth}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    formType={'billsSettings'}
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
                        <Link to={`/bills/${paramMonth}`}>
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
                            <th>Description</th>
                            <th>Due-Date</th>
                            <th>Budget</th>
                            <th>{getMonthNamesSingleDigit(paramMonth)} Budget</th>
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
                                        <td>{item.description}</td>
                                        <td>{convertToDate(item.dueDate)}</td>
                                        <td>{item.budget.toFixed(2)}</td>
                                        <td>{!item.monthlyBudget ? '' : item.monthlyBudget.toFixed(2)}</td>
                                        <td>
                                            <div className="multi-btn-evenly-v1">
                                                <button
                                                    className="btn-v1 btn-cancel-v1"
                                                    onClick={async () => { await deleteDataController('income', item.id) }}>
                                                    <LuTrash2 />
                                                </button>
                                                <button
                                                    className="btn-v1 btn-cancel-v1"
                                                    onClick={() => updateSetData(
                                                        {
                                                            id: item.id,
                                                            description: item.description,
                                                            dueDate: convertToDate(item.dueDate),
                                                            expected: item.budget,
                                                            monthlyBudget: item.monthlyBudget,
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
export default BillsSettings;

