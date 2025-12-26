# Monorepo — Imagine.club

## Pastas
- apps/web: site público (imagine.club)
- apps/admin: CMS/Admin (admin.imagine.club)
- apps/api: API (backend)
- packages/shared: tipos e utilitários compartilhados
- infra: docker compose, Caddyfile e scripts de deploy
- docs: documentação (Markdown)

## Regras
- UI: seguir estritamente UI_RULES.md
- Mudanças: sempre via Pull Request
- Segredos: nunca no Git (usar .env no servidor e .env.example no repo)
