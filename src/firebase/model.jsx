import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, where, Timestamp, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

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