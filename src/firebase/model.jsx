import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, where, Timestamp, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { successMsg, errorMsg } from '../firebase/utils';

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

export async function getData(table, setIncomeData, isFetching) {
    // console.log('Fetching data from table:', table);
    try {
        const que = query(
            collection(db, table),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(que, (snapshot) => {
            const newData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setIncomeData(newData);
            isFetching(false);
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error fetching data: ", error);
        throw new Error("Failed to fetch data");
    }
}