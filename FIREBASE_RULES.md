# Firebase Security Rules Update

## Current Issue: PUBLIC Database Access
Your Firebase Firestore is currently set to PUBLIC, meaning anyone can read and modify all data. This needs to be changed to PRIVATE.

## How to Update Firebase Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **pinkit-282ac**
3. Navigate to **Firestore Database** → **Rules** tab
4. Replace the current rules with the code below
5. Click **Publish**

---

## Updated Firebase Firestore Rules (PRIVATE & SECURE)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read their own data
    match /vendors/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && isAdmin(request.auth.token.email);
      allow update, delete: if request.auth != null && isAdmin(request.auth.token.email);
    }

    match /drivers/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && isAdmin(request.auth.token.email);
      allow update, delete: if request.auth != null && isAdmin(request.auth.token.email);
    }

    match /communityPosts/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || isAdmin(request.auth.token.email));
    }

    match /reviews/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || isAdmin(request.auth.token.email));
    }

    match /feedback/{document=**} {
      allow read: if request.auth != null && isAdmin(request.auth.token.email);
      allow create: if request.auth != null;
      allow update, delete: if isAdmin(request.auth.token.email);
    }

    match /forumThreads/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || isAdmin(request.auth.token.email));
    }

    match /forumComments/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || isAdmin(request.auth.token.email));
    }

    // Helper function to check if user is admin
    function isAdmin(email) {
      return email in [
        'hemanginivyas3@gmail.com',
        '2nikhil.sharma131019@gmail.com',
        'ipm06bodap@iimrohtak.ac.in',
        'ipm06sangeethav@iimrohtak.ac.in'
      ];
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## What These Rules Do

### Vendors & Drivers (Contacts)
- ✅ All authenticated users can **read** vendor and driver listings
- 🛡️ Only **admin users** can **create, update, delete** contacts
- 🔒 Non-admins cannot modify contact data

### Community Posts
- ✅ All authenticated users can **read and create** posts
- 👤 Users can **edit/delete only their own posts**
- 🛡️ Admins can **edit/delete any post**

### Reviews
- ✅ All authenticated users can **read and create** reviews
- 👤 Users can **edit/delete only their own reviews**
- 🛡️ Admins can manage all reviews

### Forum Threads & Comments
- ✅ All authenticated users can **read, create, edit threads/comments**
- 👤 Users can **edit/delete only their own content**
- 🛡️ Admins can manage all forum content

### Feedback
- 🔒 Only **admins** can **read feedback**
- ✅ All authenticated users can **submit feedback**
- 🛡️ Only **admins** can **edit/delete feedback**

---

## Next Steps

1. **Enable Firebase Authentication** (if not already enabled)
   - Go to Authentication → Sign-in method
   - Enable Email/Password authentication

2. **Update Firestore Rules** using the code above

3. **Test the app** - All data will now be private and secured

---

## Admin Emails (4 Admins)
These emails have special permissions:
- hemanginivyas3@gmail.com
- 2nikhil.sharma131019@gmail.com
- ipm06bodap@iimrohtak.ac.in
- ipm06sangeethav@iimrohtak.ac.in

Only these emails can add/edit/delete contacts and manage the platform.
