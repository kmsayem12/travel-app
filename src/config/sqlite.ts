import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase({name: 'travel.db', location: 'default'});

export const initDB = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS travel_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
            location TEXT,
            photo TEXT,
            notes TEXT,
          createdAt INTEGER
        );`,
        [],
        () => resolve(),
        (_, error) => reject(error),
      );
    });
  });
};
