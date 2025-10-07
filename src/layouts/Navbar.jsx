import { useEffect, useState } from 'react'
import { useLocation, matchPath, useOutletContext } from "react-router-dom";
import { getDataRealTimeController, getAllDataRealTimeController, getAllDataActiveRealTimeController } from '../firebase/controller'

const Navbar = ({
    title,
    paramMonth,
    selectedWallet,
    setSelectedWallet,
    walletsData,
    setWalletsData
}) => {
    const [monthCollectionData, setMonthCollectionData] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [isFetchingNavbar, setIsFetchingNavbar] = useState(false)
    const [walletsDataNavbar, setWalletsDataNavbar] = useState([]);
    // const { wallet, setWalletsData } = useOutletContext();
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
    // useEffect(() => {
    //     const returnData = async () => {
    //         const data = await getAllDataController('wallets');
    //         setWalletsData(data);
    //         // console.log('Wallet Data ', walletData)
    //     }
    //     returnData()
    // }, [])
    useEffect(() => {
        const returnWallets = async () => {
            return await getAllDataRealTimeController('wallets', setWalletsDataNavbar, setIsFetchingNavbar);
        }
        // const returnWalletActive = async () => {
        //     return await getAllDataActiveRealTimeController('wallets', setWalletsData, setIsFetching);
        // }

        returnWallets();
        // returnWalletActive();
    }, []);
    return (
        <>
            <div className="card card-main flex flex-row justify-between items-center p-5 mb-[10px]">
                <div>
                    {title}
                    <div className='floating-label-wrapper'>
                        <select
                            id="selectWallet"
                            placeholder="Select Wallet"
                            className='input'
                            value={selectedWallet}
                            onChange={(e) => setSelectedWallet(e.target.value)}
                        >
                            <option value="" defaultValue>All Wallet</option>
                            {/* {console.log('Wallet Data ', walletData.id)} */}
                            {walletsDataNavbar &&
                                walletsDataNavbar.map((data) => (
                                    <option key={data.id} value={data.id}>{data.name}</option>
                                )).reverse()
                            }
                        </select>
                        <label htmlFor="selectWallet">Select Wallet</label>
                    </div>
                </div>
                <div>{
                    isFetchingNavbar ? 'Loading...' :
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