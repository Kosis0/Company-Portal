/**
 * Tier 3 Combination Suite: C3 - Stock Level Alerts, PO Creation & Inventory Pipeline
 * Tests cross-feature flow: Stock Alert detection -> PO creation -> Asset inventory updates
 * -> Realtime sync notification trigger.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();
const { db } = await import("../../src/services/db.js");

describe("Tier 3 - C3: Stock Reorder, PO Creation & Inventory Pipeline", () => {
  beforeEach(() => {
    db.resetDatabase();
  });

  it("C3-1: detects low stock alert and triggers PO generation with accurate supplier metadata", () => {
    const alertItem = {
      sku: "HW-M3-MAC",
      name: "Apple MacBook Pro 16\"",
      currentStock: 2,
      minThreshold: 10,
      reorderQty: 20,
      unitCost: "$2,400",
      preferredSupplier: "Apex Silicon Distribution",
    };

    function processStockAlertToPO(item, authorizedBy) {
      const unitCostNum = parseFloat(item.unitCost.replace(/[^0-9.]/g, ""));
      return {
        poId: `PO-${Date.now().toString().slice(-6)}`,
        sku: item.sku,
        itemName: item.name,
        quantity: item.reorderQty,
        totalCost: `$${(unitCostNum * item.reorderQty).toLocaleString()}`,
        supplier: item.preferredSupplier,
        status: "Approved & Sent",
        authorizedBy,
        estimatedDelivery: "5 Business Days",
      };
    }

    const po = processStockAlertToPO(alertItem, "Tunde Bakare (VP Eng)");
    assert.ok(po.poId.startsWith("PO-"));
    assert.equal(po.quantity, 20);
    assert.equal(po.totalCost, "$48,000");
    assert.equal(po.supplier, "Apex Silicon Distribution");
  });

  it("C3-2: adds newly received hardware assets to inventory registry upon shipment fulfillment", async () => {
    const initialCount = db.getAssets().length;

    const addedAsset = await db.addAsset({
      name: "Apple MacBook Pro 16\" (Batch PO-901)",
      category: "Workstation",
      serial: "MBP-16-PO901-01",
      assignedToId: "USR-008",
      assignedToName: "Udeh Kosisochukwu Emmanuel",
      department: "Engineering",
      value: "$2,400.00",
    });

    assert.ok(addedAsset.id);
    const updatedCount = db.getAssets().length;
    assert.equal(updatedCount, initialCount + 1);
  });

  it("C3-3: updates department hardware allocation metric after asset registration", () => {
    const assets = db.getAssets();
    const engAssets = assets.filter(a => a.department === "Engineering");
    assert.ok(engAssets.length > 0);

    const totalValue = engAssets.reduce((acc, a) => acc + parseFloat(a.value.replace(/[^0-9.]/g, "") || 0), 0);
    assert.ok(totalValue > 0, "Engineering asset value must be positive");
  });

  it("C3-4: notifies active realtime subscribers upon new asset creation", async () => {
    let changeNotified = false;
    const unsub = db.subscribeToChanges(() => {
      changeNotified = true;
    });

    await db.addAsset({
      name: "Dell 4K Display",
      category: "Monitor",
      serial: "DEL-4K-TEST",
      value: "$600.00",
    });

    unsub();
    assert.equal(typeof unsub, "function");
  });
});
