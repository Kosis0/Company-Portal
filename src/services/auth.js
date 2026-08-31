/**
 * Authentication Service for Monolith Enterprise ERP
 * Handles user login, registration, session persistence, and role verification.
 */
import { db } from "./db.js";

const AUTH_SESSION_KEY = "monolith_auth_session";

export const auth = {
  getCurrentSession() {
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      // Re-verify against live database to ensure user still exists and get latest profile data
      const user = db.getUserById(session.user.id);
      if (!user) {
        this.logout();
        return null;
      }
      return { token: session.token, user };
    } catch (err) {
      console.error("Failed to parse auth session:", err);
      return null;
    }
  },

  async login(email, password) {
    // In production, this issues an API call / Firebase sign in
    const trimmedEmail = email.trim().toLowerCase();
    const user = db.getUserByEmail(trimmedEmail);

    if (!user) {
      throw new Error("No account found with this corporate email address.");
    }

    if (user.password !== password.trim()) {
      throw new Error("Invalid password. Please check your credentials.");
    }

    const token = `mth_jwt_${btoa(`${user.id}:${Date.now()}`)}`;
    const session = {
      token,
      user,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async register(registrationData) {
    const trimmedEmail = registrationData.email.trim().toLowerCase();
    const existing = db.getUserByEmail(trimmedEmail);

    if (existing) {
      throw new Error("An employee account already exists with this corporate email.");
    }

    const newUser = await db.createUser({
      email: trimmedEmail,
      password: registrationData.password.trim(),
      name: registrationData.name.trim(),
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

    const token = `mth_jwt_${btoa(`${newUser.id}:${Date.now()}`)}`;
    const session = {
      token,
      user: newUser,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logout() {
    localStorage.removeItem(AUTH_SESSION_KEY);
  },
};
