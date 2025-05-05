import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

// Enable persistence for Firestore
firestore().settings({persistence: true});

// Enable persistence for Realtime DB
database().setPersistenceEnabled(true);

export {firebase, auth, firestore, storage, database};
