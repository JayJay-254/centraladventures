// Admin dashboard frontend (ES module)
// Expects a Firebase web config to be provided as `window.ADMIN_FIREBASE_CONFIG` or call `init(config)`.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

let app = null, auth = null, db = null;

export function init(config){
  if(!config || !config.projectId) throw new Error('Firebase config missing');
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
  window.Admin = window.Admin || {};
  window.Admin.auth = { auth, db };
  setupAuthListeners();
}

function formatDate(ts){ try{ return new Date(ts).toLocaleString(); }catch(e){ return ts; } }

async function fetchCollection(name){
  const col = collection(db, name);
  const snap = await getDocs(col);
  const out = [];
  snap.forEach(d => out.push({ id: d.id, ...d.data() }));
  return out;
}

async function deleteDocument(collectionName, id){
  const d = doc(db, collectionName, id);
  await deleteDoc(d);
}

function showAuthStatus(msg){ const el = document.getElementById('auth-status'); if(el) el.textContent = msg; }

function setupAuthListeners(){
  const loginForm = document.getElementById('login-form');
  const loginBtn = document.getElementById('admin-login');
  const logoutBtn = document.getElementById('admin-logout');

  if(loginForm){
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value;
      const password = document.getElementById('admin-password').value;
      try{
        await signInWithEmailAndPassword(getAuth(), email, password);
      }catch(err){ showAuthStatus('Sign-in failed: ' + err.message); }
    });
  }

  if(logoutBtn){ logoutBtn.addEventListener('click', async () => { try{ await signOut(getAuth()); }catch(e){ console.error(e); } }); }

  onAuthStateChanged(getAuth(), user => {
    const dataSection = document.getElementById('data-section');
    const authSection = document.getElementById('auth-section');
    const loginBtn = document.getElementById('admin-login');
    const logoutBtn = document.getElementById('admin-logout');
    if(user){
      showAuthStatus('Signed in as ' + (user.email || user.uid));
      if(dataSection) dataSection.classList.remove('hidden');
      if(logoutBtn) logoutBtn.classList.remove('hidden');
      if(loginBtn) loginBtn.classList.add('hidden');
    } else {
      showAuthStatus('Not signed in');
      if(dataSection) dataSection.classList.add('hidden');
      if(logoutBtn) logoutBtn.classList.add('hidden');
      if(loginBtn) loginBtn.classList.remove('hidden');
    }
  });

  // load buttons
  const loadTrips = document.getElementById('load-trips');
  const loadBookings = document.getElementById('load-bookings');
  const listContainer = document.getElementById('list-container');

  if(loadTrips) loadTrips.addEventListener('click', async () => {
    listContainer.innerHTML = '<p class="muted">Loading trips…</p>';
    try{
      const items = await fetchCollection('trips');
      renderList(items, 'trips');
    }catch(err){ listContainer.innerHTML = '<p class="muted">Error loading trips</p>'; console.error(err); }
  });

  if(loadBookings) loadBookings.addEventListener('click', async () => {
    listContainer.innerHTML = '<p class="muted">Loading bookings…</p>';
    try{
      const items = await fetchCollection('bookings');
      renderList(items, 'bookings');
    }catch(err){ listContainer.innerHTML = '<p class="muted">Error loading bookings</p>'; console.error(err); }
  });

  function renderList(items, collectionName){
    if(!Array.isArray(items) || !items.length) return listContainer.innerHTML = '<p class="muted">No items found.</p>';
    listContainer.innerHTML = '';
    items.forEach(it => {
      const wrapper = document.createElement('div'); wrapper.className = 'list-item';
      const meta = document.createElement('div'); meta.className = 'meta';
      meta.innerHTML = `<strong>${it.title || it.name || collectionName} </strong> <div class="muted">id: ${it.id} ${it.createdAt ? ' • ' + formatDate(it.createdAt) : ''}</div>`;
      const actions = document.createElement('div');
      const del = document.createElement('button'); del.textContent = 'Delete'; del.addEventListener('click', async () => {
        if(!confirm('Delete this document?')) return; try{ await deleteDocument(collectionName, it.id); wrapper.remove(); }catch(e){ alert('Delete failed: ' + e.message); }
      });
      actions.appendChild(del);
      wrapper.appendChild(meta); wrapper.appendChild(actions);
      listContainer.appendChild(wrapper);
    });
  }
}

// Auto-init if config is present on window
if(typeof window !== 'undefined' && window.ADMIN_FIREBASE_CONFIG){ try{ init(window.ADMIN_FIREBASE_CONFIG); }catch(err){ console.warn('Admin init failed: ', err.message); } }

export default { init };
