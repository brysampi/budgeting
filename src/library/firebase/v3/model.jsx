import { collection, onSnapshot, orderBy, query, where, addDoc, serverTimestamp, getDocs, doc, updateDoc, deleteDoc, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase";
import { getUserID, getMonthRangeFromInput, errorMsg, successMsg } from "../../utils";

export async function addDataModel(table, arrayData, created = serverTimestamp()) {
    try {
        const IdStored = getUserID().toString();
        if (IdStored) {
            const collectionRef = collection(db, table)
            const returnData = await addDoc(collectionRef, {
                ...arrayData,
                user: IdStored,
                createdAt: created
                // createdAt: convertToTimeStamp('2025-08-08')
            })
            // console.log('returnData', returnData)
            return successMsg('Successfully Added.', { id: returnData.id })
        }
        else
            return errorMsg('No LoggedIn User Found.')
    } catch (error) {
        console.log(error)
        return errorMsg('check console for error.')
    }
}
// ----------------------------------Get Function / Real Time Fetch----------------------------------------
export async function getAllDataRealtimeModel(table, setData, isFetching) {
    try {
        const que = query(
            collection(db, table),
            where("user", "==", getUserID()),
            orderBy("createdAt", "desc"),
        );
        // console.log('getUserID()', getUserID())
        const unsubscribe = onSnapshot(que, async (snapshot) => {
            const promises = snapshot.docs.map(async (docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            }));
            const resolvedData = await Promise.all(promises);
            // console.log('resolvedData', resolvedData)
            setData(resolvedData);
            isFetching(false);
            return resolvedData;
        });
        return unsubscribe;
    } catch (error) {
        console.log(error)
        return errorMsg('Failed to fetch data. Check console for error.');
    }
}

export async function getAllDataRealtimeByDateModel(table, setData, isFetching) {
    try {
        const que = query(
            collection(db, table),
            where("user", "==", getUserID()),
            orderBy("date", "desc"),
        );
        // console.log('getUserID()', getUserID())
        const unsubscribe = onSnapshot(que, async (snapshot) => {
            const promises = snapshot.docs.map(async (docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            }));
            const resolvedData = await Promise.all(promises);
            // console.log('resolvedData', resolvedData)
            setData(resolvedData);
            isFetching(false);
            return resolvedData;
        });
        return unsubscribe;
    } catch (error) {
        console.log(error)
        return errorMsg('Failed to fetch data. Check console for error.');
    }
}
// ----------------------------------With Return----------------------------------------
export async function getAllDataModel(table, date = null) {
    try {
        let constraints = [
            where("user", "==", getUserID()),
            orderBy("date", "desc"),
        ];
        if (date) {
            const { startOfMonth, endOfMonth } = getMonthRangeFromInput(date);
            console.log('startOfMonth', startOfMonth)
            console.log('endOfMonth', endOfMonth)
            constraints.push(where("date", "<=", endOfMonth));
            constraints.push(where("date", ">=", startOfMonth));
        }

        const que = query(
            collection(db, table),
            ...constraints
        );
        // console.log('getUserID()', getUserID())
        const snapshot = await getDocs(que);
        const promises = snapshot.docs.map(async (docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
        }));
        const resolvedData = await Promise.all(promises);
        // console.log('resolvedData', resolvedData)
        return successMsg('Successfully retrieved data.', resolvedData);
    } catch (error) {
        console.log(error)
        return errorMsg('Failed to fetch data. Check console for error.');
    }
}
// ----------------------------Update Data----------------------------------------
export async function updateData(table, id, arrayData) {
    try {
        const docRef = doc(db, table, id);
        await updateDoc(docRef, {
            ...arrayData,
            // date: convertToTimeStamp('2025-08-26'),
            // createdAt: convertToTimeStamp('2025-08-26'),
            updatedAt: serverTimestamp()
        });
        console.log("Data updated successfully:", docRef.id);
        return successMsg('Successfully Updated.', { id: docRef.id });
    } catch (error) {
        console.log("Error updating data:", error)
        return errorMsg('Failed to update data. Check console for error.')
    }
}
//---------------------------------------------------
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
export async function deleteAllData(table) {
    try {
        const userID = getUserID();
        if (!userID) {
            return errorMsg('No LoggedIn User Found.');
        }

        const q = query(collection(db, table), where("user", "==", userID));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return successMsg('No data to delete.');
        }

        const deletePromises = querySnapshot.docs.map((docSnap) => deleteDoc(doc(db, table, docSnap.id)));
        await Promise.all(deletePromises);

        return successMsg('Successfully Deleted All Data.');
    } catch (error) {
        console.error("Error deleting all data:", error);
        return errorMsg('Failed to delete all data. Check console for error.');
    }
}
export async function firstLoad(table, setData, isFetching, limitParams = 5, onLastDoc = null) {
    try {
        const que = query(
            collection(db, table),
            where("user", "==", getUserID()),
            orderBy("date", "desc"),
            limit(limitParams),
        );
        // console.log('getUserID()', getUserID())
        const unsubscribe = onSnapshot(que, async (snapshot) => {
            const promises = snapshot.docs.map(async (docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            }));
            const resolvedData = await Promise.all(promises);
            setData(resolvedData);
            isFetching(false);
            if (onLastDoc) onLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);
            return resolvedData;
        });
        return unsubscribe;
    } catch (error) {
        console.log(error)
        return errorMsg('Failed to fetch data. Check console for error.');
    }
}
export async function loadMore(table, lastDoc, limitParams = 5) {
    try {
        const q = query(
            collection(db, table),
            where("user", "==", getUserID()),
            orderBy("date", "desc"),
            startAfter(lastDoc),
            limit(limitParams)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        const newLastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;
        const hasMore = snapshot.docs.length === limitParams;
        return { data, lastDoc: newLastDoc, hasMore };
    } catch (error) {
        console.log(error)
        return { data: [], lastDoc: null, hasMore: false };
    }
}