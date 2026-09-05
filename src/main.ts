import { watchRequest, decideChange, receiptForChange } from "./nonprofit_watch.js";
import { embedPage } from "./infrai_embeddings.js";

const raw = process.env.WATCH_REQUEST ?? JSON.stringify({ url: "https://example.org", previousBody: "" });
const request = watchRequest.parse(JSON.parse(raw));
const response = await fetch(request.url, { method: "GET" });
if (!response.ok) throw new Error(`Page fetch failed: ${response.status}`);
const currentBody = await response.text();
const decision = decideChange(request.previousBody, currentBody);
const embedding = await embedPage(currentBody.slice(0, 8000));
console.log(JSON.stringify({ receipt: receiptForChange(request.url, decision), embeddingDimensions: embedding.length }, null, 2));
