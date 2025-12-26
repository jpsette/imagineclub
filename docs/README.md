# Documentação — Imagine.club

Esta documentação é para pessoas técnicas e não-técnicas. Linguagem simples.

## Onde fica o quê
- Infra (Cloudflare, DigitalOcean, SSL, Caddy): `docs/infra.md`
- Processo (como trabalhamos, Antigravity, PRs, deploy): `docs/processo.md`

## Status atual (resumo)
- Domínios: imagine.club e admin.imagine.club
- Cloudflare: DNS + Proxy ativo, SSL/TLS em Full (strict)
- Servidor (DigitalOcean): Caddy respondendo em HTTPS nos dois domínios (placeholder)
- GitHub: branches `main` e `staging` protegidas (mudanças via Pull Request)
