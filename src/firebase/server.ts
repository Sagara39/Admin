import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let app;
if (!getApps().length) {
    try {
        app = initializeApp();
    } catch (e) {
        app = initializeApp(firebaseConfig as FirebaseOptions);
    }
} else {
    app = getApp();
}


export const firestore = getFirestore(app);
