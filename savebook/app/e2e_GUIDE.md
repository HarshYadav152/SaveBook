# Client-Side E2E Encryption Flow

SaveBook uses client-side End-to-End Encryption (E2EE) to ensure that your notes are secure and private. Even the server administrator cannot read your notes.

## How it works

1.  **Key Generation**: When you register, a **User Master Key (UMK)** is generated locally in your browser.
2.  **Encryption**:
    *   This UMK is used to wrap (encrypt) a **Note Decryption Key (NDK)** for each note.
    *   The note content (title, description) is encrypted using the NDK.
    *   The UMK itself is encrypted using your password (derived key) and stored on the server as the `encryptedMasterKey`.
3.  **Decryption**:
    *   When you login, the server sends back the `encryptedMasterKey`.
    *   Your browser decrypts this using your password to retrieve the UMK.
    *   The UMK is then used to unwrap the NDK for each note, which in turn decrypts the note content.

## Important Note

*   **Do not lose your password!** Since the keys are encrypted with your password, if you lose it, we cannot recover your notes. Passing reset functionality will result in data loss unless you have a backup of your master key.
