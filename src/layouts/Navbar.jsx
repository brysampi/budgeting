import { useEffect, useState } from 'react'
import { useLocation, matchPath } from "react-router-dom";
import { getDataRealTimeController } from '../firebase/controller'
const Navbar = ({ title, paramMonth }) => {
    const [monthCollectionData, setMonthCollectionData] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const location = useLocation();
    // const pageTitles = {
    //     "/": "",
    //     "/income/:paraMonth": "Income",
    //     "/savings/:paraMonth": "Savings Summary / Category",
    //     "/savingsTracker/:paraMonth": "Savings Tracker",
    //     "/expenses/:paraMonth": "Expenses",
    //     "/expensesTracker/:paraMonth": "Expenses Tracker",
    //     "/expenses/expensesSettings/:paraMonth": "Expenses Settings",
    // };
    // console.log('Navbar Title ',paramMonth)

    useEffect(() => {
        const returnData = async () => {
            setIsFetching(true)
            return await getDataRealTimeController('collectedData', paramMonth, setMonthCollectionData, setIsFetching);
        }
        returnData()
    }, [])
    return (
        <>
            <div className="card card-main flex flex-row justify-between items-center p-5">
                <div>{title}</div>
                <div>{
                    isFetching ? 'Loading...' :
                        monthCollectionData.length === 0 ? 'No Data' :
                            `Remaining Income: ${monthCollectionData[0].remainingIncome.toFixed(2)}`
                }</div>
                <div>Test</div>
            </div>
            {/* {console.log('Month Collected ',monthCollectionData.remainingIncome)} */}
            {/* {currentRoute.title} */}
        </>
    )
}
export default Navbar;