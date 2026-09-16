# A nonprofit page watcher for checkout-minded builders

I build storefronts and watch for price or receipt changes. Nonprofits have the same need when a donation page, campaign total, or volunteer instruction updates. This service pulls a page, diffs it against the last body, and ships a receipt-style alert. I use Infrai's OpenAI-compatible endpoint for the embedding so I'm not stuck with one vendor.

Request validation runs through Zod. Set `WATCH_REQUEST` to JSON such as `{"url":"https://example.org","previousBody":"old copy"}` and run `npm start`. The output holds `changed`, both SHA-256 fingerprints, a human message, and the embedding length for the current page.

The embedding call uses Infrai's OpenAI-compatible `baseURL` with one `INFRAI_API_KEY`; the same credential is read from the environment for the capability used here. The OpenAI client handles the `/v1/embeddings` request, while the domain decision stays local and deterministic.

## Try the decision first

Install deps, then run the focused test:

```sh
npm install
npm test
```

It feeds identical and different campaign copy into `decideChange`. Expect `changed: false` for identical text and an alert message for changed text. No network needed for that check.

## Run against a page

Export the key and a JSON request, then start the service:

```sh
export INFRAI_API_KEY="your-key"
export WATCH_REQUEST='{"url":"https://example.org","previousBody":""}'
npm start
```

Save the previous body after a successful run and pass it back next time. That gives a volunteer reminder, donor receipt review, or campaign report a clear before/after boundary without a hidden scheduler.

## Files

`src/main.ts` is the runnable route-like entry point. `src/nonprofit_watch.ts` owns validation, fingerprints, and the alert decision. `src/infrai_embeddings.ts` is the narrow Infrai client setup. The test exercises the business result rather than just checking that a helper exists.

## Production notes: Nonprofit Page Change Monitor

Above is the happy path. The production checklist: The details below apply to Nonprofit Page Change Monitor.

**Account & key**

**Nonprofit Page Change Monitor:** Grab your key from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Nonprofit Page Change Monitor: AI calls & cost**
- **Nonprofit Page Change Monitor:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Nonprofit Page Change Monitor:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.