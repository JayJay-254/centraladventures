// Firebase initialization and Firestore helpers (ES module)
// Usage:
// 1. Call `initFirebase({ apiKey: '...', authDomain: '...', projectId: '...' })` as early as possible (e.g., on page load).
// 2. Use helpers: `fetchCollection('trips')`, `addDocument('bookings', data)`, `getDocument('users','uid')`.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, getDoc, doc, onSnapshot, query, orderBy, setDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

let _app = null;
let _db = null;

export function initFirebase(config){
  if(!config || !config.projectId){
    console.warn('initFirebase: missing config.projectId — provide your Firebase config object.');
  }
  try{
    _app = initializeApp(config);
    _db = getFirestore(_app);
    // expose helpers globally so existing modules can access without import
    if(!window.Site) window.Site = {};
    window.Site.firebase = {
      _app, _db,
      fetchCollection,
      addDocument,
      getDocument,
      listenToCollection,
      setDocument
    };
    return { app: _app, db: _db };
  }catch(err){
    console.error('initFirebase error', err);
    return null;
  }
}

// Read all docs from a collection (one-time)
export async function fetchCollection(collectionName, options = {}){
  if(!_db) throw new Error('Firestore not initialized. Call initFirebase(config) first.');
  const colRef = collection(_db, collectionName);
  const q = options.orderBy ? query(colRef, orderBy(options.orderBy)) : colRef;
  const snap = await getDocs(q);
  const out = [];
  snap.forEach(d => out.push({ id: d.id, ...d.data() }));
  return out;
}

// Add a document to a collection
export async function addDocument(collectionName, data){
  if(!_db) throw new Error('Firestore not initialized. Call initFirebase(config) first.');
  const colRef = collection(_db, collectionName);
  const res = await addDoc(colRef, data);
  return res.id;
}

// Set (replace) a document (by id)
export async function setDocument(collectionName, id, data){
  if(!_db) throw new Error('Firestore not initialized. Call initFirebase(config) first.');
  const docRef = doc(_db, collectionName, id);
  await setDoc(docRef, data);
  return id;
}

// Get a single document by id
export async function getDocument(collectionName, id){
  if(!_db) throw new Error('Firestore not initialized. Call initFirebase(config) first.');
  const docRef = doc(_db, collectionName, id);
  const snap = await getDoc(docRef);
  if(!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// Real-time listener for a collection; returns unsubscribe
export function listenToCollection(collectionName, onUpdate, options = {}){
  if(!_db) throw new Error('Firestore not initialized. Call initFirebase(config) first.');
  const colRef = collection(_db, collectionName);
  const q = options.orderBy ? query(colRef, orderBy(options.orderBy)) : colRef;
  const unsub = onSnapshot(q, snap =>{
    const out = [];
    snap.forEach(d => out.push({ id: d.id, ...d.data() }));
    onUpdate(out);
  }, err => {
    console.error('listenToCollection error', err);
  });
  return unsub;
}

// Provide a safe helper to initialize from window (if user prefers inline config in HTML)
if(typeof window !== 'undefined'){
  window.initFirebase = initFirebase; // optional global entrypoint
}

/* Security & usage notes (do not include API keys in public repos):
 - Firebase web config (apiKey, authDomain, projectId, etc.) is required to initialize the SDK.
 - Keep production rules strict in Firestore security rules; do not rely solely on client security.
 - Prefer using Firebase Authentication and server-side checks for write operations.
 - For local dev, create a project with limited access or use environment variables.
*/
