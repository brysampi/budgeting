import React, { useState, useEffect, useMemo } from 'react';
import { expensesTracker, getExpensesTracker, getExpenses, expensesTrackerUpdate, deleteDataController, checkStaticData } from '../firebase/controller';
import { useParams, useOutletContext } from 'react-router-dom';
import { LuPlus, LuArrowBigUpDash, LuArrowBigDownDash, LuTrash2, LuSquarePen } from "react-icons/lu";
import { convertToDate, getLastDayOfTheMonth } from '../firebase/utils';
import Modal from '../layouts/Modal';
import ModalForms from './ModalForms';

const ExpensesTracker = () => {
    const selectedWallet = useOutletContext();
    const { paramMonth } = useParams();
    const [isFetching, setIsFetching] = useState(true);
    const [expensesTrackerData, setExpensesTrackerData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateData, setUpdateData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openDay, setOpenDay] = useState([]);
    const [getAllDays, setGetAllDays] = useState([]);

    const allTotal = useMemo(() => {
        // Get All Days
        // Object.keys(expensesTrackerData).map((key) => {
        //     setGetAllDays(prev => prev.includes(key) ? prev : [...prev, key] );
        // });
        if (!expensesTrackerData || Object.keys(expensesTrackerData).length === 0) return 0;
        return Object.values(expensesTrackerData).reduce((acc, items) => {
            const dayTotal = items.reduce((sum, item) => sum + item.amount, 0);
            // console.log('items date', items)
            return acc + dayTotal;
        }, 0);
    }, [expensesTrackerData]);

    useEffect(() => {
        if (!expensesTrackerData) return;
        const days = Object.keys(expensesTrackerData);
        setGetAllDays(days);
    }, [expensesTrackerData]);

    useEffect(() => {
        const returnSavings = async () => {
            setIsFetching(true);
            // await getExpenses(paramMonth, setExpensesData, setIsFetching, true);
            // setFormCategory();
            await getExpensesTracker(paramMonth, setExpensesTrackerData, setIsFetching, selectedWallet);
            // clearForm();
        }
        returnSavings();
        // setFormWallet(selectedWallet)
    }, [selectedWallet]);
    // useEffect(() => {
    //     if (!formWallet && walletsData && walletsData.length > 0) {
    //         setFormWallet(walletsData[walletsData.length - 1].id);
    //     }
    // }, [walletsData, formWallet]);

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
                    formType={'expensesTracker'}
                    selectedWallet={selectedWallet}
                    isUpdate={updateDataStatus}
                    setIsUpdate={setUpdateStatus}
                    updateData={updateData}
                    setUpdateData={setUpdateData}
                />
            </Modal >
            {/* <div className="card-container">
                <div className="card card-main ">
                    Total: {allTotal.toFixed(2)}
                </div>
            </div> */}
            {/* <div className="card card-main ">
                Total Expenses: {allTotal.toFixed(2)}
            </div> */}

            <div className="card card-main">
                <div className='table-container'>
                    <div className='table-header'>
                        <div>
                            {/* Table Title Here */}
                            OverAll Total: <span className='text-[var(--color-theme-important)] font-extrabold'>{allTotal.toFixed(2)}</span>
                            <div className='flex gap-2 mt-2'>
                                <div onClick={() => getAllDays.forEach(day => setOpenDay(getAllDays.includes(day) ? [...getAllDays] : [...getAllDays, day]))}>
                                    <LuArrowBigDownDash />
                                </div>
                                <div onClick={() => setOpenDay([])}>
                                    < LuArrowBigUpDash />
                                </div>
                            </div>
                        </div>
                        <div className='multi-btn'>
                            <button
                                className='btn btn-primary'
                                onClick={() => setIsModalOpen(true)}>
                                <span><LuPlus /></span>
                                <span>Add</span>
                            </button>
                            {/* <Link to={`/expenses/${paramMonth}`}>
                            <button
                                className='btn btn-primary'>
                                <span><LuClipboardList /></span>
                                <span>Catergory</span>
                            </button>
                        </Link> */}
                            {/* <Link to={`/expensesSettings/${paramMonth}`}>
                            <button
                                className='btn btn-primary'>
                                <span><LuSettings /></span>
                                <span>Settings</span>
                            </button>
                        </Link> */}
                        </div>
                    </div>
                    <div className='table-body'>
                        <div className='w-full overflow-x-auto'>
                            <table className="table">
                                <thead>
                                    <tr>
                                        {/* <th>wallet</th> */}
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Action</th >
                                    </tr>
                                </thead>
                                {/* <tbody> */}
                                {isFetching ? (
                                    <tbody><tr><td colSpan={6}>Loading...</td></tr></tbody>
                                ) : (
                                    expensesTrackerData.length === 0 ?
                                        <tbody><tr><td colSpan={6}>No Data Found</td></tr></tbody> :
                                        Object.entries(expensesTrackerData).map(([key, value]) => {
                                            // let total1 = 0;
                                            const total = value.reduce((acc, item) => acc + item.amount, 0);
                                            // setOpenDay(prev => [...prev, key] )
                                            const isOpen = openDay.includes(key);
                                            const toggleDay = () => {
                                                setOpenDay((prev) =>
                                                    prev.includes(key)
                                                        ? prev.filter((day) => day !== key) // remove it (close)
                                                        : [...prev, key] // add it (open)
                                                );
                                            };
                                            return (
                                                <tbody key={key}>
                                                    <tr
                                                        className="tr-header"
                                                        onClick={toggleDay}
                                                    ><td colSpan={2}
                                                    // style={{
                                                    //     textAlign: 'center',
                                                    //     fontWeight: 'bold',
                                                    //     backgroundColor: 'lightgray',
                                                    // }}

                                                    >
                                                            <div className='flex flex-row-reverse justify-evenly items-center'>
                                                                Day: {key}
                                                                <span>{isOpen ? <LuArrowBigUpDash /> : <LuArrowBigDownDash />} </span>
                                                            </div>
                                                        </td>
                                                        <td className="tr-header-important ">Total: </td>
                                                        <td className="tr-header-important">{total.toFixed(2)}</td>
                                                    </tr>
                                                    {isOpen &&
                                                        value.map((item, index) => {
                                                            // console.log(item)
                                                            // total1 += item.amount;
                                                            return (
                                                                <tr key={index}>
                                                                    {/* <td>{item.wallet}</td> */}
                                                                    <td>{item.categoryName}</td>
                                                                    <td>{item.description}</td>
                                                                    <td>{item.amount.toFixed(2)}</td>
                                                                    {/* <td>{convertToDate(item.date)}</td>
                                                            <td>{convertToDate(item.createdAt)}</td> */}
                                                                    {/* <td>
                                                                // <button onClick={async () => {
                                                                //     await deleteDataController('expensesTracker', item.id)
                                                                // }}>Delete</button>
                                                            </td> */}
                                                                    <td>
                                                                        <div className="multi-btn-evenly">
                                                                            <button
                                                                                className="btn btn-cancel"
                                                                                onClick={async () => {
                                                                                    await deleteDataController('expensesTracker', item.id)
                                                                                }}><LuTrash2 />
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-cancel"
                                                                                onClick={() => updateSetData(
                                                                                    {
                                                                                        id: item.id,
                                                                                        category: item.category,
                                                                                        description: item.description,
                                                                                        price: item.price,
                                                                                        discount: item.discount,
                                                                                        wallet: item.wallet,
                                                                                        date: convertToDate(item.date)
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
                                                    {/* <tr><td colSpan={3} ></td>
                                                <td
                                                    className="font-blod align-right bg-[var(--theme-one-tertiary)]"
                                                >
                                                    Total: {total1.toFixed(2)}
                                                </td>
                                            </tr> */}
                                                </tbody >
                                            )

                                        }
                                        ).reverse()
                                )
                                }
                                {/* </tbody> */}
                                {/* {console.log('all total', allTotalSum)} */}
                            </table>
                        </div>

                    </div>

                </div>
            </div >
        </>
    )
}
export default ExpensesTracker; 