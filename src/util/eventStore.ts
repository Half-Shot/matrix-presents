import { getClient } from "./matrix";
import { MatrixEvent } from "matrix-js-sdk";

const DB_NAME = "presents";
const DB_VERSION = 1;
let database: IDBDatabase|null = null;

export async function initiate() {
    const res = indexedDB.open(DB_NAME, DB_VERSION);
    res.onupgradeneeded = ((ev) => {
        const db = (ev.target as IDBOpenDBRequest).result;
        const os = db.createObjectStore("event-cache", { keyPath: "eventId"});
        os.createIndex("eventId", "eventId", { unique: true });
        os.createIndex("roomId", "roomId", { unique: false });
    });

    res.onsuccess = ((ev) => {
        console.log("DB opened:", ev);
        database = res.result;
    });

    res.onerror = ((ev) => {
        console.log("DB error:", ev);
    });
}

export async function getMatrixEvent(roomId: string, eventId: string) {
    console.log(`Fetching ${roomId} ${eventId}`);
    const getPromise = new Promise((resolve, reject) => {
        if (!database) {
            throw Error("Database not initiated");
        }
        const txn = database.transaction("event-cache", "readonly");
        const store = txn.objectStore("event-cache");
        const dataReq = store.get(eventId);
        dataReq.onsuccess = function(unusedEv) { resolve(dataReq.result?.data); };
        dataReq.onerror = function(unusedEv) { reject(dataReq.error); };
    });

    try {
        const getResult = await getPromise;
        console.log("Ev:", getResult);
        if (getResult) {
            return new MatrixEvent(getResult);
        }
    } catch (ex) {
        console.log("Error couldn't get cached ev:", ex);
    }

    const client = getClient();
    const ev = new MatrixEvent(await client.fetchRoomEvent(
        roomId,
        eventId,
    ));
    console.log(`Got non-cached event ${roomId}:${eventId}`);
    await new Promise((resolve, reject) => {
        if (!database) {
            throw Error("Database not initiated");
        }
        const txn = database.transaction("event-cache", "readwrite");
        const store = txn.objectStore("event-cache");
        const dataReq = store.put({
            eventId,
            roomId,
            data: ev.event,
        });
        dataReq.onsuccess = function(unusedEv) { resolve(dataReq.result); };
        dataReq.onerror = function(unusedEv) { reject(dataReq.error); };
    });

    return ev;
}