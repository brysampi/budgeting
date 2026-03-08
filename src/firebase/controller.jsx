import { serverTimestamp } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { successMsg, errorMsg, getUserID, convertToTimeStamp, convertToDate, componentIcons } from '../firebase/utils';
import {
    addData, updateData, getDataSingle, deleteData, getData, getUser, getAllData, getAllDataRealtime, getDataById, getAllDataActiveRealTime,
    getDataRealTime,
    //  getExpensesTrackerDataRealTime, 
    getDataCategoryRealTime,
    getBillsDataRealTime, getBillsExtensionByBills,
    getExpensesDataRealTime, getExpensesDataRealTime_v2, getExpensesDataRealTime_extension, getExtensionByExpenses,
    getCollectedDataRealTime,
    getSavingsDataRealTime,
    deleteAllData,
    getAllTransactionsRealTime,
} from '../firebase/model';

export async function checkStaticData(inputDate) {
    const getDataCollected = await getData('collectedData', inputDate)
    console.log(getDataCollected)

}

export async function login(user, password) {
    try {
        const response = await getUser(user, password);
        if (response && response.id) {
            for (let key in response) {
                Cookies.set(key, response[key]);
                // console.log(`Setting cookie: ${key} = ${response[key]}`);
            }
            Cookies.set('logged_status', true);
            return successMsg('Login successful', response);
        } else
            return errorMsg('Login failed. Please check your username and password.');

    } catch (error) {
        return errorMsg('An error occurred during login');
    }

}
// -------------------------- Collected Data Navbar -----------------------------------
// export async function getCollectedDataByMonthRealTime_controller(inputDate, setData, isFetching) {
//     await getCollectedDataByMonthRealTime('collectedData', inputDate, setData, isFetching)
// }
// -------------------------- Collected Data -----------------------------------
export async function getCollectedDataRealTimeController(setData, isFetching) {
    await getCollectedDataRealTime('collectedData', setData, isFetching)
}
export async function collectedData_v2(inputDate, wallet, formType = null, value = 0) {
    try {
        const getDataCollected = await getDataSingle('collectedData', inputDate)
        // console.log('getDataCollected: ', getDataCollected)
        if (!getDataCollected) {
            const data = {
                remainingIncome: 0,
                totalIncome: 0,
                totalSavings: 0,
                totalBills: 0,
                totalExpenses: 0,
                wallet: wallet,
                date: convertToTimeStamp(inputDate),
            }
            const addCollect = await addData('collectedData', data)
            console.log('addCollect: ', addCollect)
            return data;
        }
        else {
            if (formType == 'wallet') {
                console.log('Form is already have data, this is not for updating collected data.')
                return successMsg('Form is already have data, this is not for updating collected data.')
            } else {
                const data = {
                    remainingIncome: getDataCollected.remainingIncome,
                    totalIncome: getDataCollected.totalIncome,
                    totalSavings: getDataCollected.totalSavings,
                    totalBills: getDataCollected.totalBills,
                    totalExpenses: getDataCollected.totalExpenses,
                    wallet: wallet,
                }
                if (formType == 'income') {
                    data.totalIncome = getDataCollected.totalIncome + value
                    data.remainingIncome = getDataCollected.remainingIncome + value
                }
                if (formType == 'bills') {
                    data.totalBills = getDataCollected.totalBills + value
                    data.remainingIncome = getDataCollected.remainingIncome - value
                }
                if (formType == 'expensesTracker') {
                    data.totalExpenses = getDataCollected.totalExpenses + value
                    data.remainingIncome = getDataCollected.remainingIncome - value
                }
                if (formType == 'savingsTracker') {
                    data.totalSavings = getDataCollected.totalSavings + value
                    data.remainingIncome = getDataCollected.remainingIncome - value
                }

                if (Object.keys(data).length > 0) {
                    // console.log('Object HAS data. Data Found.')
                    const response = await updateData('collectedData', getDataCollected.id, data)
                    // console.log('updateData: ', updateData)
                    return response;
                } else {
                    console.log('Nothing to update.')
                    return successMsg('Nothing to update.')
                }
            }
        }
    } catch (error) {
        console.log(error)
        return errorMsg('An error occurred during login');
    }
}
export async function collectedData(inputDate) {
    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    let totalIncomeData = 0, totalBillsData = 0, totalExpensesData = 0, totalSavingsData = 0;
    let remainingIncomeData = 0;
    const databaseTable = ['income', 'bills', 'expensesTracker', 'savingsTracker'];
    try {
        for (const databaseItem of databaseTable) {
            const fetch = await getData(databaseItem, inputDate)
            fetch.forEach(data => {
                if (databaseItem == 'income')
                    totalIncomeData += data.amount

                if (databaseItem == 'bills')
                    totalBillsData += data.actual

                if (databaseItem == 'expensesTracker')
                    totalExpensesData += data.amount

                if (databaseItem == 'savingsTracker')
                    totalExpensesData += data.amount
            })
        }

        remainingIncomeData = totalIncomeData - (totalBillsData + totalExpensesData + totalSavingsData);

        const data = {
            remainingIncome: remainingIncomeData,
            totalIncome: totalIncomeData,
            totalSavings: totalSavingsData,
            totalBills: totalBillsData,
            totalExpenses: totalExpensesData,
            date: convertToTimeStamp(inputDate),
            user: getUserID(),
        }
        console.log(data)
        return successMsg('Data Collected Successfully.', data)
    }
    catch (error) {
        console.log(error)
        return errorMsg('check console for error.')
    }
}
export async function checkCollectedData(table, inputDate) {
    const getDataCollected = await getData(table, inputDate)
    console.log('testtt: ', getDataCollected)
    if (getDataCollected.length === 0 || getDataCollected.length < 1 || !getDataCollected)
        return false
    else
        return true
}

