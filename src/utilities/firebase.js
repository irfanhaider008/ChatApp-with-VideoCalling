
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/database';

const app = firebase.app();
export const db = app.firestore();
export const fireDatabase=app.database();