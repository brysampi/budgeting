import {
    addDoc, collection, getDocs, limit, onSnapshot, updateDoc,
    orderBy, query, where, serverTimestamp, getDoc, doc, deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { successMsg, errorMsg, getMonthRangeFromInput, getUserID, convertToDate, convertToTimeStamp } from '../firebase/utils';

export async function getUser(user, password) {
    try {
        const usersRef = collection(db, "users");
        const que = query(
            usersRef,
            where("username", "==", user),
            where("password", "==", password),
            limit(1)
        );
        const querySnapshot = await getDocs(que);

        if (querySnapshot.empty) {
            console.log("No users found");
            return [];
        }

        const doc = querySnapshot.docs[0];
        const userData = {
            id: doc.id,
            ...doc.data(),
        };

        return userData;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function addData(table, arrayData) {
    try {
        const IdStored = arrayData.user;
        if (IdStored) {
            const collectionRef = collection(db, table)
            await addDoc(collectionRef, {
                ...arrayData,
                user: IdStored,
                createdAt: serverTimestamp()
                // createdAt: convertToTimeStamp('2025-07-10'),
            })
            return successMsg('Successfully Added.')
        }
        else
            return errorMsg('No LoggedIn User Found.')
    } catch (error) {
        console.log(error)
        return errorMsg('check console for error.')
    }
}

export async function getDataRealTime(table, inputDate, setData, isFetching) {
    try {
        const { startOfMonth, endOfMonth } = getMonthRangeFromInput(inputDate);
        const que = query(
            collection(db, table),
            where("user", "==", getUserID()),
            where("date", ">=", startOfMonth),
            where("date", "<=", endOfMonth),
            orderBy("date", "desc"),
            orderBy("createdAt", "desc"),
        );
        const unsubscribe = onSnapshot(que, async (snapshot) => {
            const promises = snapshot.docs.map(async (docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            }));
            const resolvedData = await Promise.all(promises);
            setData(resolvedData);
            isFetching(false);
            return resolvedData;
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error fetching data: ", error);
        throw new Error("Failed to fetch data");
    }
}
// ------------------------------- Savings -------------------------------------
export async function getSavingsDataRealTime(inputDate, setData, isFetching, dropdownData) {
    // console.log("Fetching savings tracker data for month: ", inputDate);
    try {
        // const { startOfMonth, endOfMonth } = getMonthRangeFromInput(inputDate);
        const usersRef = collection(db, 'savings');
        const que = query(usersRef,
            where("user", "==", getUserID()),
            // where("date", ">=", startOfMonth),
            // where("date", "<=", endOfMonth),
            // where("status", "==", "active"),
            orderBy("date", "desc"),
            orderBy("createdAt", "desc"),
        )
        const unsubscribe = onSnapshot(que, async (snapshot) => {
            const promises = snapshot.docs.map(async (docSnap) => {
                // console.log(dropdownData)
                if (dropdownData === true)
                    return {
                        id: docSnap.id,
                        ...docSnap.data(),
                    };
                const docData = docSnap.data();
                if (!docSnap.exists()) {
                    console.log("No such document!");
                    return null;
                } else {
                    const savingsTrackerRef = collection(db, "savingsTracker");
                    const que = query(
                        savingsTrackerRef,
                        where("category", "==", docSnap.id)
                    );
                    const querySnapshot = await getDocs(que);
                    querySnapshot.docs.map((doc) => {
                        if (!docData.actual)
                            docData.actual = 0;
                        docData.actual += doc.data().amount;
                    });
                    return {
                        id: docSnap.id,
                        ...docData,
                    };
                }
            })
            const resolvedData = await Promise.all(promises);
            // console.log("Resolved Data: ", resolvedData);
            setData(resolvedData);
            isFetching(false);
            return resolvedData;
        })
        // console.log("Fetching savings data for month: ", inputDate);
    } catch (error) {
        console.log("Error fetching savings data: ", error);
        // throw new Error("Failed to fetch savings tracker data");
    }
}
// ------------------------------- Expenses -------------------------------------
export async function getExpensesDataRealTime(inputDate, setExpensesData, isFetching, dropdownData) {
    try {
        const { startOfMonth, endOfMonth } = getMonthRangeFromInput(inputDate);
        const que = query(
            collection(db, 'expenses'),
            where("user", "==", getUserID()),
            where("date", ">=", startOfMonth),
            where("date", "<=", endOfMonth),
            orderBy("date", "desc"),
            orderBy("createdAt", "desc"),
        );
        const unsubscribe = onSnapshot(que, async (snapshot) => {
            const promises = snapshot.docs.map(async (docSnap) => {
                if (dropdownData === true)
                    return {
                        id: docSnap.id,
                        ...docSnap.data(),
                    };
                const docData = docSnap.data();
                if (!docSnap.exists()) {
                    console.log("No such document!");
                    return null;
                } else {
                    const expensesTrackerRef = collection(db, "expensesTracker");
                    const que = query(
                        expensesTrackerRef,
                        where("category", "==", docSnap.id)
                    );
                    const querySnapshot = await getDocs(que);
                    querySnapshot.docs.map((doc) => {
                        if (!docData.actual)
                            docData.actual = 0;
                        docData.actual += doc.data().amount;
                    });
                    return {
                        id: docSnap.id,
                        ...docData,
                    };
                }
            });
            const resolvedData = await Promise.all(promises);
            // console.log("Resolved Data: ", resolvedData);
            setExpensesData(resolvedData)
            isFetching(false);
            return resolvedData
        });


        return unsubscribe;
    } catch (error) {
        console.error("Error fetching expenses: ", error);
        throw new Error("Failed to fetch expenses");
    }
}
export async function getExpensesDataRealTime_v2(inputDate,setExpensesData, isFetching, dropdownData) {
    try {
        const que = query(
            collection(db, 'expenses'),
            where("user", "==", getUserID()),
            orderBy("createdAt", "desc"),
        );
        const unsubscribe = onSnapshot(que, async (snapshot) => {
            const promises = snapshot.docs.map(async (docSnap) => {
                const { startOfMonth, endOfMonth } = getMonthRangeFromInput(inputDate);
                if (dropdownData === true)
                    return {
                        id: docSnap.id,
                        ...docSnap.data(),
                    };
                const docData = docSnap.data();
                if (!docSnap.exists()) {
                    console.log("No such document!");
                    return null;
                } else {
                    const expensesTrackerRef = collection(db, "expensesTracker");
                    const que = query(
                        expensesTrackerRef,
                        where("category", "==", docSnap.id),
                         where("date", ">=", startOfMonth),
                        where("date", "<=", endOfMonth),
                    );
                    const querySnapshot = await getDocs(que);
                    querySnapshot.docs.map((doc) => {
                        if (!docData.actual)
                            docData.actual = 0;
                        docData.actual += doc.data().amount;
                    });
                    return {
                        id: docSnap.id,
                        ...docData,
                    };
                }
            });
            const resolvedData = await Promise.all(promises);
            // console.log("Resolved Data: ", resolvedData);
            setExpensesData(resolvedData)
            isFetching(false);
            return resolvedData
        });


        return unsubscribe;
    } catch (error) {
        console.error("Error fetching expenses: ", error);
        throw new Error("Failed to fetch expenses");
    }
}
export async function getDataCategoryRealTime(table, inputDate, setData, isFetching) {
    try {
        const { startOfMonth, endOfMonth } = getMonthRangeFromInput(inputDate);
        const que = query(
            collection(db, table.tracker),
            where("user", "==", getUserID()),
            where("date", ">=", startOfMonth),
            where("date", "<=", endOfMonth),
            orderBy("date", "desc"),
            orderBy("createdAt", "desc"),
        );

        const unsubscribe = onSnapshot(que, async (snapshot) => {
            let groupedByDay = []
            const promises = snapshot.docs.map(async (docSnap) => {
                const docData = docSnap.data();
                if (!docSnap.exists()) {
                    console.log("No such document!");
                    return null;
                } else {
                    const dayCreated = !docData.createdAt ? null : (docData.createdAt).toDate().getDate()
                    // console.log(dayCreated)

                    if (docData.category) {
                        try {
                            const categoryRef = doc(db, table.main, docData.category);
                            const categorySnap = await getDoc(categoryRef);

                            if (categorySnap.exists())
                                docData.categoryName = categorySnap.data().category;
                            else
                                docData.categoryName = "Unknown Category";
                        } catch (err) {
                            console.error("Error fetching category:", err);
                            docData.categoryName = "No Data";
                        }
                    }

                    const datas = {
                        id: docSnap.id,
                        ...docData,
                    };


                    if (!groupedByDay[dayCreated]) {
                        groupedByDay[dayCreated] = [];
                    }
                    groupedByDay[dayCreated].push(datas);
                    return datas;
                }
            });

            const resolvedData = await Promise.all(promises);
            // console.log("grouped ", groupedByDay)
            // console.log("Fetched Data: ", resolvedData);
            setData(groupedByDay);
            isFetching(false);
            return groupedByDay;
        });

        return unsubscribe;
    } catch (error) {
        console.error("Error fetching data: ", error);
        throw new Error("Failed to fetch data");
    }
}
export async function getCollectedDataRealTime(table, setData, isFetching) {
    try {
        const que = query(
            collection(db, table),
            where("user", "==", getUserID()),
            orderBy("date", "desc"),
        );
        const unsubscribe = onSnapshot(que, async (snapshot) => {
            const promises = snapshot.docs.map(async (docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            }));
            const resolvedData = await Promise.all(promises);
            setData(resolvedData);
            isFetching(false);
            return resolvedData;
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error fetching data: ", error);
        throw new Error("Failed to fetch data");
    }
}
export async function getData(table, inputDate) {
    try {
        const { startOfMonth, endOfMonth } = getMonthRangeFromInput(inputDate);
        const usersRef = collection(db, table);
        const que = query(
            usersRef,
            where("user", "==", getUserID()),
            where("date", ">=", startOfMonth),
            where("date", "<=", endOfMonth),
            orderBy("date", "desc"),
            orderBy("createdAt", "desc"),
        );
        const querySnapshot = await getDocs(que);
        // console.log(querySnapshot.docs)
        const promises = querySnapshot.docs.map(async (docSnap) => {
            return {
                id: docSnap.id,
                ...docSnap.data(),
            };
        })
        const resolvedData = await Promise.all(promises);
        return resolvedData;
    } catch (error) {
        console.error("Error fetching: ", error);
        return [];
    }
}
export async function getAllData(table, inputDate) {
    try {
        const { startOfMonth, endOfMonth } = getMonthRangeFromInput(inputDate);
        const usersRef = collection(db, table);
        const que = query(
            usersRef,
            where("user", "==", getUserID()),
            orderBy("createdAt", "asc"),
        );
        const querySnapshot = await getDocs(que);
        // console.log(querySnapshot.docs)
        const promises = querySnapshot.docs.map(async (docSnap) => {
            return {
                id: docSnap.id,
                ...docSnap.data(),
            };
        })
        const resolvedData = await Promise.all(promises);
        return resolvedData;
    } catch (error) {
        console.error("Error fetching: ", error);
        return [];
    }
}
export async function getAllDataRealtime(table, setData, isFetching) {
    try {
        const que = query(
            collection(db, table),
            where("user", "==", getUserID()),
            orderBy("date", "desc"),
            orderBy("createdAt", "desc"),
        );
        const unsubscribe = onSnapshot(que, async (snapshot) => {
            const promises = snapshot.docs.map(async (docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            }));
            const resolvedData = await Promise.all(promises);
            setData(resolvedData);
            isFetching(false);
            return resolvedData;
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error fetching data: ", error);
        throw new Error("Failed to fetch data");
    }
}

// --------------------------------------------------------------------
export async function updateData(table, id, arrayData) {
    try {
        const docRef = doc(db, table, id);
        await updateDoc(docRef, {
            ...arrayData,
            updatedAt: serverTimestamp()
        });
        return successMsg('Successfully Updated.')
    } catch (error) {
        console.log("Error updating data:", error)
        return errorMsg('Failed to update data. Check console for error.')
    }
}
// --------------------------------------------------------------------

export async function deleteData(table, id) {
    try {
        const docRef = doc(db, table, id);
        await deleteDoc(docRef);
        return successMsg('Successfully Deleted.')
    } catch (error) {
        console.error("Error deleting data:", error);
        return errorMsg('Failed to delete data. Check console for error.')
    }
}