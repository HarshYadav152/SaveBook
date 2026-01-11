# Issue Title: Critical: Improper Token Validation Vulnerability (Data Leak & Server Crash)

**Description**
I have identified a critical security vulnerability in the API authentication logic. The application fails to properly validate the existence and validity of the authentication token (`authToken`) before using it.
1.  **Server Crash:** Accessing `token.value` when `token` is missing (null/undefined) causes a server 500 crash.
2.  **Data Leak:** When an invalid token is provided (e.g., malformed or expired), `verifyJwtToken` returns an object where `userId` is undefined. The database query `Notes.find({ user: userId })` then becomes `Notes.find({ user: undefined })` (or `Notes.find({})`), which returns **ALL** notes from all users.

**To Reproduce**
Steps to reproduce the behavior:

**Scenario 1: Server Crash**
1.  Send a GET request to `/api/notes` without any `authToken` cookie.
2.  The server throws `TypeError: Cannot read properties of undefined (reading 'value')` and returns a 500 error.

**Scenario 2: Data Leak**
1.  Send a GET request to `/api/notes` with an `authToken` cookie containing an invalid JWT string (e.g., "invalid_token").
2.  The `verifyJwtToken` function returns `{ success: false, ... }` but the route handler ignores this failure.
3.  The API executes `Notes.find({ user: undefined })`.
4.  The response contains **all notes** from the database, regardless of ownership.

**Expected Behavior**
1.  If the token is missing, the API should return `401 Unauthorized`.
2.  If the token is invalid, the API should return `401 Unauthorized` and **not** proceed to query the database.

**Screenshots/Code Snippets**
Affected File: `app/api/notes/route.js` (and others)

```javascript
// Current Vulnerable Code
const token = request.cookies.get('authToken');
const {userId} = verifyJwtToken(token.value) // CRASH if token is missing

const notes = await Notes.find({ user: userId }); 
// LEAK if userId is undefined (invalid token)
```

**Environment**
 - OS: Windows
 - Node.js version: 18.x
 - SaveBook Version: Current Main

**Possible Solution**
Add null checks for the token and validate the result of `verifyJwtToken`:

```javascript
const token = request.cookies.get('authToken');

if (!token) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const verification = verifyJwtToken(token.value);
if (!verification.success || !verification.userId) {
  return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
}

const { userId } = verification;
// Proceed safely
```
