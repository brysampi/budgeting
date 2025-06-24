import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, where, serverTimestamp, getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { successMsg, errorMsg, getMonthRangeFromInput } from '../firebase/utils';

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
        // Get Multiple Data
        // const userData = querySnapshot.docs.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));

        // Get the first data since i use limit
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

export async function getData(table, setData, isFetching) {
    try {
        const que = query(
            collection(db, table),
            orderBy("date", "desc")
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
export async function getExpensesData(setExpensesData, isFetching) {
    try {
        const que = query(
            collection(db, 'expenses'),
            orderBy("date", "desc")
        );
        const unsubscribe = onSnapshot(que, async (snapshot) => {
            const promises = snapshot.docs.map(async (docSnap) => {
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
        });


        return unsubscribe;
    } catch (error) {
        console.error("Error fetching expenses: ", error);
        throw new Error("Failed to fetch expenses");
    }
}
//--------------------------------------------------------------------
export async function getExpensesTrackerData(setData, isFetching) {
    try {
        const que = query(
            collection(db, 'expensesTracker'),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(que, async (snapshot) => {
            const promises = snapshot.docs.map(async (docSnap) => {
                const docData = docSnap.data();
                if (docData.category) {
                    try {
                        const categoryRef = doc(db, "expenses", docData.category);
                        const categorySnap = await getDoc(categoryRef);

                        if (categorySnap.exists())
                            docData.category = categorySnap.data().category;
                        else
                            docData.category = "Unknown Category";
                    } catch (err) {
                        console.error("Error fetching category:", err);
                        docData.category = "No Data";
                    }
                }

                return {
                    id: docSnap.id,
                    ...docData,
                };
            });

            const resolvedData = await Promise.all(promises);
            // console.log("Fetched Data: ", resolvedData);
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
export async function getTotal(table, inputDate) {
    try {
        const { startOfMonth, endOfMonth } = getMonthRangeFromInput(inputDate);
        const usersRef = collection(db, table);
        const que = query(
            usersRef,
            where("date", ">=", startOfMonth),
            where("date", "<=", endOfMonth)
            // where("username),
            // where("password", "==", password),
            // limit(1)
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
        // console.log(resolvedData)
        return resolvedData;
        // const query = querySnapshot.forEach((test) => {
        //     return {
        //         id: test.id,
        //         ...test.data(),
        //     }
        // })
        // console.log(query)
        // return query;
    } catch (error) {
        console.error("Error fetching: ", error);
        return [];
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