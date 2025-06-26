import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCollectedData, getCollectedDataByMonth } from '../firebase/controller'
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
            await getCollectedData(setMonthCollectionData, setIsFetching)
            console.log(monthCollectionData)
        }
        returnData()
    }, [])
    const collectData = async (e) => {
        e.preventDefault();
        setAddNewMonth(true)
        const collected = await getCollectedDataByMonth(monthData);
        collected ? setAddNewMonth(false) : setAddNewMonth(true)
    }

    return (
        <>
            <Logout onLogout={onLogOut} />
            <div>
                <form onSubmit={collectData}>
                    <input type="month"
                        value={monthData}
                        onChange={(e) => { setMonthData(e.target.value); console.log(monthData) }}
                    />
                    <button disabled={addNewMonth}>{addNewMonth ? 'Loading' : 'Submit'}</button>
                </form>
            </div>
            <div>
                {isFetching ? (
                    <h1>Fetching Data ...</h1>
                ) : (
                    monthCollectionData.length === 0 ?
                        <h1>No Data Found ...</h1> :
                        monthCollectionData.map((item, index) => (
                            <div key={index + 1}>
                                <Link to={'/income/' +
                                    item.date.toDate().getFullYear()
                                    + '-' +
                                    (item.date.toDate().getMonth() + 1)
                                }>
                                    <button>{getMonthNames(item.date) + ' ' + item.date.toDate().getFullYear() + '    '}</button>
                                </Link>
                            </div>
                        ))
                )}
            </div>
        </>
    )
}