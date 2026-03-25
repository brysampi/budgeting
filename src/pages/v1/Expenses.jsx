import { useState, useEffect } from 'react';
import { getExpenses, deleteDataController } from '../../library/firebase/controller';
import { useParams, Link } from 'react-router-dom';
import { LuPlus, LuTrash2, LuSquarePen, LuSettings } from "react-icons/lu";
import Modal from '../../components/modal/Modal';
import ModalForms from './ModalForms';

const Expenses = () => {
    const { paramMonth } = useParams();
    const [isFetching, setIsFetching] = useState(true);
    const [expensesData, setExpensesData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateData, setUpdateData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const returnExpenses = async () => {
            setIsFetching(true);
            return await getExpenses(paramMonth, setExpensesData, setIsFetching);
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
            <Modal title={!updateDataStatus ? 'Add Expense' : 'Update Expense'} isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalForms
                    paramMonth={paramMonth}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    formType={'expenses'}
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
                        {/* <Link to={`/expensesTracker/${paramMonth}`}>
                            <button
                                className='btn btn-secondary'>
                                <span><LuArrowLeft  /></span>
                                <span>Back</span>
                            </button>
                        </Link> */}
                    </div>
                    <div className='multi-btn'>
                        <button
                            className='btn btn-primary'
                            onClick={() => setIsModalOpen(true)}>
                            <span><LuPlus /></span>
                            <span>Add</span>
                        </button>
                        <Link to={`/v1/expensesSettings/${paramMonth}`}>
                            <button
                                className='btn btn-primary'>
                                <span><LuSettings /></span>
                                <span>Settings</span>
                            </button>
                        </Link>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            {/* <th>#</th> */}
                            <th>Category</th>
                            <th>Budget</th>
                            <th>Actual</th>
                            <th>Remaining</th>
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
                                        <td>{
                                            !item.monthlyBudget || item.monthlyBudget <= 0 ?
                                                item.budget.toFixed(2) :
                                                item.monthlyBudget.toFixed(2)
                                        }</td>
                                        <td>{!item.actual ? 0.00 : item.actual.toFixed(2)}</td>
                                        <td>{
                                            !item.monthlyBudget || item.monthlyBudget <= 0 ?
                                                !item.actual ? item.budget.toFixed(2) : (item.budget - item.actual).toFixed(2) :
                                                !item.actual ? item.monthlyBudget.toFixed(2) : (item.monthlyBudget - item.actual).toFixed(2)
                                        }</td>
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
                                                            expected: !item.monthlyBudget ? item.budget : item.monthlyBudget,
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
export default Expenses;

