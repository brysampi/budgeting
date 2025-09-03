import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCollectedDataRealTimeController, creteCollectedData } from '../firebase/controller'
import { getMonthNames } from '../firebase/utils'
import Logout from '../components/Logout'

export default function MonthSelection({ onLogOut }) {
    const [monthData, setMonthData] = useState('')
    const [monthCollectionData, setMonthCollectionData] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [addNewMonth, setAddNewMonth] = useState(false)

    useEffect(() => {
        const returnData = async () => {
            setIsFetching(true)
            await getCollectedDataRealTimeController(setMonthCollectionData, setIsFetching)
            console.log(monthCollectionData)
        }
        returnData()
    }, [])
    const collectData = async (e) => {
        e.preventDefault();
        setAddNewMonth(true)
        const collected = await creteCollectedData(monthData);
        // collected ? setAddNewMonth(false) : setAddNewMonth(true)
        console.log(collected)
    }

    return (
        <>
        {/* <Loading onLoading={loading} /> */}
            {/* <Logout onLogout={onLogOut} /> */}
            <div className='card card-no-bg'>
                <form className='flex flex-wrap justify-end'
                    onSubmit={collectData}>
                    <div className='floating-label-wrapper w-full sm:max-w-[300px] bg-[var(--theme-one-light)] px-5 rounded-l-lg'>
                        <input
                            type="month"
                            id="month"
                            value={monthData}
                            onChange={(e) => { setMonthData(e.target.value); console.log(monthData) }}
                        />
                        {/* <label htmlFor="month">Select Month</label> */}
                    </div>

                    <button className="btn btn-primary w-full sm:max-w-[300px]"
                        disabled={addNewMonth}>{addNewMonth ? 'Loading' : 'Select Month'}</button>
                </form>
            </div>
            <div className="card card-main sm:flex sm:flex-row sm:flex-wrap sm:justify-center sm:items-center">
                {isFetching ? (
                    <h1>Fetching Data ...</h1>
                ) : (
                    monthCollectionData.length === 0 ?
                        <h1>No Data Found ...</h1> :
                        monthCollectionData.map((item, index) => (
                            <div key={index + 1} className=''>
                                {console.log('items to',item)}
                                <Link to={'/income/' +
                                    item.date.toDate().getFullYear()
                                    + '-' +
                                    (item.date.toDate().getMonth() + 1)
                                }>
                                    <div className="card card-two">
                                        <div className="title">
                                            {getMonthNames(item.date) + ' ' + item.date.toDate().getFullYear() + '    '}
                                        </div>
                                        <div className="details">
                                            Remaining Income: <span className="title">{item.remainingIncome.toFixed(2)}</span>

                                        </div>

                                    </div>
                                </Link>
                            </div>
                        ))
                )}
            </div>
        </>
    )
}