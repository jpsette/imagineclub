# Infraestrutura (Cloudflare + DigitalOcean)

## Visão geral
- Site público: `imagine.club`
- CMS/admin: `admin.imagine.club`
- DNS e proteção: Cloudflare
- Servidor: DigitalOcean (Droplet)
- Banco: DigitalOcean (Postgres)

## DNS (Cloudflare)
- Registros A:
  - `imagine.club` → IP do Droplet (Proxied)
  - `admin` → IP do Droplet (Proxied)

## SSL/TLS (Cloudflare)
- Modo: **Full (strict)**
- O servidor (origin) usa **Cloudflare Origin Certificate**.

## Servidor (Droplet)
- Reverse proxy: **Caddy**
- Portas:
  - 80 (HTTP)
  - 443 (HTTPS)

### Certificados no servidor
Arquivos:
- `/etc/ssl/cloudflare/origin-cert.pem`
- `/etc/ssl/cloudflare/origin-key.pem`

Permissões:
- `origin-key.pem`: `root:caddy` (640)
- `origin-cert.pem`: `root:root` (644)

## Estado atual
- Os dois domínios respondem HTTPS com uma mensagem “coming soon”.
- Isso confirma que DNS + Cloudflare + servidor + HTTPS estão funcionando.
