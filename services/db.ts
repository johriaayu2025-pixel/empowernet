
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EmpowerNetDB', 1);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('scans')) db.createObjectStore('scans', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('alerts')) db.createObjectStore('alerts', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('users')) db.createObjectStore('users', { keyPath: 'email' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const dbSave = async (storeName: string, data: any) => {
  const db: any = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  tx.objectStore(storeName).put(data);
  return tx.complete;
};

export const dbGetAll = async (storeName: string) => {
  const db: any = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(storeName, 'readonly');
    const request = tx.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result);
  });
};
