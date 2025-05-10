import {
  FirebaseAuthTypes,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {AuthCredentials, RegisterCredentials, AuthError} from '../types/auth';

export const signUp = async ({
  name,
  email,
  password,
}: RegisterCredentials): Promise<FirebaseAuthTypes.User> => {
  try {
    const {user} = await createUserWithEmailAndPassword(
      getAuth(),
      email,
      password,
    );
    await user.updateProfile({displayName: name});

    try {
      await database().ref(`/users/${user.uid}`).set({
        name,
        email,
        createdAt: database.ServerValue.TIMESTAMP,
        isOnline: true,
      });
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
    }

    const token = await user.getIdToken();
    await AsyncStorage.setItem('userToken', token);

    return user;
  } catch (error) {
    throw error as AuthError;
  }
};

export const signIn = async ({
  email,
  password,
}: AuthCredentials): Promise<FirebaseAuthTypes.User> => {
  try {
    const {user} = await signInWithEmailAndPassword(getAuth(), email, password);

    if (!user) {
      throw new Error('User credential returned no user.');
    }

    try {
      await database().ref(`/users/${user.uid}`).update({
        isOnline: true,
        lastLoginAt: database.ServerValue.TIMESTAMP,
      });
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
    }

    const token = await user.getIdToken();
    await AsyncStorage.setItem('userToken', token);

    return user;
  } catch (error) {
    throw error as AuthError;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const {currentUser} = auth();
    if (currentUser) {
      await database().ref(`/users/${currentUser.uid}`).update({
        isOnline: false,
        lastSeen: database.ServerValue.TIMESTAMP,
      });
    }

    await auth().signOut();
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    throw error as AuthError;
  }
};

export const checkAuthState = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return !!token;
  } catch (error) {
    return false;
  }
};

export const getCurrentUser =
  async (): Promise<FirebaseAuthTypes.User | null> => {
    try {
      const user = auth().currentUser as FirebaseAuthTypes.User;
      return user;
    } catch (error) {
      throw error as AuthError;
    }
  };
