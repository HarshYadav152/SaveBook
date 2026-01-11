# Critical Security Vulnerability Report: SaveBook

## Issue: Improper Token Validation Leading to Potential Data Leak and Server Crashes

**Severity**: Critical
**Affected Components**: 
- `app/api/notes/route.js` (GET, POST)
- `app/api/notes/[id]/route.js` (GET, PUT, DELETE)

### 1. Server Crash on Missing Token
**Description**: The API routes attempt to access the `value` property of the `authToken` cookie without checking if the cookie exists.
**Code Location**:
```javascript
const token = request.cookies.get('authToken');
const {userId} = verifyJwtToken(token.value) // Crashes here if token is undefined
```
**Impact**: Clients without a cookie receive a 500 Internal Server Error instead of a proper 401 Unauthorized response.

### 2. Authorization Bypass / Data Leak (Critical)
**Description**: When an invalid token is provided to `verifyJwtToken` (e.g., expired or tampered), the function returns an error object, leaving `userId` as `undefined`. The code does not check for this error and proceeds to query the database with `user: undefined`.
**Code Location**:
```javascript
const {userId} = verifyJwtToken(token.value); 
// If verification fails, userId is undefined.

const notes = await Notes.find({ user: userId });
// Becomes Notes.find({ user: undefined }).
// Mongoose often ignores undefined fields, resulting in Notes.find({}) -> RETURNS ALL NOTES.
```
**Impact**: An attacker with an invalid token could potentially retrieve **all notes** from all users, or update/delete notes belonging to others if they can guess the note ID.

### 3. Recommended Fix
Implement proper checks for token existence and validity.

```javascript
// Example Fix
const token = request.cookies.get('authToken');

// 1. Check if token exists
if (!token) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// 2. Verify token and check for verification errors
const verificationResult = verifyJwtToken(token.value);

if (!verificationResult.success || !verificationResult.userId) {
   return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
}

const { userId } = verificationResult;

// Proceed with valid userId...
```
