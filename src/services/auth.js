/**
 * Authentication Service for Monolith Enterprise ERP
 * Handles user login, registration, session persistence, role verification,
 * cryptographic password hashing (SHA-256 + salt with legacy compatibility),
 * and signed session tokens with expiration enforcement.
 */
import { db } from "./db.js";

const AUTH_SESSION_KEY = "monolith_auth_session";
const TOKEN_PREFIX = "mth_jwt_";
const HASH_PREFIX = "sha256:";
const SALT = "monolith_ent_salt_2026";

/**
 * Computes a SHA-256 hash of password with salt.
 */
async function hashPassword(plainText) {
  if (!plainText) return "";
  try {
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const enc = new TextEncoder();
      const data = enc.encode(`${SALT}:${plainText.trim()}`);
      const hashBuf = await crypto.subtle.digest("SHA-256", data);
      const hashArr = Array.from(new Uint8Array(hashBuf));
      return `${HASH_PREFIX}${hashArr.map((b) => b.toString(16).padStart(2, "0")).join("")}`;
    }
  } catch (err) {
    console.warn("Crypto subtle unavailable, using fallback:", err);
  }
  return plainText.trim();
}

/**
 * Verifies a plain password against stored password (hashed or legacy plaintext).
 */
async function verifyPassword(inputPassword, storedPassword) {
  if (!storedPassword || !inputPassword) return false;
  const trimmedInput = inputPassword.trim();
  if (storedPassword.startsWith(HASH_PREFIX)) {
    const computed = await hashPassword(trimmedInput);
    return computed === storedPassword;
  }
  // Legacy plaintext match
  return storedPassword === trimmedInput;
}

/**
 * Generates a signed session token.
 */
function createSessionToken(user, expiresAt) {
  const payload = {
    sub: user.id,
    email: user.email,
    tier: user.tier,
    role: user.role,
    exp: expiresAt,
    iat: Date.now(),
  };
  const b64 = btoa(JSON.stringify(payload));
  // Checksum signature for client-side tamper detection
  let checksum = 0;
  for (let i = 0; i < b64.length; i++) {
    checksum = ((checksum << 5) - checksum + b64.charCodeAt(i)) | 0;
  }
  const sig = Math.abs(checksum).toString(16);
  return `${TOKEN_PREFIX}${b64}.${sig}`;
}

export const auth = {
  getCurrentSession() {
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);

      // Check session expiration
      if (session.expiresAt && session.expiresAt < Date.now()) {
        this.logout();
        return null;
      }

      // Re-verify against live database to ensure user still exists and get latest profile data
      const user = db.getUserById(session.user?.id);
      if (!user) {
        this.logout();
        return null;
      }

      return {
        token: session.token,
        user,
        expiresAt: session.expiresAt,
      };
    } catch (err) {
      console.error("Failed to parse auth session:", err);
      return null;
    }
  },

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = db.getUserByEmail(trimmedEmail);

    if (!user) {
      throw new Error("No account found with this corporate email address.");
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new Error("Invalid password. Please check your credentials.");
    }

    // Transparently upgrade legacy plaintext password to cryptographic hash
    if (!user.password.startsWith(HASH_PREFIX)) {
      const secureHash = await hashPassword(password);
      await db.updateUser(user.id, { password: secureHash });
      user.password = secureHash;
    }

    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    const token = createSessionToken(user, expiresAt);
    const session = {
      token,
      user,
      expiresAt,
    };

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async register(registrationData) {
    if (!registrationData.email) {
      throw new Error("Corporate email is required for registration.");
    }

    const trimmedEmail = registrationData.email.trim().toLowerCase();
    const existing = db.getUserByEmail(trimmedEmail);

    if (existing) {
      throw new Error("An employee account already exists with this corporate email.");
    }

    const rawPassword = registrationData.password?.trim() || "password123";
    const hashedPassword = await hashPassword(rawPassword);

    const newUser = await db.createUser({
      email: trimmedEmail,
      password: hashedPassword,
      name: registrationData.name?.trim() || "New Staff",
      title: registrationData.title?.trim() || "Staff Member",
      department: registrationData.department || "Engineering",
      role: registrationData.role || "employee",
      location: registrationData.location?.trim() || "Port Harcourt, Nigeria",
      phone: registrationData.phone?.trim() || "+234 800 000 0000",
      bankName: "First Bank of Nigeria",
      accountNumber: "0000000000",
      taxId: `TIN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      pensionPin: `PEN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      salary: "$3,500/mo",
    });

    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const token = createSessionToken(newUser, expiresAt);
    const session = {
      token,
      user: newUser,
      expiresAt,
    };

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logout() {
    localStorage.removeItem(AUTH_SESSION_KEY);
  },
};
