# AGENTS.md

## Cursor Cloud specific instructions

**Product**: AIRich — an AI-powered rich text editor built with Next.js 14, TipTap (ProseMirror), and the Coze AI API.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Next.js dev server | `npm run dev` | 3000 | The only service; includes both UI and API routes |

### Standard commands

See `package.json` scripts: `npm run dev`, `npm run build`, `npm run lint`, `npm start`.

### Non-obvious caveats

- Both `package-lock.json` and `yarn.lock` exist. Use **npm** (matches `package-lock.json`).
- The AI chat feature requires `NEXT_PUBLIC_COZE_BOT_ID` and `NEXT_PUBLIC_COZE_API_TOKEN` in `.env.local`. The editor itself works without these; only the Coze AI integration will fail.
- No automated test suite exists in this repo (`npm test` is not configured). Validation is done via `npm run lint` and `npm run build`.
- The TipTap editor loads immediately on the homepage (`/`). There is no login or authentication required.
- The HocusPocus collaboration server is referenced in code but not bundled; real-time collaboration is non-functional without an external WebSocket server (not required for local dev).
