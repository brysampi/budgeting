import { getAllDataModel, getAllDataRealtimeModel, addDataModel, getAllDataRealtimeByDateModel, updateData } from "./model";
import { convertToTimeStamp, convertToDate, errorMsg, successMsg, accurateDecimal } from "../../utils";
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
export async function updateCollectedData(paramMonth, type, amount = 0, walletId = null, walletBalance = 0) {
    console.log('Updating collectedData for:', paramMonth, 'Type:', type)
    // Check if data exists for this month
    const existing = await checkCollectedData(paramMonth)
    // console.log('existing', existing)
    if (existing.boolean) {
        // Update existing record
        const updatePayload = {
            balance: type === 'income' ?
                existing.data.balance + amount :
                existing.data.balance - amount,
            [type]: existing.data[type] + amount
        }
        if (walletId) {
            await updateData('wallets', walletId, { balance: walletBalance })
        }
        return await updateData('collectedData', existing.data.id, updatePayload)
    } else {
        // Create new record for the month
        const newData = {
            balance: type === 'income' ?
                amount :
                0 - amount,
            income: type === 'income' ? amount : 0,
            savings: type === 'savings' ? amount : 0,
            bills: type === 'bills' ? amount : 0,
            expenses: type === 'expenses' ? amount : 0,
            date: convertToTimeStamp(paramMonth),
        }
        if (walletId) {
            await updateData('wallets', walletId, { balance: walletBalance })
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
}

export async function getTransactions(paramMonth, setData, setIsFetching) {
    return await getAllDataRealtimeModel('transactions', setData, setIsFetching)
}

// ----------------------------------Income----------------------------------------
export async function addIncome(arrayData, date, wallet, walletBalance) {
    const invalidRows = arrayData.filter(row => !row.categoryId || !row.description || accurateDecimal(row.amount || 0).toNumber() === 0)
    if (invalidRows.length > 0)
        return errorMsg('Category, Description, and Price is required')
    if (!wallet)
        return errorMsg('Wallet is required')
    if (!date)
        return errorMsg('Date is required')

    const type = 'income'
    let successCount = 0;
    let countErrors = 0;
    let totalAmount = 0;
    let initialWalletBalance = accurateDecimal(walletBalance).toNumber();

    for (const rowData of arrayData) {
        const amount = accurateDecimal(rowData.amount || 0).toNumber();
        totalAmount += amount;
        initialWalletBalance = accurateDecimal(initialWalletBalance).add(amount).toNumber();

        const data = {
            type: type,
            category: rowData.categoryId,
            description: rowData.description,
            amount: amount,
            wallet: wallet,
            date: convertToTimeStamp(date),
            walletBalance: initialWalletBalance,
        }

        const result = await addDataModel('transactions', data)
        result.boolean ? successCount++ : countErrors++
    }

    await updateCollectedData(date, type, totalAmount, wallet, initialWalletBalance);
    // await updateData('wallets', wallet, { balance: initialWalletBalance.toNumber() });

    if (successCount > 0 && countErrors <= 0)
        return successMsg(`Successfully added ${successCount} of ${arrayData.length} income.`)
    if (countErrors > 0)
        return errorMsg(`Failed to add income. ${countErrors} errors`);

    return errorMsg('Failed to add income');
}

// ----------------------------------Expenses----------------------------------------
export async function addExpenses(arrayData, date, wallet, walletBalance) {
    const invalidArrayData = arrayData.filter(row => !row.categoryId || !row.description || accurateDecimal(row.price || 0).toNumber() === 0)
    if (invalidArrayData.length > 0)
        return errorMsg('Category, Description, and Price is required.')
    if (!wallet)
        return errorMsg('Wallet is required.')
    if (!date)
        return errorMsg('Date is required.')

    if (arrayData.filter(row => row.showDiscount && accurateDecimal(row.discount || 0).toNumber() === 0).length > 0)
        return errorMsg('Discount is required.')

    const type = 'expenses'
    let successCount = 0;
    let countErrors = 0;
    let totalAmount = 0;
    let initialWalletBalance = accurateDecimal(walletBalance).toNumber();

    for (const rowData of arrayData) {
        const originalAmount = rowData.price ? accurateDecimal(rowData.price).toNumber() : 0;
        const discount = rowData.discount ? accurateDecimal(rowData.discount).toNumber() : 0;
        const finalAmount = rowData.discount ?
            new Big(originalAmount).minus(new Big(discount)).toNumber() :
            originalAmount;

        totalAmount += finalAmount;
        initialWalletBalance = accurateDecimal(initialWalletBalance).sub(finalAmount).toNumber();

        const data = {
            type: type,
            category: rowData.categoryId,
            description: rowData.description,
            originalAmount: originalAmount,
            discount: discount,
            amount: finalAmount,
            date: convertToTimeStamp(date),
            wallet: wallet,
            walletBalance: initialWalletBalance,
        }

        const result = await addDataModel('transactions', data)
        result.boolean ? successCount++ : countErrors++
    }

    await updateCollectedData(date, type, totalAmount, wallet, initialWalletBalance);

    if (successCount > 0 && countErrors <= 0)
        return successMsg(`Successfully added ${successCount} of ${arrayData.length} expenses.`)
    if (countErrors > 0)
        return errorMsg(`Failed to add expenses. ${countErrors} errors`);

    return errorMsg('Failed to add expenses');
}

// ----------------------------------Bills----------------------------------------
export async function addBills(arrayData, date, wallet, walletBalance) {
    const invalidRows = arrayData.filter(row => !row.categoryId || !row.description || accurateDecimal(row.expected || 0).toNumber() === 0)
    if (invalidRows.length > 0)
        return errorMsg('Category, Description, and Expected Amount is required')
    if (!wallet)
        return errorMsg('Wallet is required')
    if (!date)
        return errorMsg('Date is required')

    const type = 'bills'
    let successCount = 0;
    let countErrors = 0;
    let totalAmount = 0;
    let initialWalletBalance = accurateDecimal(walletBalance).toNumber();

    for (const rowData of arrayData) {
        const amount = accurateDecimal(rowData.amount || 0).toNumber();
        const expected = accurateDecimal(rowData.expected || 0).toNumber();
        totalAmount += amount;
        initialWalletBalance = accurateDecimal(initialWalletBalance).sub(amount).toNumber();

        const data = {
            type: type,
            category: rowData.categoryId,
            description: rowData.description,
            dueDate: convertToTimeStamp(rowData.dueDate),
            expected: expected,
            amount: amount,
            date: convertToTimeStamp(date),
            wallet: wallet,
            walletBalance: initialWalletBalance,
        }

        const result = await addDataModel('transactions', data)
        result.boolean ? successCount++ : countErrors++
    }

    await updateCollectedData(date, type, totalAmount, wallet, initialWalletBalance);
    // await updateData('wallets', wallet, { balance: initialWalletBalance.toNumber() });

    if (successCount > 0 && countErrors <= 0)
        return successMsg(`Successfully added ${successCount} of ${arrayData.length} bills.`)
    if (countErrors > 0)
        return errorMsg(`Failed to add bills. ${countErrors} errors`);

    return errorMsg('Failed to add bills');
}