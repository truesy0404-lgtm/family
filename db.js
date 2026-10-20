// 옷장 저장소: 폰 브라우저의 IndexedDB (서버 없음, 기기 안에만 저장)
const DB_NAME = 'outfit-app';
const STORE = 'items';

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const r = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(r.result);
    t.onerror = () => reject(t.error);
  });
}

export const listItems = () => tx('readonly', (s) => s.getAll());
export const saveItem = (item) => tx('readwrite', (s) => s.put(item));
export const deleteItem = (id) => tx('readwrite', (s) => s.delete(id));
