import { createHash } from "node:crypto";
import { z } from "zod";

export const watchRequest = z.object({
  url: z.string().url(),
  previousBody: z.string().default("")
});

export type WatchRequest = z.infer<typeof watchRequest>;

export function fingerprint(body: string): string {
  return createHash("sha256").update(body).digest("hex");
}

export function decideChange(previousBody: string, currentBody: string) {
  const previous = fingerprint(previousBody);
  const current = fingerprint(currentBody);
  return { changed: previous !== current, previous, current };
}

export function receiptForChange(url: string, decision: ReturnType<typeof decideChange>) {
  return {
    kind: "website-change-alert",
    url,
    changed: decision.changed,
    message: decision.changed ? `Review the updated nonprofit page: ${url}` : "No page change detected"
  };
}
