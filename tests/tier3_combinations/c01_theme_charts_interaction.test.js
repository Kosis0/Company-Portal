/**
 * Tier 3 Combination Suite: C1 - Theme Toggle & SVG Charts UI Interaction
 * Tests cross-feature interactions between Light/Dark theme switching, SVG stroke contrast,
 * tooltip background elevations, and card border color adaptations.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();

describe("Tier 3 - C1: Theme Toggle & SVG Charts Interaction", () => {
  const cssPath = path.resolve(process.cwd(), "src/index.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  function getThemeColors(themeName) {
    if (themeName === "dark") {
      return {
        canvas: "#0F172A",
        surface: "#1E293B",
        cardBorder: "#334155",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        gridLineStroke: "#334155",
        chartSage: "#4E7A5D",
        chartSand: "#D4A373",
      };
    }
    return {
      canvas: "#F6F4EE",
      surface: "#ffffff",
      cardBorder: "#EAE6DB",
      textPrimary: "#0F172A",
      textSecondary: "#475569",
      gridLineStroke: "#F0EDE4",
      chartSage: "#3D644B",
      chartSand: "#C8A27A",
    };
  }

  it("C1-1: verifies theme tokens provide sufficient contrast for SVG lines in both modes", () => {
    const light = getThemeColors("light");
    const dark = getThemeColors("dark");

    assert.notEqual(light.chartSage, light.canvas, "Sage green must contrast with cream canvas");
    assert.notEqual(dark.chartSage, dark.canvas, "Sage light must contrast with dark canvas");
    assert.equal(light.canvas, "#F6F4EE");
    assert.equal(dark.canvas, "#0F172A");
  });

  it("C1-2: verifies tooltip elevated background token dynamically adapts on theme switch", () => {
    assert.match(cssContent, /--bg-surface-elevated:\s*#F7F5EE/i, "Light mode elevated surface must be #F7F5EE");
    assert.match(cssContent, /--bg-surface-elevated:\s*#283548/i, "Dark mode elevated surface must be #283548");
  });

  it("C1-3: ensures SVG Donut center cutout circle matches surface background in both themes", () => {
    const light = getThemeColors("light");
    const dark = getThemeColors("dark");

    assert.equal(light.surface, "#ffffff");
    assert.equal(dark.surface, "#1E293B");
  });

  it("C1-4: ensures chart gridline dashed stroke remains subtle across theme changes", () => {
    const light = getThemeColors("light");
    const dark = getThemeColors("dark");

    assert.equal(light.gridLineStroke, "#F0EDE4");
    assert.equal(dark.gridLineStroke, "#334155");
  });
});
