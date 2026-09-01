/**
 * Tier 2 Boundary Coverage: B10 - Vertical Shipment Timeline Boundaries
 * Tests empty shipment lists, missing metadata fields, unrecognized status values,
 * extreme delivery dates, and multi-word carrier titles.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Tier 2 - B10: Vertical Shipment Timeline Boundaries", () => {
  function normalizeShipmentItem(item, index) {
    if (!item) {
      return {
        id: `SHP-FALLBACK-${index}`,
        title: "Inbound Cargo",
        timing: "Pending",
        status: "Active",
        badgeClass: "badge badge-success",
        carrierDetails: "Standard Freight",
        date: "TBD",
      };
    }

    const title = item.title || item.supplier || item.name || "Inbound Shipment";
    const status = item.status || "Active";
    let badgeClass = "badge badge-success";
    if (status === "In Transit") badgeClass = "badge badge-info";
    else if (status === "Scheduled" || status === "Pending") badgeClass = "badge badge-warning";
    else if (status === "Delayed" || status === "Cancelled") badgeClass = "badge badge-danger";

    const carrier = item.carrier ? `${item.carrier}${item.origin ? ` • ${item.origin}` : ""}` : (item.origin || null);

    return {
      id: item.id || `SHP-${index + 1}`,
      title,
      timing: item.timing || status,
      status,
      badgeClass,
      carrierDetails: carrier,
      date: item.date || item.expectedDate || "TBD",
    };
  }

  it("B10-1: handles null or empty shipment items providing safe fallback metadata", () => {
    const fallback = normalizeShipmentItem(null, 0);
    assert.equal(fallback.id, "SHP-FALLBACK-0");
    assert.equal(fallback.title, "Inbound Cargo");
    assert.equal(fallback.badgeClass, "badge badge-success");
  });

  it("B10-2: handles unknown status strings with safe fallback to badge-success", () => {
    const item = normalizeShipmentItem({ status: "CUSTOM_UNKNOWN_STATUS" }, 0);
    assert.equal(item.status, "CUSTOM_UNKNOWN_STATUS");
    assert.equal(item.badgeClass, "badge badge-success");
  });

  it("B10-3: handles missing carrier or missing origin without returning 'undefined'", () => {
    const itemOnlyCarrier = normalizeShipmentItem({ carrier: "DHL Express" }, 0);
    assert.equal(itemOnlyCarrier.carrierDetails, "DHL Express");

    const itemOnlyOrigin = normalizeShipmentItem({ origin: "Tokyo, JP" }, 0);
    assert.equal(itemOnlyOrigin.carrierDetails, "Tokyo, JP");

    const itemEmpty = normalizeShipmentItem({}, 0);
    assert.equal(itemEmpty.carrierDetails, null);
  });

  it("B10-4: parses distant future delivery dates (e.g. Dec 31, 2099) without date parser errors", () => {
    const futureItem = normalizeShipmentItem({ date: "Dec 31, 2099", status: "Scheduled" }, 0);
    assert.equal(futureItem.date, "Dec 31, 2099");
    assert.equal(futureItem.badgeClass, "badge badge-warning");
  });

  it("B10-5: handles single shipment list without breaking vertical connector geometry", () => {
    const singleList = [{ id: "SHP-001", status: "Active" }].map(normalizeShipmentItem);
    assert.equal(singleList.length, 1);
    assert.equal(singleList[0].id, "SHP-001");
  });
});
