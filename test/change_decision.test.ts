import assert from "node:assert/strict";
import { decideChange, receiptForChange } from "../src/nonprofit_watch.js";

const unchanged = decideChange("donation form", "donation form");
assert.equal(unchanged.changed, false);
assert.equal(receiptForChange("https://example.org", unchanged).message, "No page change detected");

const changed = decideChange("old campaign total", "new campaign total");
assert.equal(changed.changed, true);
assert.match(receiptForChange("https://example.org", changed).message, /Review the updated/);
console.log("change decision test passed");
