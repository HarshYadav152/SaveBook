// lib/utils/crypto.js

// Constants
const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 256; // bits

/**
 * Converts a hex string to a Uint8Array
 */
export const hexToBuffer = (hex) => {
    return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
};

/**
 * Converts a Uint8Array to a hex string
 */
export const bufferToHex = (buffer) => {
    return Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Generates a random salt
 */
export const generateSalt = () => {
    return window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
};

/**
 * Generates a random IV (Initialization Vector)
 */
export const generateIV = () => {
    return window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
};

/**
 * Derives a Key Encrypting Key (KEK) from a password and salt using PBKDF2
 * @param {string} password 
 * @param {Uint8Array} salt 
 * @returns {Promise<CryptoKey>}
 */
export const deriveKeyFromPassword = async (password, salt) => {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: KEY_LENGTH },
        false,
        ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
    );
};

/**
 * Generates a new random Master Key (UMK) or Note Key (NDK)
 * @returns {Promise<CryptoKey>}
 */
export const generateSymmetricKey = async () => {
    return window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: KEY_LENGTH
        },
        true, // exportable so we can wrap it
        ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
    );
};

/**
 * Encrypts (Wraps) a key using another key (e.g., Wrap UMK with KEK)
 * @param {CryptoKey} keyToWrap 
 * @param {CryptoKey} wrappingKey 
 * @returns {Promise<{encryptedKey: string, iv: string}>} Hex strings
 */
export const wrapKey = async (keyToWrap, wrappingKey) => {
    const iv = generateIV();
    const wrappedBuffer = await window.crypto.subtle.wrapKey(
        "raw",
        keyToWrap,
        wrappingKey,
        {
            name: "AES-GCM",
            iv: iv
        }
    );
    return {
        encryptedKey: bufferToHex(new Uint8Array(wrappedBuffer)),
        iv: bufferToHex(iv)
    };
};

/**
 * Decrypts (Unwraps) a key using another key
 * @param {string} encryptedKeyHex 
 * @param {string} ivHex 
 * @param {CryptoKey} unwrappingKey 
 * @returns {Promise<CryptoKey>}
 */
export const unwrapKey = async (encryptedKeyHex, ivHex, unwrappingKey) => {
    const encryptedData = hexToBuffer(encryptedKeyHex);
    const iv = hexToBuffer(ivHex);

    return window.crypto.subtle.unwrapKey(
        "raw",
        encryptedData,
        unwrappingKey,
        {
            name: "AES-GCM",
            iv: iv
        },
        { name: "AES-GCM", length: KEY_LENGTH },
        true,
        ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
    );
};

/**
 * Encrypts string data using a key
 * @param {string} data 
 * @param {CryptoKey} key 
 * @returns {Promise<{ciphertext: string, iv: string}>}
 */
export const encryptData = async (data, key) => {
    const enc = new TextEncoder();
    const iv = generateIV();
    const ciphertextBuffer = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        enc.encode(data)
    );
    return {
        ciphertext: bufferToHex(new Uint8Array(ciphertextBuffer)),
        iv: bufferToHex(iv)
    };
};

/**
 * Decrypts data using a key
 * @param {string} ciphertextHex 
 * @param {string} ivHex 
 * @param {CryptoKey} key 
 * @returns {Promise<string>}
 */
export const decryptData = async (ciphertextHex, ivHex, key) => {
    const ciphertext = hexToBuffer(ciphertextHex);
    const iv = hexToBuffer(ivHex);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
};
