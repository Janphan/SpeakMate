import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function signUpUser(email, password, name) {
    const auth = getAuth();
    const db = getFirestore();
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Optionally update display name in Firebase Auth profile
    await updateProfile(user, { displayName: name });

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        email: user.email,
        name: name,
        createdAt: serverTimestamp(),
    });

    return user;
}