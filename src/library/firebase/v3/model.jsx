import { collection, onSnapshot, orderBy, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { getUserID, errorMsg, successMsg } from "../../utils";

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