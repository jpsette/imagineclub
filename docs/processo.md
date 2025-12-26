# Processo de trabalho (simples)

## Como fazemos mudanças
- Nada é alterado direto na `main`.
- Tudo entra por **Pull Request (PR)**.
- A branch `staging` serve para validar antes de produção.

## Regras de segurança
- Nunca colocar senhas, tokens ou chaves no repositório.
- Sempre usar `.env` no servidor e `.env.example` no Git.

## Como usamos o Antigravity
O Antigravity trabalha em “missões” pequenas, sempre entregando PR.

### Regras para o Antigravity (obrigatórias)
- Não usar comandos destrutivos.
- Não usar `sudo`.
- Operar apenas dentro da pasta do repositório.
- Não commitar segredos.
- Entregar tudo via PR.
- Ao final de cada missão, listar o que precisa de ação humana.

## Estrutura do projeto (planejada)
- `apps/web`: site público
- `apps/admin`: CMS
- `apps/api`: backend
- `infra/`: docker, caddy e scripts de deploy

## Deploy (resumo)
- Cloudflare faz DNS e SSL.
- O servidor (Droplet) roda containers e o Caddy faz reverse proxy.
- Atualizações entram por PR → merge → deploy.
