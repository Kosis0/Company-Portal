/**
 * Tier 1 Feature Coverage: F1 - Visual Design System Tokens
 * Verifies root CSS custom properties, Light & Dark themes, card radii, borders,
 * Sage Green active pills, Terracotta alert tones, and Warm Sand chart accents.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { setupTestEnvironment } from "../helpers/test-harness.js";

setupTestEnvironment();

describe("Tier 1 - F1: Visual Design System Tokens & Theme Foundation", () => {
  let cssContent;

  beforeEach(() => {
    const cssPath = path.resolve(process.cwd(), "src/index.css");
    cssContent = fs.readFileSync(cssPath, "utf-8");
  });

  it("F1-1: defines Editorial Cream canvas background tokens in light mode", () => {
    assert.match(cssContent, /--bg-canvas:\s*#F6F4EE/i, "Root CSS must define --bg-canvas: #F6F4EE");
    assert.match(cssContent, /--bg-canvas-warm:\s*#FAF8F3/i, "Root CSS must define --bg-canvas-warm: #FAF8F3");
  });

  it("F1-2: defines Deep Slate Navy sidebar and Sage Green active pill tokens", () => {
    assert.match(cssContent, /--bg-sidebar:\s*#1E293B/i, "Root CSS must define --bg-sidebar: #1E293B");
    assert.match(cssContent, /--sidebar-pill-active:\s*#3D644B/i, "Sidebar active pill must be Sage Green #3D644B");
    assert.match(cssContent, /--brand-sage:\s*#3D644B/i, "Brand sage token must be #3D644B");
  });

  it("F1-3: defines Content Card tokens with 14px border radius and soft border", () => {
    assert.match(cssContent, /--radius-card:\s*14px/i, "Card radius token must be 14px");
    assert.match(cssContent, /--border-card:\s*#EAE6DB/i, "Card border token must be #EAE6DB");
  });

  it("F1-4: defines Terracotta and Warm Sand accent tokens for alerts and charts", () => {
    assert.match(cssContent, /--accent-terracotta:\s*#D96B43/i, "Alert tone must be Terracotta #D96B43");
    assert.match(cssContent, /--accent-sand:\s*#C8A27A/i, "Secondary chart accent must be Warm Sand #C8A27A");
  });

  it("F1-5: defines Dark Mode tokens with Deep Slate canvas and elevated surfaces", () => {
    assert.match(cssContent, /\[data-theme="dark"\]/i, "CSS must declare dark theme selector");
    assert.match(cssContent, /--bg-canvas:\s*#0F172A/i, "Dark theme canvas must be #0F172A");
    assert.match(cssContent, /--border-card:\s*#334155/i, "Dark theme card border must be #334155");
  });
});
