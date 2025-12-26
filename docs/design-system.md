# Design System — Imagine.club (v0.1)

Objetivo: manter **imagine.club** (site público) e **admin.imagine.club** (CMS) consistentes, limpos e com personalidade.

Estilo: **editorial premium** (profissional) com **toque sutil** de cultura pop (sem exageros).

---

## Base visual (resumo)
- Fundo off-white e superfícies brancas (cards)
- Texto quase preto, alta legibilidade
- Espaço em branco generoso (layout “respira”)
- Cantos arredondados e sombras suaves (sem sombras pesadas)

---

## Cores principais (HEX)
- Background: **#FAFAFA**
- Surface (cards): **#FFFFFF**
- Text primary: **#1A1A1A**
- Accent primary (indigo): **#6366F1**
- Accent secondary (amber): **#F59E0B**
- Semânticas: Success / Warning / Danger (consistentes)

---

## Tipografia
- Fonte: **Inter**
- Pesos: 400 / 500 / 600 / 700
- Base do body: **16px**
- Hierarquia: 12px (caption) até 48px (headline)

---

## Layout e spacing
- Escala de espaçamento: **múltiplos de 8px**
- Max width desktop: **1200px**
- Padding: **24px (desktop)** / **16px (mobile)**

---

## Bordas, sombras e animações
- Rounded corners: **8px a 24px** (dependendo do componente)
- Sombras: **soft shadows** (sempre suaves)
- Transições: suaves, com hover/focus bem definidos

---

## Componentes entregues (o que o produto deve ter)
### Público (imagine.club)
- Header (logo + navegação + PT/EN + busca)
- Buttons (Primary / Secondary / Ghost) + tamanhos
- Inputs (Text / Search) com ícone e estado de erro
- ArticleCard (badge “featured”, hover)
- CreatorCard (capa, verificação, stats)
- Badge/Tag (Primary/Secondary/Success/Warning/Danger/Neutral)
- Pagination (com reticências)
- Load more (gatilho para infinito)
- Skeleton loaders (carregamento)

### Admin (admin.imagine.club)
- Admin Sidebar (colapsável, badges, user profile)
- Admin Table (sortable, render custom)
- Modal (acessível, 4 tamanhos)
- Toast (4 tipos)

---

## Nota importante
Este documento descreve o **padrão visual**.  
Qualquer mudança de design deve atualizar:
1) o Figma
2) este arquivo (`docs/design-system.md`)
3) o `UI_RULES.md` do projeto (para o Antigravity seguir).
