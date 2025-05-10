import RNFS from 'react-native-fs';

import {db} from '../config/sqlite';
import {getCurrentUser} from './auth';
import {Platform} from 'react-native';
import {Travel} from '../types/travel';
import {CreateTravelFormData} from '../screens/CreateTravel/utils';

export const createTravel = async (
  log: CreateTravelFormData,
): Promise<Travel> => {
  const currentUser = await getCurrentUser(); // Implement local auth/session as needed

  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  const createdAt = new Date();

  return new Promise(async (resolve, reject) => {
    (await db).transaction(tx => {
      tx.executeSql(
        `INSERT INTO travel_logs 
         (userId, location, photo, notes, createdAt) 
         VALUES (?, ?, ?, ?, ?);`,
        [currentUser, log.location, log.photo, log.notes, createdAt.getTime()],
        (_, result) => {
          console.log('Result:', result);
          resolve({
            id: result.insertId?.toString(),
            userId: currentUser.uid,
            location: log.location,
            photo: log.photo,
            notes: log.notes,
            createdAt,
          });
        },
        error => {
          console.error('Error inserting travel log:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const uploadPhoto = async (uri: string): Promise<string> => {
  const filename = uri.split('/').pop();
  const destPath = `${RNFS.DocumentDirectoryPath}/${Date.now()}-${filename}`;

  await RNFS.copyFile(uri, destPath);

  const fileExists = await RNFS.exists(destPath);
  if (!fileExists) {
    throw new Error('File was not saved successfully');
  }

  // Return the proper URI format based on platform
  return Platform.OS === 'android' ? `file://${destPath}` : destPath; // iOS handles both formats but prefers without file:// prefix for local files
};

export const getTravels = async (): Promise<Travel[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error('No authenticated user');
  }

  return new Promise(async (resolve, reject) => {
    (await db).transaction(tx => {
      tx.executeSql(
        'SELECT * FROM travel_logs WHERE userId = ? ORDER BY createdAt DESC;',
        [currentUser.uid],
        (_, {rows}) => {
          const data: Travel[] = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          resolve(data);
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
};

export const getAllTravel = async (): Promise<Travel[]> => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction(tx => {
      tx.executeSql(
        'SELECT * FROM travel_logs ORDER BY createdAt DESC;',
        [],
        (_, {rows}) => {
          const data: Travel[] = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          resolve(data);
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
};
