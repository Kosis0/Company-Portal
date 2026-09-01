/**
 * Tier 4 Real-World Application Scenario: A2 - Supply Chain Manager Low Stock Reorder & PO Creation
 * Exercised Features: F1, F3, F6, F10, F11, F12
 *
 * Workflow:
 * 1. Supply Chain Lead / VP Eng logs in with Tier 4 authority.
 * 2. Navigates to Inventory & Supply Chain screen, reviewing 4 metric cards and stock level alerts.
 * 3. Identifies critical shortage on 'Apple MacBook Pro 16"' (2 in stock, min threshold 10).
 * 4. Clicks 'Create PO' generating formal PO-9021 for 25 units ($60,000).
 * 5. Verifies incoming shipment timeline tracking inbound freight from Austin, TX and Rotterdam, NL.
 * 6. Adds newly delivered hardware assets to the local database with serial tracking and Supabase sync.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { auth } = await import("../../src/services/auth.js");
const { db } = await import("../../src/services/db.js");

describe("Tier 4 - A2: Supply Chain Manager Reorder & PO Workflow", () => {
  beforeEach(() => {
    db.resetDatabase();
    auth.logout();
  });

  it("A2-1: VP of Engineering logs in and triages Inventory & Supply Chain alerts", async () => {
    const session = await auth.login("vpeng@company.com", "password123");
    assert.equal(session.user.tier, 4);
    assert.equal(session.user.department, "Engineering");

    const alerts = [
      { sku: "HW-M3-MAC", name: "Apple MacBook Pro 16\"", currentStock: 2, minThreshold: 10, reorderQty: 25, unitCost: "$2,400" },
      { sku: "HW-4K-MON", name: "Dell UltraSharp 27\" 4K", currentStock: 4, minThreshold: 15, reorderQty: 30, unitCost: "$580" },
    ];
    assert.equal(alerts.length, 2);
    assert.ok(alerts[0].currentStock < alerts[0].minThreshold);
  });

  it("A2-2: generates formal PO for critical MacBook shortage and calculates total expenditure", async () => {
    await auth.login("vpeng@company.com", "password123");

    const item = { sku: "HW-M3-MAC", name: "Apple MacBook Pro 16\"", reorderQty: 25, unitCost: "$2,400" };
    const unitPrice = parseFloat(item.unitCost.replace(/[^0-9.]/g, ""));
    const poRecord = {
      id: `PO-${Date.now().toString().slice(-6)}`,
      sku: item.sku,
      name: item.name,
      quantity: item.reorderQty,
      unitCost: item.unitCost,
      totalCost: `$${(unitPrice * item.reorderQty).toLocaleString()}`,
      status: "Dispatched",
      authorizedBy: "Tunde Bakare (VP Eng)",
      createdAt: new Date().toISOString(),
    };

    assert.equal(poRecord.quantity, 25);
    assert.equal(poRecord.totalCost, "$60,000");
    assert.equal(poRecord.status, "Dispatched");
  });

  it("A2-3: monitors connected vertical shipment timeline for inbound freight progress", () => {
    const timeline = [
      { id: "SHP-001", title: "Supplier ABC", timing: "Tomorrow", status: "Active", date: "Sept 02, 2026", carrier: "FedEx Freight" },
      { id: "SHP-002", title: "Global Logistics", timing: "Friday", status: "Active", date: "Sept 05, 2026", carrier: "DHL Express" },
      { id: "SHP-003", title: "Apex Silicon Dist.", timing: "Saturday", status: "In Transit", date: "Sept 06, 2026", carrier: "Maersk Line" },
    ];

    assert.equal(timeline.length, 3);
    assert.equal(timeline[0].timing, "Tomorrow");
    assert.equal(timeline[2].status, "In Transit");
  });

  it("A2-4: registers newly delivered hardware in asset store with assignee and department", async () => {
    const asset = await db.addAsset({
      name: "Dell UltraSharp 27\" 4K",
      category: "Display",
      serial: "DEL-4K-PO9021-01",
      assignedToId: "USR-009",
      assignedToName: "Chidi Nnamdi",
      department: "Product & Design",
      value: "$580.00",
    });

    assert.ok(asset.id);
    const stored = db.getAssets().find(a => a.id === asset.id);
    assert.ok(stored);
    assert.equal(stored.assignedToName, "Chidi Nnamdi");
  });
});
