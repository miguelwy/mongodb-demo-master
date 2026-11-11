# MongoDB Demo Hub

Repositório único de demos do MongoDB para apresentações de Solutions Architecture. Cada demo roda contra um **cluster Atlas real** e traz guia passo a passo, código (mongosh, Node.js e Python), dicas de talk track e prática ao vivo. As demos podem ser apresentadas isoladas ou em sequência.

| Demo | Status | Pasta |
|---|---|---|
| Vector Search & Automated Embedding | ✅ | [demos/vector-search](demos/vector-search/README.md) |
| Atlas Search | ✅ | [demos/atlas-search](demos/atlas-search/README.md) |
| Queryable Encryption, Change Streams, Time Series, Stream Processing, RAG | roadmap | — |

## Setup

Pré-requisitos: Node.js 20+ e um cluster Atlas (M0, Flex ou M10+) com seu IP liberado em **Network Access**.

```bash
npm install
cp .env.example .env      # preencha MONGODB_URI
npm start                 # http://localhost:3000
```

### Área do apresentador

`http://localhost:3000/presenter/<id>` (ex.: `/presenter/atlas-search`; `/presenter` abre a primeira demo) reúne setup, checklist, status dos índices, roteiro, queries sugeridas, troubleshooting e teardown. A página não tem link na demo e só responde na máquina que roda o servidor: acesso remoto, proxy ou túnel recebem 404. Por padrão o servidor escuta em `127.0.0.1`; use `HOST=0.0.0.0` só se quiser expor a demo do cliente na rede.

### Idioma (PT / EN)

O botão **PT/EN** na barra superior troca o idioma e a escolha fica salva no navegador. Para mandar um link direto, use `?lang=en` ou `?lang=pt` (ex.: `http://localhost:3000/demos/vector-search/?lang=en#4`). Sem preferência salva, a página segue o idioma do navegador.

Para preparar uma demo antes da reunião, use **Preparar tudo** no presenter da demo ou `npm run vector:setup` / `npm run search:setup`. Os outros scripts estão em `package.json`.

## Estrutura

```
server.js                 # hub: monta cada demo em /api/<id> e /demos/<id>
lib/                      # config (.env) e cliente MongoDB compartilhado
public/                   # página do hub + CSS/JS compartilhados (paleta MongoDB, etapas) e logos em img/
demos/
  index.js                # registro de demos + roadmap
  <id>/
    index.js              # exporta { meta, router, publicDir, presenterDir }
    service.js            # lógica de banco (usada pela API e pela CLI)
    cli.js                # setup/teardown via npm scripts
    public/               # página guiada da demo (o que o cliente vê)
    presenter/            # página privada: setup, roteiro e teardown
    playgrounds/          # arquivos .mongodb.js para o VS Code / mongosh
    README.md             # guia escrito
```

## Como adicionar uma demo

1. Crie `demos/<id>/index.js` exportando `meta` (`id`, `title`, `description`, `tags`, `path`), `router` (Express), `publicDir` e `presenterDir`.
2. Registre a demo em [demos/index.js](demos/index.js) e remova o item correspondente do `roadmap`.
3. Na página, reaproveite `/css/mongo.css`, `/css/steps.css`, os helpers de `/js/ui.js` (`api`, `codeBlock`, `toast`, `busy`) e a navegação de `/js/steps.js` (`initSteps`).
4. Textos em dicionários `{ pt, en }` (veja `demos/vector-search/public/i18n.js`): use `data-i18n="chave"` no HTML e `t('chave')` no JS, via `createI18n` de `/js/i18n.js`. Os textos de `meta` e do `roadmap` são `{ pt, en }`.
5. Use sempre o banco `DB_NAME` e uma coleção própria da demo, e ofereça um teardown.
