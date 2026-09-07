# India Job Scanner

Scans the career portals of top Indian companies, industry-wise, and ranks openings by **how eligible you actually are** — not just by keyword.

You enter your role, background, location preference and years of experience. The bot returns a ranked list where the top results are the ones you are genuinely qualified for, each with a score and a plain-English explanation of why it matched.

**No AI credits are used.** Once set up, it is ordinary code — scoring is a deterministic algorithm, not a model call.

---

## Run it on your computer (2 minutes)

You need [Node.js](https://nodejs.org) version 18 or newer. Install it once, then:

**Windows** — open Command Prompt in this folder and type:

```
npm start
```

**Mac / Linux** — open Terminal in this folder and type:

```
npm start
```

Then open **http://localhost:8888** in your browser. Press `Ctrl + C` in the command window to stop it.

There is nothing to install — the app has zero dependencies.

---

## Put it online with Netlify

> **Do not use Netlify's drag-and-drop box.** [app.netlify.com/drop](https://app.netlify.com/drop) publishes static pages only — it does not deploy the serverless function this app needs. A dropped site loads fine but every scan fails with a "backend is not running" message. Use one of the two methods below.

### Method A — Netlify CLI (fastest, no GitHub account needed)

From this folder:

```
npm run deploy
```

Or double-click `deploy.cmd` on Windows / run `bash deploy.sh` on Mac.

It signs you in through your browser, then asks a few questions. Choose **Create & configure a new project**, press Enter through the rest. About a minute later it prints your live URL.

To update the site afterwards, run the same command again.

### Method B — GitHub (auto-redeploys on every change)

1. Push this folder to a GitHub repository.
2. In Netlify: **Add new site → Import an existing project → GitHub**, pick the repo.
3. Leave the build settings as Netlify suggests — `netlify.toml` already sets everything.

Every commit then redeploys itself.

### Check it worked

Run one scan, then open the **Connector status** tab. Portals listed with job counts means the function is live.

### Already deployed by drag-and-drop and want to keep the URL?

```
npm run deploy
```

When asked what to do, choose **Link this directory to an existing project** and pick your site. The address stays the same and the backend appears.

### Why a backend is needed at all

Browsers block a web page from calling another company's website directly (the same-origin policy), so the portal reading has to happen server-side. That is all `netlify/functions/api.mjs` does. It is deliberately self-contained — no imports, no dependencies — so it deploys correctly with or without a build step.

### Other troubleshooting

| Symptom | Fix |
|---|---|
| `Unexpected token '<' ... is not valid JSON` | The old symptom of a drag-and-drop deploy. Redeploy with Method A. |
| Site loads, scan returns very few jobs | Normal without an Adzuna key — add one below. |
| A single company shows `HTTP 404` in Connector status | That company changed hiring systems. Harmless; fix or remove its row when convenient. |

---

## Optional: switch on wide coverage (recommended, free)

Out of the box the bot reads company career portals directly. That covers the companies which publish a machine-readable feed — good depth, but it misses employers with closed portals (TCS, HDFC, Deloitte and similar).

Adding a free **Adzuna** key widens coverage to essentially every employer advertising in India:

1. Sign up at [developer.adzuna.com](https://developer.adzuna.com) and copy your **App ID** and **App Key**.
2. **On Netlify:** Site settings → Environment variables → add `ADZUNA_APP_ID` and `ADZUNA_APP_KEY`, then redeploy.
3. **On your computer:** create a file named `.env` next to `server.js` containing:

```
ADZUNA_APP_ID=your_id_here
ADZUNA_APP_KEY=your_key_here
```

Everything still works without a key — you just get fewer results.

---

## How the ranking works

Every opening is scored out of 100:

| Component | Points | What it measures |
|---|---|---|
| Role match | 40 | Does the title and description match the role you want, including related terms from your role family |
| Experience fit | 25 | Does your experience fall inside the band the posting asks for |
| Location fit | 20 | Is it in a city you chose, or remote |
| Background fit | 15 | Do your qualifications, tools and target industries appear in the posting |

A job is marked **eligible** only if it clears three hard gates: your experience overlaps the requirement, the location works for you, and the role is a real match rather than a loose one. Eligible jobs always sort above everything else, so the top of your list is only roles you can actually apply to with a straight face.

| Verdict | Meaning |
|---|---|
| **Perfect fit** | Eligible, scored 78+. Apply. |
| **Strong fit** | Eligible, scored 60–77. Worth applying. |
| **Stretch** | Close, but one gate failed — usually experience or city. |
| **Reach** | Different function or a big experience gap. |

The bot also tells you what is *missing* — "wants 5+ yrs, you are 2 years short" — so a rejection is never a mystery.

---

## The three tabs

- **Find jobs** — your profile, the scan, and the ranked results. Your inputs are remembered on your own device. **Download CSV** exports the matches for tracking.
- **Company coverage** — all 182 companies the bot knows, by industry. A green dot means the bot reads that portal automatically. Every other company gets a one-click pre-filled search.
- **Connector status** — which portals answered on the last scan and how many India roles each returned. A portal that stops responding is skipped silently; the company stays in Coverage.

---

## Adding a company

Open `netlify/functions/api.mjs` and find **Section 1 — Company Master** near the top. Copy any line and change the fields:

```js
{ name: 'Acme Capital', industry: 'NBFC & Fintech', tier: 2,
  careers: 'https://acme.com/careers' },
```

If the company runs on Greenhouse, Lever, Ashby, SmartRecruiters, Workable or Recruitee, add a live feed too. The token is the company name in its job-board URL — for `boards.greenhouse.io/druva`, the token is `druva`:

```js
{ name: 'Druva', industry: 'Product & SaaS', tier: 3,
  careers: 'https://www.druva.com/about/careers',
  ats: { type: 'greenhouse', token: 'druva' } },
```

Save the file, then re-upload the folder to Netlify (or restart your local server). Check the **Connector status** tab to confirm it worked — a wrong token shows up there as `HTTP 404` and breaks nothing else.

---

## Adjusting the ranking

**Section 2 — Scoring Model**, in the same file, holds the whole model:

- `ROLE_FAMILIES` — the vocabulary each role family expands into. Add terms your industry uses.
- `SENIORITY` — how job titles map to years of experience.
- `CITY_ALIASES` — city groupings (Gurugram, Noida and Delhi all count as NCR).
- `scoreJob()` — the point weights, at the top of the function.

---

## What's in the folder

```
index.html                   the interface
assets/app.js                front-end logic
assets/styles.css            styling (light and dark)
netlify/functions/api.mjs    the entire backend, one file  ← edit this
                               Section 1  company master
                               Section 2  scoring model
                               Section 3  portal readers
                               Section 4  API endpoints
server.js                    local runner for command prompt
deploy.cmd / deploy.sh       one-click Netlify deploy
netlify.toml                 Netlify configuration
```

Everything the scanner does lives in that one backend file, on purpose: a single file with no imports deploys reliably on Netlify with or without a build step, and there is only ever one copy of the company list to keep straight.

---

## Known limits

- **Naukri and LinkedIn have no public API.** They cannot be scanned legally or reliably, so they are not included. The Coverage tab's search links are the fastest route into them.
- **Portal coverage is uneven.** Large Indian corporates mostly run closed portals (Workday, SuccessFactors, in-house), which is exactly the gap the optional Adzuna key fills.
- **Live feeds drift.** Companies migrate between hiring systems. When one stops responding, the Connector status tab tells you which, and fixing it is a one-line edit.
- **Scoring reads text, not intent.** A posting that hides its real requirement in an attachment will be scored on what it actually says.
