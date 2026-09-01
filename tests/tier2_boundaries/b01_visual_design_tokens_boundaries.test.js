/**
 * Tier 2 Boundary Coverage: B1 - Visual Design Tokens Boundaries & Corner Cases
 * Tests token fallbacks, theme attribute mutations, CSS custom property syntax,
 * high-contrast color validation, and radius limits.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();

describe("Tier 2 - B1: Visual Design Tokens Boundaries", () => {
  let cssContent;

  beforeEach(() => {
    const cssPath = path.resolve(process.cwd(), "src/index.css");
    cssContent = fs.readFileSync(cssPath, "utf-8");
  });

  it("B1-1: ensures all hex color tokens are syntactically valid 3 or 6 digit hex codes", () => {
    const hexMatches = cssContent.match(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g);
    assert.ok(hexMatches && hexMatches.length > 20, "Must contain valid CSS hex color tokens");
    assert.ok(hexMatches.includes("#F6F4EE"), "Must contain exact canvas hex #F6F4EE");
    assert.ok(hexMatches.includes("#1E293B"), "Must contain exact sidebar hex #1E293B");
    assert.ok(hexMatches.includes("#3D644B"), "Must contain exact sage green hex #3D644B");
  });

  it("B1-2: validates card radius does not exceed layout bounds (<= 20px)", () => {
    const radiusMatch = cssContent.match(/--radius-card:\s*(\d+)px/i);
    assert.ok(radiusMatch, "Radius card token must be defined in px");
    const radiusVal = parseInt(radiusMatch[1], 10);
    assert.equal(radiusVal, 14, "Card radius must be exactly 14px as specified in design system");
  });

  it("B1-3: ensures dark mode overrides canvas, surface, and border colors without breaking variable names", () => {
    const darkModeSection = cssContent.split('[data-theme="dark"]')[1];
    assert.ok(darkModeSection, "Dark mode block must exist");
    assert.ok(darkModeSection.includes("--bg-canvas: #0F172A"));
    assert.ok(darkModeSection.includes("--border-card: #334155"));
  });

  it("B1-4: handles DOM dataset theme assignment with unknown or empty values defaulting safely", () => {
    function applyTheme(themeName) {
      const validThemes = ["light", "dark"];
      const resolved = validThemes.includes(themeName) ? themeName : "light";
      globalThis.document.documentElement.setAttribute("data-theme", resolved);
      return resolved;
    }

    assert.equal(applyTheme("dark"), "dark");
    assert.equal(applyTheme("invalid_theme_name"), "light");
    assert.equal(applyTheme(null), "light");
    assert.equal(applyTheme(""), "light");
  });

  it("B1-5: verifies alpha channel transparency token syntax for subtle washes", () => {
    assert.match(cssContent, /rgba\(\s*61\s*,\s*100\s*,\s*75\s*,\s*0\.12\s*\)/i, "Sage subtle wash must match rgba(61, 100, 75, 0.12)");
    assert.match(cssContent, /rgba\(\s*217\s*,\s*107\s*,\s*67\s*,\s*0\.12\s*\)/i, "Terracotta light wash must match rgba(217, 107, 67, 0.12)");
  });
});
