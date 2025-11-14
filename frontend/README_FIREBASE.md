Firebase setup for Central Adventures (frontend)

Purpose
- Provide instructions for initializing Firebase in the frontend and notes about security and rules.

Quickstart (client-side)
1) Create a Firebase project in the Firebase Console: https://console.firebase.google.com/
2) In the project settings, find the Web app config (apiKey, authDomain, projectId, etc.).
3) On page load, call the initializer exposed by the module. Example (add to your `index` or inline script):

```html
<script>
  // Minimal example — do NOT commit real API keys to public repos
  window.initFirebase({
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    // optional: storageBucket, messagingSenderId, appId
  });
</script>
```

4) Use helpers from `window.Site.firebase`, e.g.:

```js
// one-time fetch
const trips = await window.Site.firebase.fetchCollection('trips');
// subscribe to realtime updates
const unsub = window.Site.firebase.listenToCollection('trips', (items) => { console.log(items); });
// add a booking
const id = await window.Site.firebase.addDocument('bookings', { tripId: 'abc', name: 'Jay' });
```

Security notes
- Firebase web config keys are not secret by themselves, but do not commit them to public repos if you prefer to keep metadata private.
- Most important: set appropriate Firestore security rules to prevent unauthorized reads/writes. Use Firebase Authentication and server-side validation for any sensitive operations.
- For production, do not rely solely on client-side checks — enforce permissions in Firestore rules or via a trusted server.

Local development
- You can use the Firebase Emulator Suite for local development and testing of Firestore rules and functions.

Support
- Firebase docs: https://firebase.google.com/docs/firestore
- If you want, I can add an `auth` helper or wire Firebase Authentication next (recommended for booking writes).
