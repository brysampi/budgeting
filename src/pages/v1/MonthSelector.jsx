import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCollectedDataRealTimeController, creteCollectedData } from '../../library/firebase/controller'
import { convertToDate, getMonthNames } from '../../library/firebase/utils'
import Logout from './Logout'
import Navbar from '../../layouts/v1/Navbar'

import { UploadImage } from '../../library/gemini/RecieptScanner'

export default function MonthSelection({ onLogOut }) {
    const [monthData, setMonthData] = useState(convertToDate(new Date()).slice(0, 7))
    const [monthCollectionData, setMonthCollectionData] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

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
        setIsLoading(true)
        const collected = await creteCollectedData(monthData)
        setIsLoading(false)
        console.log('Collected ', collected)
        if (collected.status === 'success') {
            // alert('Month Data Created Successfully')
            navigate(`/dashboard/${monthData}`)
        }
    }
    const progress = (180 / 200) * 100;

    const [formData11, setFormData11] = useState({ vendor: '', total: 0, items: [] });

    const handleAiData = (data) => {
        setFormData11(data); // This fills your form automatically!
    };

    return (
        <>
            <UploadImage onDataExtracted={handleAiData} />
            {/* <Loading onLoading={loading} /> */}
            {/* <Logout onLogout={onLogOut} /> */}
            <div className='card-v1 card-shadow-v1 card-no-hover-v1 flex flex-col justify-between my-[1rem]  sm:flex-row'>
                <div className='flex items-center mb-[1rem] sm:mb-0 sm:text-left text-2xl font-bold'>
                    Select Month
                </div>
                <div className='w-full justify-between items-center max-w-[400px] '>
                    {/* <div className=''>
                        <div>
                            Balance
                        </div>
                        <div className='flex items-center gap-3 mb-2 '>
                            <div className="w-full bg-[#5a5959] rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-[var(--color-theme-important-light)] to-[var(--color-theme-important)] h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div>
                                {`${progress}%`}
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col justify-between sm:flex-row'>
                        <div className='flex flex-row gap-2'>
                            <div>
                                Income
                            </div>
                            <div className='text-[var(--color-success)]'>
                                200.00
                            </div>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <div>
                                Expenses
                            </div>
                            <div className='text-[var(--color-danger)]'>
                                200.00
                            </div>
                        </div>
                    </div> */}
                </div>
                <div>
                    {/* <div className='flex items-center mb-[1rem] sm:mb-0 sm:text-left text-2xl font-bold'> */}
                    Logout
                </div>
            </div>
            {/* <Navbar title={'Select Month'} /> */}


            <div className='select-month-container-v1'>
                <form className='form-select-month-v1 py-0'
                    onSubmit={collectData}>
                    <div className=''>
                        <input
                            className=''
                            type="month"
                            id="month"
                            value={monthData}
                            onChange={(e) => { setMonthData(e.target.value); console.log(monthData) }}
                        />
                        {/* <label htmlFor="month">Select Month</label> */}
                    </div>

                    <button className="btn-v1 btn-primary-v1 btn-select-month sm:min-w-[9rem] rounded-l-none text-[var(--color-dark)] pl-2 pr-2 sm:pl-6 sm:pr-6"
                        disabled={isLoading}>{isLoading ? 'Loading' : 'Select Month'}
                    </button>
                </form>
            </div>
            <div className="sm:flex sm:flex-row sm:flex-wrap sm:justify-center sm:items-center">
                {isFetching ? (
                    <h1>Fetching Data ...</h1>
                ) : (
                    monthCollectionData.length === 0 ?
                        <h1>No Data Found ...</h1> :
                        monthCollectionData.map((item, index) => (
                            <div key={index + 1} className=''>
                                {/* {console.log('items to', item)} */}
                                <Link to={'/v1/dashboard/' +
                                    item.date.toDate().getFullYear()
                                    + '-' +
                                    (item.date.toDate().getMonth() + 1)
                                }>
                                    <div className="card-v1 card-shadow-v1">
                                        <div className="title-v1">
                                            {getMonthNames(item.date) + ' ' + item.date.toDate().getFullYear() + '    '}
                                        </div>
                                        <div className="details-v1">
                                            Remaining Income: <span>{item.remainingIncome.toFixed(2)}</span>
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