export async function addCollectedData(inputDate, arrayData) {
    const addReturn = await addData('collectedData', arrayData)
    // await updateCollectedData(inputDate)
    return addReturn;
}

export async function creteCollectedData(inputDate) {
    try {
        // console.log('inputDate: ', inputDate)
        const checked = await checkCollectedData('collectedData', inputDate);
        // console.log('checked: ', !checked)
        if (!checked) {
            const collect = await collectedData(inputDate);
            // console.log('collect: ', collect)
            if (collect.status === 'success') {
                const addCollect = await addCollectedData(inputDate, collect.data)

                // Dito kana open yung month ng na select


                // console.log('addCollect: ', addCollect)
                // const expensesDefault = await getAllData('expensesDefault', inputDate);
                // expensesDefault.forEach(async (exDefault) => {
                //     await addData('expenses', {
                //         category: exDefault.description,
                //         budget: exDefault.budget,
                //         date: convertToTimeStamp(inputDate),
                //         defaultCreatedId: exDefault.id,
                //         user: getUserID(),
                //     })
                // })
                // Object.entries(expensesDefault).forEach(async ([key, value]) => {
                //     await addData('expenses', {
                //         category: key,
                //         budget: value,
                //         date: convertToTimeStamp(inputDate),
                //         user: getUserID(),
                //     })
                // })
                // const addReturn = await addData('expenses', data)
                // addCollect.status = 'wew'
                return addCollect;
            }
            console.log('Failed to Add Data in Controller.')
            return errorMsg('check console for error.')
        }
        console.log('Already Have Data.')
        return successMsg('Already Have Data.')
    } catch (error) {
        console.error('Error in creteCollectedData:', error);
        return errorMsg('An error occurred. Check console for details.');
    }
}
export async function updateCollectedData(inputDate) {
    const getDataCollected = await getData('collectedData', inputDate)
    if (getDataCollected.length === 0 || getDataCollected.length < 1 || !getDataCollected) {
        console.log('No Data Found.')
        return errorMsg('No Data Found.')
    }

    const collect = await collectedData(inputDate);
    if (collect) {
        const updateReturn = await updateData('collectedData', getDataCollected[0].id, collect);
        return successMsg('Successfully Updated.', updateReturn);
    }
    console.log('Failed to Add Data in Controller.')
    return errorMsg('check console for error.')
}
// -------------------------- Income -----------------------------------
export async function income(arrayData) {
    if (arrayData.description === '' || arrayData.expected === 0)
        return errorMsg('Please fill up all fields.')

    if (arrayData.expected <= 0)
        return errorMsg("expected can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        description: arrayData.description,
        expected: arrayData.expected,
        amount: arrayData.amount,
        wallet: arrayData.wallet,
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('income', data)
    updateCollectedData(arrayData.date)
    return addReturn
}
// -------------------------- Savings -----------------------------------

// -------------------------- Savings-----------------------------------
export async function savings(arrayData) {
    if (arrayData.category === '' || arrayData.target === 0)
        return errorMsg('Please fill up all fields.')

    if (arrayData.target <= 0)
        return errorMsg("Amount Can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')

    const data = {
        category: arrayData.category,
        description: !arrayData.description ? '' : arrayData.description,
        target: arrayData.target,
        status: !arrayData.status ? 'active' : arrayData.status,
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('savings', data)
    updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
}
export async function getSavings(inputDate, setSavingsData, isFetching, dropdownData = false) {
    try {
        await getSavingsDataRealTime(inputDate, setSavingsData, isFetching, dropdownData);
    } catch (error) {
        console.error("Error fetching savings in Controller:", error);
    }
}
export async function savingsTracker(arrayData) {

    if (arrayData.category === '' || arrayData.description === '' || arrayData.amount === 0)
        return errorMsg('Please fill up all fields.')

    if (arrayData.amount <= 0)
        return errorMsg("Amount Can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        category: arrayData.category,
        description: arrayData.description,
        amount: arrayData.amount,
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('savingsTracker', data)
    updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
}
export async function getSavingsTracker(inputDate, setExpensesData, isFetching, wallet = '') {
    try {
        const table = {
            main: 'savings',
            tracker: 'savingsTracker'
        }
        await getDataCategoryRealTime(table, inputDate, setExpensesData, isFetching, wallet);
    } catch (error) {
        console.error("Error fetching Expenses Tracker in Controller:", error);
    }
}

// -------------------------- Bills -----------------------------------
export async function bills(arrayData) {
    if (arrayData.description === '' || arrayData.dueDate === '' || arrayData.wallet === '')
        return errorMsg('Please fill up all fields.')

    if (arrayData.budget <= 0)
        return errorMsg("Budget can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')

    const data = {
        description: arrayData.description,
        dueDate: convertToTimeStamp(arrayData.dueDate),
        budget: arrayData.budget,
        // actual: arrayData.actual,
        // status: arrayData.actual !== 0 && arrayData.actual >= arrayData.budget ? 'paid' : 'not_paid',
        date: convertToTimeStamp(arrayData.date),
        // user: getUserID().toString(),
    }

    // if (data.status === 'paid')
    //     data.paidAt = convertToTimeStamp(arrayData.date);

    const addReturn = await addData('bills', data)
    console.log(addReturn)
    if (arrayData.actual && addReturn.status === 'success') {
        const dataExtension = {
            billsId: addReturn.data.id,
            date: convertToTimeStamp(arrayData.date),
            // user: getUserID().toString(),
        }
        if (arrayData.monthlyBudget)
            dataExtension.monthlyBudget = arrayData.monthlyBudget;
        else
            dataExtension.actual = arrayData.actual
        const addReturnExtension = await addData('billsExtension', dataExtension)
        console.log('Bills Extension Message: ', addReturnExtension.message)
    }
    // updateCollectedData(arrayData.date)
    return addReturn
}
export async function getBillsDataRealTimeController(inputDate, setData, isFetching, wallet = '') {
    try {
        await getBillsDataRealTime(inputDate, setData, isFetching);
    } catch (error) {
        console.error(`Error fetching data from ${table} in Controller:`, error);
    }
}

export async function updateBills(updateId, arrayData, formType) {
    if (arrayData.description === '' || arrayData.dueDate === '' || arrayData.wallet === '')
        return errorMsg('Please fill up all fields.')

    if (arrayData.budget <= 0)
        return errorMsg("Budget can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')

    const data = {
        description: arrayData.description,
        dueDate: arrayData.dueDate,
        // budget: arrayData.budget,
        wallet: arrayData.wallet,
    }
    if (arrayData.budget)
        data.budget = arrayData.budget;
    // if update status is 1, it means there was an error updating the extension
    let updateStatus = 0;

    const extensionData = await getBillsExtensionByBills(updateId, arrayData.date);
    const getBillsData = await getDataById('bills', updateId);

    const dataExtension = {}

    if (formType === 'bills') {
        if (getBillsData.data.budget !== arrayData.budget)
            dataExtension.monthlyBudget = arrayData.monthlyBudget;
        dataExtension.actual = arrayData.actual;
    }
    else {
        dataExtension.monthlyBudget = arrayData.monthlyBudget;
    }

    if (extensionData) {
        const updateResultExtension = await updateData('billsExtension', extensionData.id, dataExtension);
        console.log('Update Result Extension: ', updateResultExtension)
        if (updateResultExtension.status === 'error')
            updateStatus = 1;
    } else {
        dataExtension.billsId = updateId;
        dataExtension.date = convertToTimeStamp(arrayData.date);

        const addReturnExtension = await addData('billsExtension', dataExtension)
        console.log('Bills Extension Message: ', addReturnExtension.message)
        if (addReturnExtension.status === 'error')
            updateStatus = 1;
    }

    if (updateStatus != 1) {
        const updateResult = await updateData('bills', updateId, data);
        console.log('Update Result: ', updateResult)
        return updateResult;
    }

    return errorMsg('Error updating bills.')

}
export async function getBillsExtension(billsId, date) {
    try {
        await getBillsExtensionByBills(billsId, date);
    } catch (error) {
        console.error(`Error fetching data from ${table} in Controller:`, error);
    }
}
export async function addBillsExtension(arrayData) {

}
// -------------------------- Expenses -----------------------------------
export async function expenses(arrayData) {
    if (arrayData.description === '' || arrayData.budget === 0 || arrayData.date === '')
        return errorMsg('Please fill up all fields.')

    if (arrayData.budget <= 0)
        return errorMsg("Budget can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        category: arrayData.category,
        budget: arrayData.budget,
        status: "active",
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('expenses', data)
    console.log(addReturn.status)
    if (addReturn.status == 'success' && arrayData.monthlyBudget) {
        // console.log(addReturn.message, addReturn)
        // Add Extension if Monthly Budget is Provided
        // if (arrayData.monthlyBudget) {
        const subData = {
            expensesId: addReturn.data.id,
            monthlyBudget: arrayData.monthlyBudget,
            date: convertToTimeStamp(arrayData.date),
            user: getUserID(),
        }
        const subReturn = await addData('expensesExtension', subData)
        console.log(subReturn.message, subReturn)
        // }
    }
    updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
}
export async function getExpenses(inputDate, setExpensesData, isFetching, dropdownData = false) {
    // const handleSetData = (data) => {
    //     const enrichedData = data.map(cat => ({
    //         ...cat,
    //         ...componentIcons('expenses', cat.icon || cat.iconName, cat.iconBackground)
    //     }));
    //     setExpensesData(enrichedData);
    // };
    try {
        await getExpensesDataRealTime_v2(inputDate, setExpensesData, isFetching, dropdownData)
    } catch (error) {
        console.error("Error fetching expenses in Controller:", error);
    }
}
export async function getExpenses_v2(inputDate, setExpensesData, isFetching, dropdownData = false) {
    try {
        await getExpensesDataRealTime_extension(inputDate, setExpensesData, isFetching, dropdownData)
        // if (dropdownData)
        //     await getExpensesDataRealTime_v2(setExpensesData, isFetching)
        // else
        //     await getExpensesDataRealTime(inputDate, setExpensesData, isFetching)
    } catch (error) {
        console.error("Error fetching expenses in Controller:", error);
    }
}
// -------------------------- Expenses Tracker -----------------------------------
export async function expensesTracker(arrayData) {
    if (arrayData.description === '' || arrayData.category === '' || arrayData.amount === 0)
        return errorMsg('Please fill up all fields.')

    if (arrayData.amount <= 0)
        return errorMsg("Amount Can't be negative.")

    if (arrayData.expected <= 0)
        return errorMsg("expected can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')

    const discountPrice = !arrayData.discount || arrayData.discount === '' ? 0 : arrayData.discount;
    const data = {
        category: arrayData.category,
        description: arrayData.description,
        price: arrayData.price,
        discount: discountPrice,
        amount: arrayData.price - discountPrice,
        date: arrayData.date === null ? serverTimestamp() : convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    // console.log('date to ano ba asdsadasd : ', arrayData.date)
    // console.log(data)
    // console.log(convertToDate(data.date))
    const addReturn = addData('expensesTracker', data)
    updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
}
export async function getExpensesTracker(inputDate, setExpensesData, isFetching, wallet = '') {
    try {
        const table = {
            main: 'expenses',
            tracker: 'expensesTracker'
        }
        await getDataCategoryRealTime(table, inputDate, setExpensesData, isFetching, wallet);
    } catch (error) {
        console.error("Error fetching Expenses Tracker in Controller:", error);
    }
}
// -------------------------- Expenses Default -----------------------------------
export async function expensesDefault(arrayData) {
    if (arrayData.description === '' || arrayData.budget === 0 || arrayData.date === '')
        return errorMsg('Please fill up all fields.')

    if (arrayData.budget <= 0)
        return errorMsg("Budget can't be negative.")

    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')

    const data = {
        description: arrayData.description,
        budget: arrayData.budget,
        date: convertToTimeStamp(arrayData.date),
        user: getUserID(),
    }
    const addReturn = await addData('expensesDefault', data)
    // updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
}

// -------------------------- Expenses Update -----------------------------------
export async function updateExpenses_extension(expensesId, arrayData) {
    try {
        let { date, monthlyBudget, ...removeDateData } = arrayData;
        // console.log('updateExpenses_extension', monthlyBudget)
        const expensesData = await getDataById('expenses', expensesId)
        if (expensesData.status !== 'success') {
            console.error('Failed to fetch Expenses data:', expensesData);
            return errorMsg('Failed to fetch Expenses data. Check console for error.');
        }
        const extensionData = await getExtensionByExpenses(expensesId, date)


        const expensesUpdateResult = await updateData('expenses', expensesId, removeDateData);
        if (expensesUpdateResult.status !== 'success') {
            return errorMsg('Failed to update Expenses. Check console for error.');
        }
        // Used For Expenses Settings Only
        // Only Expenses Settings will Have Budget Data
        if (arrayData.budget !== undefined && arrayData.budget !== null) {
            if (!extensionData) {
                if (monthlyBudget === null) {
                    console.log('Monthly Budget is null, skipping extension update.');
                    return successMsg('Updated Successfully', {
                        description: 'Extension Update',
                        status: 'error',
                        message: 'Monthly Budget is null'
                    });
                }
                if (expensesData.data.budget == monthlyBudget) {
                    console.log('Budget is same as Monthly Budget, skipping extension update.');
                    return successMsg('Updated Successfully', {
                        description: 'Extension Update',
                        status: 'error',
                        message: 'Budget is same as Monthly Budget'
                    });
                }
                if (monthlyBudget == 0 || monthlyBudget === '0') {
                    console.log('Monthly Budget is 0, skipping extension update.');
                    return successMsg('Updated Successfully', {
                        description: 'Extension Update',
                        status: 'error',
                        message: 'Monthly Budget is 0'
                    });
                }
            }
            if (expensesData.data.budget == monthlyBudget) {
                console.log('Budget is same as Monthly Budget, skipping extension update.');
                return successMsg('Updated Successfully', {
                    description: 'Extension Update',
                    status: 'error',
                    message: 'Budget is same as Monthly Budget'
                });
            }

        }
        if (!extensionData) {
            if (expensesData.data.budget == monthlyBudget) {
                console.log('Budget is same as Monthly Budget, skipping extension update.');
                return successMsg('Updated Successfully', {
                    description: 'Extension Update',
                    status: 'error',
                    message: 'Budget is same as Monthly Budget'
                });
            }
            if (monthlyBudget === null) {
                console.log('Monthly Budget is null, skipping extension update.');
                return successMsg('Updated Successfully', {
                    description: 'Extension Update',
                    status: 'error',
                    message: 'Monthly Budget is null'
                });
            }
        } else {
            if (monthlyBudget === null || expensesData.data.budget == monthlyBudget) {
                monthlyBudget = 0;
                console.log('Set Monthly Budget to 0 as it is null or same as existing budget. aaaaa');
            }
            if (extensionData.monthlyBudget == monthlyBudget) {
                console.log('Monthly Budget is same as existing, skipping extension update.');
                return successMsg('Updated Successfully', {
                    description: 'Extension Update',
                    status: 'error',
                    message: 'Monthly Budget is same as existing'
                });
            }
        }

        if (!extensionData) {
            const addExtension = {
                expensesId,
                monthlyBudget,
                date: convertToTimeStamp(date),
                user: getUserID(),
            };
            const addResult = await addData('expensesExtension', addExtension);
            updateCollectedData(date);
            return successMsg('Successfully Added Monthly Budget.', { id: addResult.data.id });
        }

        const extensionUpdateResult = await updateData('expensesExtension', extensionData.id, { monthlyBudget });
        updateCollectedData(date);

        return extensionUpdateResult.status === 'success'
            ? successMsg('Successfully Updated Monthly Budget.', { id: extensionUpdateResult.data.id })
            : errorMsg('Failed to update Monthly Budget. Check console for error.');
    } catch (error) {
        console.error('Error in updateExpensesExtension:', error);
        return errorMsg('Unexpected error occurred. Check console for details.');
    }
}
export async function updateExpenses_extension_1(extensionId, monthlyBudget) {
    const extensionUpdateResult = await updateData('expensesExtension', extensionId, { monthlyBudget });
    updateCollectedData(date);

    return extensionUpdateResult.status === 'success'
        ? successMsg('Successfully Updated Monthly Budget.', { id: extensionUpdateResult.data.id })
        : errorMsg('Failed to update Monthly Budget. Check console for error.');
}
// export async function getExpensesExtension(expensesId, inputDate) {
//     await getExtensionByExpenses(expensesId, inputDate)
// }
export async function expensesTrackerUpdate(id, arrayData, paramMonth) {
    const discountPrice = !arrayData.discount || arrayData.discount === '' ? 0 : arrayData.discount;
    const data = {
        category: arrayData.category,
        description: arrayData.description,
        price: arrayData.price,
        discount: discountPrice,
        amount: arrayData.price - discountPrice,
        wallet: arrayData.wallet,
    }
    if (arrayData.date)
        data.date = convertToTimeStamp(arrayData.date)
    // data.date = convertToTimeStamp('2025-07-10')
    const updateResult = await updateData('expensesTracker', id, data)
    if (updateResult.status !== 'success') {
        console.log('Failed to update data.');
        return errorMsg('Failed to update data. Check console for error.');
    }
    console.log('Data updated successfully.');
    updateCollectedData(paramMonth);
    return successMsg('Successfully Updated.', updateResult);
}
// -------------------------- Wallets -----------------------------------
export async function addWallets(arrayData) {
    if (arrayData.description === '' || arrayData.date === '')
        return errorMsg('Please fill up all fields.')
    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')
    const data = {
        name: arrayData.name,
        date: convertToTimeStamp(arrayData.date),
        status: 'active',
        user: getUserID(),
    }
    const addReturn = await addData('wallets', data)
    updateCollectedData(arrayData.date)
    return successMsg('Successfully Added.', addReturn)
}
// -------------------------------- Get Data ------------------------------------
export async function getDataController(table, inputDate) {
    try {
        return await getData(table, inputDate);
    } catch (error) {
        console.error(`Error fetching data from ${table} in Controller:`, error);
    }
}
export async function getAllDataController(table, debug = false) {
    try {
        return await getAllData(table, debug);
        // const test =  await getAllData(table, debug);
        // console.log('getAllDataController', test);
    } catch (error) {
        console.error(`Error fetching data from ${table} in Controller:`, error);
    }
}
export async function getAllDataRealTimeController(table, setExpensesDefaultData, isFetching) {
    try {
        await getAllDataRealtime(table, setExpensesDefaultData, isFetching)
    } catch (error) {
        console.error("Error fetching Expenses Default in Controller:", error);
    }
}
export async function getDataRealTimeController(table, inputDate, setData, isFetching, wallet = '') {
    try {
        // console.log('getDataRealTimeController', wallet)
        await getDataRealTime(table, inputDate, setData, isFetching, wallet);
    } catch (error) {
        console.error(`Error fetching data from ${table} in Controller:`, error);
    }
}
export async function getAllDataActiveRealTimeController(table, setData, isFetching) {
    try {
        return await getAllDataActiveRealTime(table, setData, isFetching);
    } catch (error) {
        console.error(`Error fetching data from ${table} in Controller:`, error);
    }
}


export function getAllTransactions(inputDate, setData, wallet = '') {
    const handleSetData = (data) => {
        const enrichedData = data.map(t => ({
            ...t,
            ...componentIcons(t.type)
        }));
        setData(enrichedData);
    };
    return getAllTransactionsRealTime(inputDate, handleSetData, wallet);
}
// --------------------------------------------------------------------
// Not Used Anymore
export async function allUpdate(table, id, arrayData) {
    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')

    const { date, ...removeDateData } = arrayData;
    const updateResult = await updateData(table, id, removeDateData)
    if (updateResult.status !== 'success') {
        console.log('Failed to update data.');
        return errorMsg('Failed to update data. Check console for error.');
    }
    console.log('Data updated successfully.');
    updateCollectedData(arrayData.date);
    return successMsg('Successfully Updated.', updateResult);
}
export async function updateDataController(table, updateId, arrayData) {
    if (!getUserID())
        return errorMsg('No LoggedIn User Found.')

    let { date, ...removeDateData } = arrayData;
    console.log('updateDataController', table, updateId, removeDateData)
    const updateResult = await updateData(table, updateId, removeDateData);
    if (updateResult.status !== 'success') {
        console.log('Failed to update data.');
        return updateResult
    }
    console.log('Data updated successfully.', removeDateData);
    await updateCollectedData(date);
    return updateResult
}
// --------------------------------------------------------------------
export async function logout() {
    Object.keys(Cookies.get()).forEach(cookieName => {
        Cookies.remove(cookieName);
    });
    return successMsg('Logout successful');
}
export async function deleteDataController(table, id) {
    // await deleteData(table, id).then((response) => {
    //     if (response && response.status === 'success')
    //         console.log('Data deleted successfully.');
    //     else
    //         console.log('Failed to delete data.');

    // }).catch((error) => {
    //     console.error('Error deleting data:', error);
    // });
    console.log('Delete is Working But Will Not Delete in Production.');
}
export async function transferOldBills() {
    const billsData = await getAllData('bills');
    billsData.forEach(async (bill) => {
        console.log('Fetching...')
        console.log('Bill: ', convertToDate(bill.date))
        const extensionData = await getBillsExtensionByBills(bill.id, convertToDate(bill.date));
        const dataExtension = {
            actual: bill.actual,
        }

        if (extensionData) {
            const updateResultExtension = await updateData('billsExtension', extensionData.id, dataExtension);
            console.log('Update Result Extension: ', updateResultExtension)
        } else {
            dataExtension.billsId = bill.id;
            dataExtension.date = convertToTimeStamp(convertToDate(bill.date));

            const addReturnExtension = await addData('billsExtension', dataExtension)
            console.log('Bills Extension Message: ', addReturnExtension.message)
        }


        // const dataExtension = {
        //     billsId: bill.id,
        //     date: convertToTimeStamp(bill.date),
        //     // user: getUserID().toString(),
        // }
        // if (bill.monthlyBudget)
        //     dataExtension.monthlyBudget = bill.monthlyBudget;
        // else
        //     dataExtension.actual = bill.actual
        // const addReturnExtension = await addData('billsExtension', dataExtension)
        // console.log('Bills Extension Message: ', addReturnExtension.message)
    })
}
export async function deleteAllDataController() {
    try {
        console.log('Delete All Data Controller')
        const userID = getUserID();
        if (!userID)
            return errorMsg('No LoggedIn User Found.')

        const tables = [
            'income',
            'bills',
            'billsExtension',
            'expenses',
            'expensesExtension',
            'expensesTracker',
            'savings',
            'savingsTracker',
            'wallets',
            'collectedData',
            'expensesDefault'
        ];

        const promises = tables.map(table => deleteAllData(table, userID));
        await Promise.all(promises);
        console.log('All data deleted successfully.')
        return successMsg('All data deleted successfully.');
    } catch (error) {
        console.error("Error in deleteAllDataController:", error);
        return errorMsg('Failed to delete all data. Check console for error.');
    }
}
export function unsubscribeForAll(unsubPromise) {
    return () => {
        // console.log('Unsubscribing from all data...');
        if (unsubPromise && typeof unsubPromise.then === 'function') {
            unsubPromise.then(unsub => {
                if (typeof unsub === 'function') {
                    unsub();
                }
            });
        }
    };
}