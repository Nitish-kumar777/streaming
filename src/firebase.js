import { initializeApp } from "firebase/app";
import { getDatabase , ref, set, get} from "firebase/database";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCBmiSF8QWrL9KUnoutSb628GE_66aLF4",
    authDomain: "animestreaming-13fed.firebaseapp.com",
    projectId: "animestreaming-13fed",
    storageBucket: "animestreaming-13fed.firebasestorage.app",
    messagingSenderId: "768961740086",
    appId: "1:768961740086:web:8261da2d24842c3d644797",
    measurementId: "G-R67C1CK1G7",
    databaseURL: "https://animestreaming-13fed-default-rtdb.asia-southeast1.firebasedatabase.app/"
};


// Initialize Firebase App (ensure it’s not re-initialized)
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


export { db, ref, set, get };
