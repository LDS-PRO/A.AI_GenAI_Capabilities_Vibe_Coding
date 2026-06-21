# Write-Back Extension

A tiny Glitch-hosted Express app (Tableau Extensions API write-back demo). It serves an EJS page (`views/index.ejs`) plus static assets in `public/`, and exposes a `POST /update/` route that writes back to a Google Spreadsheet via a service account.

See `README.md` for project background.

## Cursor Cloud specific instructions

- Single Node/Express service. Dependencies install with `npm install` (no lockfile-managed build steps). `shrinkwrap.yaml` is a stale pnpm artifact; this repo uses npm (`package-lock.json`).
- `package.json` declares `engines.node` as `10.x`, but the app runs fine on the VM's Node 22. Expect an `EBADENGINE` npm warning; it is non-fatal.
- The server reads the port from `process.env.PORT` (no default). Start it with `PORT=3000 node server.js`.
- Gotcha — startup crash on modern Node: `database.js` eagerly calls `accessSpreadsheet2()` at module load. The bundled Google service-account credential (`client_secret.json`, from the original 2020 demo) is dead and returns HTTP 400. On the intended Node 10, an unhandled rejection is just a warning, but on Node 22 it crashes the process at startup. Run with the rejection mode relaxed to start the dev server: `PORT=3000 node --unhandled-rejections=warn server.js`. Do not "fix" this by editing `database.js` unless asked; it is expected behavior given the expired external credential.
- Once running, `GET /` returns 200 with the server-rendered `MS SQL Writeback` page; `POST /update/` is routed to the handler but never sends a response (the downstream Google write fails on the dead credential), so the request hangs. Unknown routes return 404.
- The frontend (`public/index.js`) expects the Tableau Extensions host (`window.tableau.extensions`); outside a Tableau dashboard that init fails, but the page still renders and is interactive.
- No lint or automated test setup exists (`npm test` is not defined). The only script is `npm start`.
