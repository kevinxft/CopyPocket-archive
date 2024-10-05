// 添加数据的函数

import { AddDataParams, UrlRecord } from "@/types";

// 打开数据库连接
const dbName = "CopySaverDB";
const dbVersion = 1;
let db: IDBDatabase | null = null;

const request: IDBOpenDBRequest = indexedDB.open(dbName, dbVersion);

request.onerror = (event: Event) => {
  console.error("数据库错误: " + (event.target as IDBOpenDBRequest).error);
};

request.onsuccess = (event: Event) => {
  db = (event.target as IDBOpenDBRequest).result;
  console.log("数据库连接成功");
};

request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
  db = (event.target as IDBOpenDBRequest).result;
  const objectStore = db.createObjectStore("urls", {
    keyPath: "id",
    autoIncrement: true,
  });

  objectStore.createIndex("copiedUrl", "copiedUrl", { unique: false });
  objectStore.createIndex("domain", "domain", {
    unique: false,
  });
  objectStore.createIndex("timestamp", "timestamp", { unique: false });
};

export function addData(data: AddDataParams): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("数据库未连接"));
      return;
    }

    const transaction = db.transaction(["urls"], "readwrite");
    const objectStore = transaction.objectStore("urls");

    const newItem: UrlRecord = {
      ...data,
      timestamp: new Date().getTime(),
    };

    const request = objectStore.add(newItem);

    request.onerror = () => {
      reject(new Error("添加数据出错"));
    };

    request.onsuccess = () => {
      resolve();
    };
  });
}

// 获取所有数据的函数
export function getAllData(domain?: string): Promise<UrlRecord[]> {
  return new Promise(async (resolve, reject) => {
    if (!db) {
      reject(new Error("数据库未连接"));
      return;
    }

    const transaction = db.transaction(["urls"], "readonly");
    const objectStore = transaction.objectStore("urls");

    let request: IDBRequest<UrlRecord[]>;

    // 如果提供了 currentTabDomain，则使用 index 来查找
    if (domain) {
      const index = objectStore.index("domain"); // 确保在 IndexedDB 中有该索引
      request = index.getAll(domain);
    } else {
      request = objectStore.getAll();
    }

    request.onerror = () => {
      reject(new Error("获取数据出错"));
    };

    request.onsuccess = (event: Event) => {
      const result = (event.target as IDBRequest<UrlRecord[]>).result;
      console.warn("onsuccess: ", result, "");
      resolve(result);
    };
  });
}
