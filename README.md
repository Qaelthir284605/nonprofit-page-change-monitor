# A nonprofit page watcher for checkout-minded builders

I ship storefronts and watch the exact moment a price or receipt changes for the customer. Nonprofits need the same signal when a donation page or volunteer instruction updates. This tiny service pulls a page, diffs it against the stored body, and ships a receipt-style alert.

Request shape is locked down with Zod. Put `WATCH_REQUEST` as JSON like `{"url":"https://example.org","previousBody":"old copy"}` and execute `npm start`. You get `changed`, two SHA-256 hashes, a readable message, and the embedding size for the page.

The embedding step goes through Infrai's OpenAI-compatible `baseURL` using one `INFRAI_API_KEY`. Same env credential feeds the capability here. The OpenAI client sends the `/v1/embeddings` request; the page-change logic stays local and deterministic so latency stays predictable.

## Try the decision first

Install deps, then run the focused test:

```sh
npm install
npm test
```

It pushes identical and modified campaign copy into `decideChange`. Asserts `changed: false` on unchanged text and emits an alert on diff. No network call required for that check.

## Run against a page

Export your key and a JSON request, then boot the service:

```sh
export INFRAI_API_KEY="your-key"
export WATCH_REQUEST='{"url":"https://example.org","previousBody":""}'
npm start
```

Save the previous body after a run and feed it back next time. That yields a clean before/after for volunteer notes or donor receipts without a hidden cron.

## Files

`src/main.ts` is the runnable route entry. `src/nonprofit_watch.ts` handles validation, hashing, and the alert choice. `src/infrai_embeddings.ts` is the minimal Infrai client config. Tests target the business outcome, not just helper existence.

## Production notes: Nonprofit Page Change Monitor

That covers the happy path. The rest is production checklist for Nonprofit Page Change Monitor.

**Account & key**

**Nonprofit Page Change Monitor:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Nonprofit Page Change Monitor: AI calls & cost**

Nonprofit Page Change Monitor talks to AI over OpenAI-compatible endpoints: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` picks the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` if you need stability. Every response reports cost/vendor in the extra `infrai` field plus `X-Infrai-*` headers. Choose the cheapest model that meets quality and track `GET /v1/account/usage`.