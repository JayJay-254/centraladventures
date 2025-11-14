Admin Dashboard README

Purpose
- A lightweight admin dashboard to view and manage Firestore documents (trips, bookings).

Setup
1. Create a Firebase project and enable Email/Password sign-in in Authentication.
2. In project settings, copy the web app config and provide it to the admin page in one of two ways:
   - Temporary (dev): open `admin/index.html` in the browser and set the global in DevTools console:
     ```js
     window.ADMIN_FIREBASE_CONFIG = {
       apiKey: "...",
       authDomain: "...",
       projectId: "...",
       // other keys as provided
     };
     ```
     Then reload the page.
   - Safer: create a local file `admin/config.js` (do NOT commit) and add:
     ```js
     window.ADMIN_FIREBASE_CONFIG = { /* your config */ };
     ```
     And include it in `index.html` before `scripts/admin.js`.

Usage
- Sign in with a Firebase user having admin rights (enforce via Firestore rules).
- Click "Load Trips" or "Load Bookings" to fetch documents.
- Use Delete to remove documents (ensure your rules permit the action).

Security
- Do NOT commit secrets or private keys to version control. The Firebase web config is not a secret by itself, but keep production practices strict.
- Use Firestore security rules to only allow admin users to read/write. Consider using custom claims for admin roles.
- For production, consider building a server-side admin console that uses the Admin SDK instead of exposing write operations to a browser.

If you'd like, I can:
- Wire an `admin/config.js` template and add instructions to `.gitignore`.
- Add role-checking via custom claims (requires setting claims via Admin SDK).
- Add a simple UI to edit documents (update operations).
