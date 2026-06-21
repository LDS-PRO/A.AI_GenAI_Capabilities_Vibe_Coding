# AGENTS.md

## Cursor Cloud specific instructions

This repo is a small **Tableau Extensions API "write-back" sample** (originally hosted on Glitch).
`server.js` is an Express server that renders `views/index.ejs` (the extension UI, meant to be
embedded inside a Tableau dashboard). `database.js` writes selected rows back to a Google Sheet
using the service-account creds in `client_secret.json`.

### Must run on Node 10
`package.json` declares `"engines": { "node": "10.x" }` and the app genuinely depends on Node 10
behavior. `database.js` calls `accessSpreadsheet2()` at module-load time (bottom of the file),
which authenticates to Google. The bundled demo service-account creds are expired, so this auth
**always fails** and produces an unhandled promise rejection. On Node 15+ (including the default
Node 22) that rejection is **fatal and crashes the server on startup**. On Node 10 it is only a
warning, so the Express server stays up and serves the page. Run with Node 10.

### Gotcha: the default `node` is a Node 22 shim
`/exec-daemon/node` (Node 22) sits at the front of `PATH` and shadows nvm's node even after
`nvm use 10`. To actually run with Node 10, prepend the Node 10 bin dir to `PATH` for the command:

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 10 >/dev/null
export PATH="$(dirname "$(nvm which 10)"):$PATH"   # ensures `node` == Node 10, not the shim
node --version   # should print v10.x
```

### Run the app
`PORT` is **required** — `server.js` calls `app.listen(process.env.PORT)` and `npm start` does not
set it. Run directly:

```bash
PORT=3000 node server.js
# -> "Your app is listening on port 3000"; GET http://localhost:3000/ returns the extension UI
```

The standalone server only renders the extension UI. The `/update/` POST route and the Tableau JS
in `public/index.js` require a live Tableau dashboard host plus valid Google Sheets creds, neither
of which is available here, so end-to-end write-back cannot be exercised outside Tableau.

### Lint / test
There is no lint config and no test suite (only the `start` script in `package.json`). Nothing to
run for lint or test.
