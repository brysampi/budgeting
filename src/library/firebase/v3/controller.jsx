import { getAllDataRealtimeModel, addDataModel, getAllDataRealtimeByDateModel } from "./model";
import { convertToTimeStamp } from "../../utils";

export async function getAllDataRealtime(table, setData, isFetching) {
    return await getAllDataRealtimeModel(table, setData, isFetching)
}

export async function getAllDataRealtimeByDate(table, setData, isFetching) {
    return await getAllDataRealtimeByDateModel(table, setData, isFetching)
}

export async function addWallets(arrayData) {
    const { startingBudget, ...removedData } = arrayData;
    const data = {
        ...removedData,
        status: 'active',
        balance: startingBudget.toNumber(),
    }
    return await addDataModel('wallets', data)
}

export async function addCategory(arrayData) {
    const data = {
        ...arrayData,
        status: 'active',
    }
    return await addDataModel('categories', data)
}