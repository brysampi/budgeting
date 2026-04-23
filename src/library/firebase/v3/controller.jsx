import { getAllDataRealtimeModel, addDataModel, getAllDataRealtimeByDateModel } from "./model";
import { convertToTimeStamp, errorMsg, successMsg } from "../../utils";
import Big from "big.js";
// ----------------------------------General----------------------------------------
export async function getAllDataRealtime(table, setData, isFetching) {
    return await getAllDataRealtimeModel(table, setData, isFetching)
}

export async function getAllDataRealtimeByDate(table, setData, isFetching) {
    return await getAllDataRealtimeByDateModel(table, setData, isFetching)
}


export async function updateCollectedData() {

}

// ----------------------------------Wallets----------------------------------------1
export async function addWallets(arrayData) {
    const { startingBudget, ...removedData } = arrayData;
    const data = {
        ...removedData,
        status: 'active',
        balance: startingBudget.toNumber(),
    }
    return await addDataModel('wallets', data)
}
// ----------------------------------Category----------------------------------------
export async function addCategory(arrayData) {
    const data = {
        ...arrayData,
        status: 'active',
    }
    return await addDataModel('categories', data)
}

// ----------------------------------Transactions----------------------------------------
export async function addTransactions(arrayData) {
    const data = {
        balance: 0,
        income: 0,
        savings: 0,
        bills: 0,
        expenses: 0,
        date: convertToTimeStamp(arrayData.date),
    }
    return await addDataModel('collectedData', data)
}
export async function getTransactions(paramMonth, setData, setIsFetching) {
    return await getAllDataRealtimeModel('transactions', setData, setIsFetching)
}
// ----------------------------------Expenses----------------------------------------
export async function addExpenses(arrayData, date, wallet) {
    // console.log('addExpenses', arrayData)
    // if (!arrayData.category || !arrayData.description || !arrayData.amount || arrayData.amount === 0)
    //     return errorMsg('Category, Description, and Price is required')
    // if (!arrayData.wallet)
    //     return errorMsg('Wallet is required')
    // if (!arrayData.date)
    //     return errorMsg('Date is required')
    let successCount = 0;
    let countErrors = 0;
    let totalAmount = 0;
    await Promise.all(arrayData.map(async (arrayData, index) => {
        const data = {
            type: 'expense',
            status: 'completed',
            category: arrayData.categoryId,
            description: arrayData.description,
            originalAmount: arrayData.price ? arrayData.price.toNumber() : 0,
            discount: arrayData.discount ? arrayData.discount.toNumber() : 0,
            amount: arrayData.discount ?
                arrayData.price.minus(arrayData.discount).toNumber() :
                arrayData.price ? arrayData.price.toNumber() : 0,
            date: convertToTimeStamp(date),
            wallet: wallet,
        }
        totalAmount += data.amount;
        const result = await addDataModel('transactions', data)
        // console.log(`result ${index + 1}`, result)
        result.boolean ? successCount++ : countErrors++
    }));
    // console.log('successCount', successCount)
    // console.log('countErrors', countErrors)
    if (successCount > 0 && countErrors <= 0)
        return successMsg(`Successfully added ${successCount} of ${arrayData.length} expenses.`)
    if (countErrors > 0)
        return errorMsg(`Failed to add expenses. ${countErrors} errors`);

    return errorMsg('Failed to add expenses');
    // const { amount, discount, ...removedData } = arrayData
    // const data = {
    //     ...removedData,
    //     type: 'expense',
    //     originalAmount: amount.toNumber(),
    //     amount: discount.toNumber() > 0 ? amount.minus(discount).toNumber() : amount.toNumber(),
    //     discount: discount.toNumber(),
    //     status: 'completed',
    // }
    // console.log('data', data)
    // return await addDataModel('transactions', data)
}