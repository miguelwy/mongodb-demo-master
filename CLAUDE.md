# MongoDB Demo Hub

Demo hub for a MongoDB Solutions Architect. Every demo hits a real Atlas cluster (`MONGODB_URI` in `.env`).

- Node 20+, ESM, Express 5, MongoDB driver 7. No build step; frontend is vanilla JS modules.
- UI is bilingual (pt / en). Never hard-code user-facing text: add the key to BOTH languages in the demo's `public/i18n.js` and use `data-i18n` / `t()`. Snippet comments and example queries are localized in `snippets.js` (`COPY`).
- Source code identifiers and comments are English.
- Client-facing pages (`public/`) are shown to customers: concept first, then practice. No setup, .env, talk tracks or presenter tips there. Those belong in the demo's `presenter/` page, served at `/presenter/<id>` and guarded by `presenterOnly` (loopback only); destructive or setup API routes go on the guarded `presenter` router.
- Keep the MongoDB palette (tokens in `public/css/mongo.css`). Dark is the default, with a light toggle.
- New demo = `demos/<id>/` + register in `demos/index.js` (see README "Como adicionar uma demo").
- Code shown on screen (`public/snippets.js`) must stay in sync with what the backend actually runs.
- MongoDB features change fast: verify syntax against current docs before adding or editing a demo.
