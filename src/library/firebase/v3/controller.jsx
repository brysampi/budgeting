import { getAllDataModel, getAllDataRealtimeModel, addDataModel, getAllDataRealtimeByDateModel, updateData } from "./model";
import { convertToTimeStamp, convertToDate, errorMsg, successMsg } from "../../utils";
import Big from "big.js";
// ----------------------------------General----------------------------------------
export async function getAllDataRealtime(table, setData, isFetching) {
    return await getAllDataRealtimeModel(table, setData, isFetching)
}

export async function getAllDataRealtimeByDate(table, setData, isFetching, date = null) {
    return await getAllDataRealtimeByDateModel(table, setData, isFetching, date)
}

// ----------------------------------Collected Data----------------------------------------
export async function checkCollectedData(date) {
    const resp = await getAllDataModel('collectedData', convertToTimeStamp(date))
    if (resp.data && resp.data.length > 0) {
        return successMsg('Data found', resp.data[0])
    }
    return errorMsg('No data found.')
}

// paramMonth = yyyy-mm-dd
export async function updateCollectedData(paramMonth, type, amount = 0) {
    console.log('Updating collectedData for:', paramMonth, 'Type:', type)
    // Check if data exists for this month
    const existing = await checkCollectedData(paramMonth)

    if (existing.boolean) {
        // Update existing record
        const updatePayload = {
            [type]: amount // Dynamic key: e.g., expenses: amount
        }
        return await updateData('collectedData', existing.data.id, updatePayload)
    } else {
        // Create new record for the month
        const newData = {
            balance: 0,
            income: 0,
            savings: 0,
            bills: 0,
            expenses: 0,
            [type]: amount,
            date: convertToTimeStamp(paramMonth),
        }
        return await addDataModel('collectedData', newData)
    }
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
    // const data = {
    //     balance: 0,
    //     income: 0,
    //     savings: 0,
    //     bills: 0,
    //     expenses: 0,
    //     date: convertToTimeStamp(arrayData.date),
    // }
    // return await addDataModel('collectedData', data)
}
export async function getTransactions(paramMonth, setData, setIsFetching) {
    return await getAllDataRealtimeModel('transactions', setData, setIsFetching)
}
// ----------------------------------Income----------------------------------------
export async function addIncome(arrayData, date, wallet) {
    // console.log('addIncome', arrayData, date, wallet)
    if (!arrayData.category || !arrayData.description || !arrayData.amount || arrayData.amount === 0)
        return errorMsg('Category, Description, and Price is required')
    if (!arrayData.wallet)
        return errorMsg('Wallet is required')
    if (!arrayData.date)
        return errorMsg('Date is required')
    const type = 'income'
    let successCount = 0;
    let countErrors = 0;
    let totalAmount = 0;
    await Promise.all(arrayData.map(async (arrayData, index) => {
        const data = {
            type: type,
            category: arrayData.categoryId,
            description: arrayData.description,
            amount: arrayData.amount.toNumber(),
            wallet: wallet,
            date: convertToTimeStamp(date),
        }
        totalAmount += data.amount;
        const result = await addDataModel('transactions', data)
        // console.log(`result ${index + 1}`, result)
        result.boolean ? successCount++ : countErrors++
    }),
        await updateCollectedData(date, type, totalAmount)
    );
    // console.log('successCount', successCount)
    // console.log('countErrors', countErrors)
    if (successCount > 0 && countErrors <= 0)
        return successMsg(`Successfully added ${successCount} of ${arrayData.length} income.`)
    if (countErrors > 0)
        return errorMsg(`Failed to add income. ${countErrors} errors`);

    return errorMsg('Failed to add income');
}
// ----------------------------------Expenses----------------------------------------
export async function addExpenses(arrayData, date, wallet) {
    // console.log('addExpenses', arrayData)
    if (!arrayData.category || !arrayData.description || !arrayData.amount || arrayData.amount === 0)
        return errorMsg('Category, Description, and Price is required')
    if (!arrayData.wallet)
        return errorMsg('Wallet is required')
    if (!arrayData.date)
        return errorMsg('Date is required')
    const type = 'expenses'
    let successCount = 0;
    let countErrors = 0;
    let totalAmount = 0;
    await Promise.all(arrayData.map(async (arrayData, index) => {
        const data = {
            type: type,
            // status: 'completed',
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
    }),
        await updateCollectedData(date, type, totalAmount)
    );
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
// ----------------------------------Bills----------------------------------------
export async function addBills(arrayData, date, wallet) {
    // console.log('arrayData', date)
    if (!arrayData.category || !arrayData.description || !arrayData.expected || arrayData.expected === 0)
        return errorMsg('Category, Description, and Expected Amount is required')
    if (!arrayData.wallet)
        return errorMsg('Wallet is required')
    if (!arrayData.date)
        return errorMsg('Date is required')
    const type = 'bills'
    let successCount = 0;
    let countErrors = 0;
    let totalAmount = 0;
    await Promise.all(arrayData.map(async (arrayData, index) => {
        const data = {
            type: type,
            // status: 'completed',
            category: arrayData.categoryId,
            description: arrayData.description,
            dueDate: convertToTimeStamp(arrayData.dueDate),
            expected: !arrayData.expected || arrayData.expected === 0 ? 0 : arrayData.expected.toNumber(),
            amount: !arrayData.amount || arrayData.amount === 0 ? 0 : arrayData.amount.toNumber(),
            date: convertToTimeStamp(date),
            wallet: wallet,
        }
        totalAmount += data.amount;
        const result = await addDataModel('transactions', data)
        result.boolean ? successCount++ : countErrors++
        // console.log('data', data)
    }),
        await updateCollectedData(date, type, totalAmount)
    );
    if (successCount > 0 && countErrors <= 0)
        return successMsg(`Successfully added ${successCount} of ${arrayData.length} bills.`)
    if (countErrors > 0)
        return errorMsg(`Failed to add bills. ${countErrors} errors`);

    return errorMsg('Failed to add bills');
}