import { useState, useEffect } from 'react';
import { deleteDataController, getExpenses_v2 } from '../../library/firebase/controller';
import { useParams, Link } from 'react-router-dom';
import { getMonthNamesSingleDigit } from '../../library/firebase/utils';
import { LuPlus, LuArrowLeft, LuTrash2, LuSquarePen } from "react-icons/lu";
import Modal from '../../components/modal/Modal';
import ModalForms from './ModalForms';

const ExpensesSettings = () => {
    const { paramMonth } = useParams();
    const [isFetching, setIsFetching] = useState(true);
    const [expensesData, setExpensesData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateData, setUpdateData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const returnExpenses = async () => {
            setIsFetching(true);
            return await getExpenses_v2(paramMonth, setExpensesData, setIsFetching);
        }

        returnExpenses();
    }, []);

    const updateSetData = (arrayData) => {
        setUpdateStatus(true);
        setUpdateData(arrayData)
        setIsModalOpen(true)
    }
    return (
        <>
            <Modal title={!updateDataStatus ? 'Add Bill Settings' : 'Update Bill Settings'} isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalForms
                    paramMonth={paramMonth}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    formType={'expensesSettings'}
                    selectedWallet={''}
                    isUpdate={updateDataStatus}
                    setIsUpdate={setUpdateStatus}
                    updateData={updateData}
                    setUpdateData={setUpdateData}
                />
            </Modal >

            <div className="card-container">
                <div className="card card-no-bg flex-1"> </div>
                <div className="card card-main">


                </div>
            </div>
            <div className="card card-main">
                <div className='table-header'>
                    <div>
                        {/* Table Title Here */}
                        <Link to={`/v1/expenses/${paramMonth}`}>
                            <button
                                className='btn btn-cancel'>
                                <span><LuArrowLeft /></span>
                                <span>Back</span>
                            </button>
                        </Link>
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
                            <th>Category</th>
                            <th>Default Budget</th>
                            <th>{getMonthNamesSingleDigit(paramMonth)} Budget</th>
                            <th>Status</th>
                            {/* <th>Date</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        ) : (
                            expensesData.length === 0 ?
                                <tr><td colSpan={6}>No Data Found</td></tr> :
                                expensesData.map((item, index) => (
                                    <tr key={index + 1}>
                                        <td>{item.category}</td>
                                        <td>{item.budget}</td>
                                        <td>{!item.monthlyBudget ? '' : item.monthlyBudget}</td>
                                        <td>{item.status}</td>
                                        {/* <td>{item.date}</td> */}
                                        <td>
                                            <div className="multi-btn-evenly">
                                                <button
                                                    className="btn btn-cancel"
                                                    onClick={async () => { await deleteDataController('expenses', item.id) }}>
                                                    <LuTrash2 />
                                                </button>
                                                <button
                                                    className="btn btn-cancel"
                                                    onClick={() => updateSetData(
                                                        {
                                                            id: item.id,
                                                            categoryText: item.category,
                                                            expected: item.budget,
                                                            monthlyBudget: !item.monthlyBudget ? '' : item.monthlyBudget,
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
export default ExpensesSettings;

