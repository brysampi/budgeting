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
    const progress = (180 / 200) * 100;
    return (
        <>
            <div className="card card-main flex flex-col justify-between sm:items-center p-5 mb-[10px] sm:flex-row">
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
                <div>
                    {/* {
                    isFetchingNavbar ? 'Loading...' :
                        monthCollectionData.length === 0 ? 'No Data' :
                            `Remaining Income: ${monthCollectionData[0].remainingIncome.toFixed(2)}`
                } */}
                    <div className='w-full justify-between items-center max-w-[400px] '>
                        <div className=''>
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
                        </div>
                    </div>
                </div>
                <div className='hidden sm:block'>Test</div>
            </div>
            {/* {console.log('Month Collected ',monthCollectionData.remainingIncome)} */}
            {/* {currentRoute.title} */}
        </>
    )
}
export default Navbar;