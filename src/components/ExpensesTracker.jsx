import React, { useState, useEffect, useMemo } from 'react';
import { expensesTracker, getExpensesTracker, getExpenses, expensesTrackerUpdate, deleteDataController, checkStaticData } from '../firebase/controller';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Modal from '../layouts/Modal';
import { LuPlus, LuArrowBigUpDash, LuArrowBigDownDash } from "react-icons/lu";
import { convertToDate, getLastDayOfTheMonth } from '../firebase/utils';
import Loading from '../layouts/Loading';

const ExpensesTracker = () => {
    const { paramMonth } = useParams();

    const [formCategory, setFormCategory] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formDiscount, setFormDiscount] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isFetchingTracker, setIsFetchingTracker] = useState(true);
    const [expensesTrackerData, setExpensesTrackerData] = useState([]);
    const [expensesData, setExpensesData] = useState([]);
    const [updateDataStatus, setUpdateStatus] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [changeDate, setChangeDate] = useState(getLastDayOfTheMonth(paramMonth));
    const [changeDateIsChecked, setChangeDateIsChecked] = useState(false);
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

    const fromSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log('loading ba', loading)

        if (!formDescription || !formCategory || !formPrice)
            return console.log('Please fill up all fields.')

        const addData = expensesTracker({
            category: formCategory,
            description: formDescription,
            price: parseFloat(formPrice),
            discount: parseFloat(formDiscount),
            date: changeDateIsChecked ? changeDate : null,
        })
        // if (addData.status === 'success') {
        //     console.log(addData.message);
        //     setLoading(false);
        //     clearForm();
        // } else
        //     setLoading(false);
        console.log(addData.message);
        setLoading(false);
        clearForm();
    }
    useEffect(() => {
        const returnSavings = async () => {
            setIsFetching(true);
            await getExpenses(paramMonth, setExpensesData, setIsFetching, true);
            // setFormCategory();
            await getExpensesTracker(paramMonth, setExpensesTrackerData, setIsFetchingTracker);
            clearForm();
        }
        returnSavings();
    }, []);

    const updateSetData = (id, arrayData) => {
        setUpdateStatus(true);
        setUpdateId(id)
        setFormCategory(arrayData.category)
        setFormDescription(arrayData.description)
        setFormPrice(arrayData.price)
        setFormDiscount(arrayData.discount)
        setIsModalOpen(true)
        setChangeDate(arrayData.date)
    }
    const updateFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let data = {
            category: formCategory,
            description: formDescription,
            price: parseFloat(formPrice),
            discount: parseFloat(formDiscount),
        }
        if (changeDateIsChecked)
            data.date = changeDate;

        const updateResult = await expensesTrackerUpdate(updateId, data, paramMonth);
        if (updateResult.status === 'success') {
            clearForm();
            setIsModalOpen(false)
        } else
            setLoading(false);
        // updateResult.status && <Loading onLoading={false} />
        console.log(updateResult.message);
    }
    const closeModal = () => {
        clearForm();
        setIsModalOpen(false)
    }
    return (
        <>
            <Loading onLoading={loading} />
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
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Action</th >
                                    </tr>
                                </thead>
                                {/* <tbody> */}
                                {isFetchingTracker ? (
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
                                                                    <td>{item.categoryName}</td>
                                                                    <td>{item.description}</td>
                                                                    <td>{item.amount.toFixed(2)}</td>
                                                                    {/* <td>{convertToDate(item.date)}</td>
                                                            <td>{convertToDate(item.createdAt)}</td> */}
                                                                    {/* <td>
                                                                <button onClick={async () => {
                                                                    await deleteDataController('expensesTracker', item.id)
                                                                }}>Delete</button>
                                                            </td> */}
                                                                    <td><button onClick={() => updateSetData(item.id,
                                                                        {
                                                                            id: item.id,
                                                                            category: item.category,
                                                                            description: item.description,
                                                                            price: item.price,
                                                                            discount: item.discount,
                                                                            date: convertToDate(item.date)
                                                                        }
                                                                    )
                                                                    }>Update</button></td>
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
            <Modal title={!updateDataStatus ? 'Add Savings' : 'Update Savings'} isOpen={isModalOpen} onClose={closeModal}>
                <form onSubmit={!updateDataStatus ? fromSubmit : updateFormSubmit}>
                    <div className="floating-label-wrapper">
                        <select
                            className="input"
                            value={formCategory}
                            onChange={(e) => { setFormCategory(e.target.value) }}
                            name="categoryExpensesTracker"
                            id="categoryExpensesTracker"
                            placeholder="Category"
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {isFetching ? (
                                <option value="" disabled>Fetching Data Please Wait. . .</option>
                            ) : (
                                expensesData.length === 0 ?
                                    <option value="" disabled>No Data Found</option> :
                                    expensesData.map((item, index) => (
                                        <option value={item.id} key={index + 1}>{item.category}</option>
                                    )).reverse()
                            )}
                        </select>
                        <label htmlFor="categoryExpensesTracker">Category</label>
                    </div>
                    <div className="floating-label-wrapper">
                        <input
                            type="text"
                            id="descriptionExpensesTracker"
                            placeholder="Description"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                        <label htmlFor="descriptionExpensesTracker">Description</label>
                    </div>
                    <div className="floating-label-wrapper">
                        <input
                            type="text"
                            id="priceExpensesTracker"
                            placeholder="Price"
                            value={formPrice}
                            onChange={(e) => setFormPrice(e.target.value)}
                        />
                        <label htmlFor="priceExpensesTracker">Price</label>
                    </div>
                    <div className="floating-label-wrapper">
                        <input
                            type="text"
                            id="discountExpensesTracker"
                            placeholder="Discount"
                            value={formDiscount}
                            onChange={(e) => setFormDiscount(e.target.value)}
                        />
                        <label htmlFor="discountExpensesTracker">Discount</label>
                    </div>
                    <input type="checkBox" name="changeDate" id="changeDate" value={changeDateIsChecked} onChange={(e) => setChangeDateIsChecked(e.target.checked)} />
                    <label htmlFor="changeDate">Change Date</label>
                    {changeDateIsChecked && (
                        <div className="floating-label-wrapper">
                            <input
                                type="date"
                                id="dateExpensesTracker"
                                placeholder="Date"
                                value={changeDate}
                                onChange={(e) => setChangeDate(e.target.value)}
                            />
                            <label htmlFor="dateExpensesTracker">Date</label>
                        </div>
                    )}
                    <div className="multi-btn">
                        <button
                            className={`btn btn-primary ${loading ? 'cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={loading}>{
                                loading ? 'Loading' :
                                    !updateDataStatus ? 'Add' : 'Update'
                            }
                        </button>
                        <button
                            className={`btn btn-cancel ${loading ? 'cursor-not-allowed' : ''}`}
                            type="button"
                            onClick={closeModal}
                            disabled={loading}>{
                                loading ? 'Loading' :
                                    !updateDataStatus ? 'Close' : 'Cancel'
                            }
                        </button>
                    </div>
                </form>
            </Modal >
        </>
    )

    function clearForm() {
        setFormDescription('')
        setFormCategory('')
        setFormPrice('')
        setFormDiscount('')
        setUpdateStatus(false)
        setUpdateId('')
        setLoading(false)
        setChangeDate(getLastDayOfTheMonth(paramMonth))
        setChangeDateIsChecked(false)
    }
}
export default ExpensesTracker; 