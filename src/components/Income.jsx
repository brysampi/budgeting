import { useState, useEffect } from 'react';
import { getDataRealTimeController, deleteDataController } from '../firebase/controller';
import { useParams, useOutletContext } from 'react-router-dom';
import { LuPlus, LuTrash2, LuSquarePen } from 'react-icons/lu';
import Modal from '../layouts/Modal';
import ModalForms from './ModalForms';

const Income = () => {
    const selectedWallet = useOutletContext();
    const { paramMonth } = useParams();
    const [isFetching, setIsFetching] = useState(true);
    const [incomeData, setIncomeData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateData, setUpdateData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const returnIncome = async () => {
            setIsFetching(true);
            return await getDataRealTimeController('income', paramMonth, setIncomeData, setIsFetching, selectedWallet);
        }
        returnIncome();
    }, [selectedWallet]);

    const updateSetData = (arrayData) => {
        setUpdateStatus(true);
        setUpdateData(arrayData)
        setIsModalOpen(true)
    }

    return (
        <>
            {/* <Rechart /> */}
            <Modal title={!updateDataStatus ? 'Add Income' : 'Update Income'} isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalForms
                    paramMonth={paramMonth}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    formType={'income'}
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
                <div className="table-header">
                    <div>
                        {/* Table Title Here */}
                    </div>
                    <div>
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsModalOpen(true)}>
                            <span><LuPlus /></span>
                            <span>Add</span>
                        </button>
                    </div>
                </div>
                <div className='table-body'>
                    <div className='w-full overflow-x-auto'>
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
                                                <td>
                                                    <div className="multi-btn-evenly">
                                                        <button
                                                            className="btn btn-cancel"
                                                            onClick={async () => { await deleteDataController('income', item.id) }}>
                                                            <LuTrash2 />
                                                        </button>
                                                        <button
                                                            className="btn btn-cancel"
                                                            onClick={() => updateSetData(
                                                                {
                                                                    id: item.id,
                                                                    description: item.description,
                                                                    expected: item.expected,
                                                                    amount: item.amount,
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
                </div>
            </div>
        </>
    )
}
export default Income;