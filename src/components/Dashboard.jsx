import React from 'react'
import Rechart from './charts/Rechart';


const Dashboard = () => {
    return (
        <>
            <div className="flex flex-wrap gap-3">
                <div className="card card-main">
                    <div className="">
                        <Rechart />
                    </div>
                    card
                </div>
                <div className="card card-main">
                    <div className="">
                        <Rechart />
                    </div>
                    card
                </div>
                <div className="card card-main">
                    <div className="">
                        <Rechart />
                    </div>
                    card
                </div>
                <div className="card card-main">
                    <div className="">
                        <Rechart />
                    </div>
                    card
                </div>
            </div>
        </>
    )
}
export default Dashboard;