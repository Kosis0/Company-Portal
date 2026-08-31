/**
 * Test Harness for Monolith Enterprise ERP Test Infrastructure
 * Provides in-memory localStorage simulation, DOM attributes mock,
 * Supabase realtime mock dispatch, and assertion utilities.
 */
import assert from "node:assert/strict";

export class MockLocalStorage {
  constructor() {
    this.store = new Map();
    this.quotaLimit = Infinity;
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    const strVal = String(value);
    if (this.store.size >= this.quotaLimit) {
      const err = new Error("QuotaExceededError: DOM Exception 22");
      err.name = "QuotaExceededError";
      throw err;
    }
    this.store.set(key, strVal);
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  get length() {
    return this.store.size;
  }

  key(index) {
    return Array.from(this.store.keys())[index] || null;
  }
}

export class MockDOMDocument {
  constructor() {
    this.attributes = new Map();
    this.documentElement = {
      setAttribute: (name, value) => {
        this.attributes.set(name, String(value));
      },
      getAttribute: (name) => {
        return this.attributes.get(name) || null;
      },
      removeAttribute: (name) => {
        this.attributes.delete(name);
      },
    };
  }
}

/**
 * Initializes a clean global mock environment for tests
 */
export function setupTestEnvironment() {
  const mockStorage = new MockLocalStorage();
  globalThis.localStorage = mockStorage;

  if (typeof globalThis.document === "undefined") {
    const mockDoc = new MockDOMDocument();
    globalThis.document = mockDoc;
  }

  if (typeof globalThis.btoa === "undefined") {
    globalThis.btoa = (str) => Buffer.from(str, "binary").toString("base64");
  }

  if (typeof globalThis.atob === "undefined") {
    globalThis.atob = (str) => Buffer.from(str, "base64").toString("binary");
  }

  return { storage: mockStorage, document: globalThis.document };
}

/**
 * Assertion helper library
 */
export const testAssert = {
  ...assert,

  assertRange(actual, min, max, message) {
    assert.ok(
      actual >= min && actual <= max,
      message || `Expected ${actual} to be between ${min} and ${max}`
    );
  },

  assertStatus(object, expectedStatus, message) {
    assert.equal(
      object?.status,
      expectedStatus,
      message || `Expected status to be "${expectedStatus}", got "${object?.status}"`
    );
  },

  assertThrowsAsync: async (asyncFn, expectedErrorRegexOrMessage) => {
    let threw = false;
    let thrownError = null;
    try {
      await asyncFn();
    } catch (err) {
      threw = true;
      thrownError = err;
    }
    assert.ok(threw, "Expected asynchronous function to throw an error");
    if (expectedErrorRegexOrMessage) {
      if (expectedErrorRegexOrMessage instanceof RegExp) {
        assert.match(thrownError.message, expectedErrorRegexOrMessage);
      } else {
        assert.ok(
          thrownError.message.includes(expectedErrorRegexOrMessage),
          `Expected error message "${thrownError.message}" to include "${expectedErrorRegexOrMessage}"`
        );
      }
    }
    return thrownError;
  },

  assertMoney(amountStr, expectedNumber) {
    const clean = parseFloat(String(amountStr).replace(/[^0-9.-]+/g, ""));
    assert.equal(Math.round(clean * 100) / 100, Math.round(expectedNumber * 100) / 100);
  },
};
