# Vector Search & Automated Embedding

Busca semântica em que o Atlas gera, armazena e sincroniza os embeddings. A aplicação grava texto e consulta com texto.

> Automated Embedding está **GA no Atlas desde 12/08/2026** (definições editáveis, campos aninhados, métricas de tokens e backpressure automático). A sintaxe abaixo segue a documentação dessa versão.

## O que a demo mostra

A demo é voltada ao cliente: primeiro o conceito, depois a prática no cluster. Preparo, roteiro e troubleshooting ficam em `/presenter`.

| Etapa | Tipo | O que acontece no cluster | Mensagem |
|---|---|---|---|
| Capa | — | — | Abertura, sem número na barra lateral |
| 1. O problema | Conceito | — | Busca por intenção vs palavras exatas |
| 2. Embeddings | Conceito | — | Texto vira vetor, proximidade é similaridade, ANN e ENN |
| 3. Como o Atlas resolve | Conceito | — | Write path, read path e o que sai da aplicação |
| 4. Dados | Prática | leitura da coleção | Documentos só com texto |
| 5. Índice | Prática | `createSearchIndex` com `autoEmbed`, `updateSearchIndex` | Um índice substitui o pipeline |
| 6. Busca | Prática | `$vectorSearch` com `query.text` | Linguagem natural, multilíngue, ANN vs ENN |
| 7. Filtros | Prática | `$vectorSearch.filter` | Regras de negócio na mesma query |
| 8. Ao vivo | Prática | `insertOne` / `updateOne` + cronômetro | O documento vira pesquisável sozinho |
| 9. Manual vs auto | Prática | Voyage API na app + índice `vector` | O código que deixa de existir. Sem `VOYAGE_API_KEY`, mostra só o código |
| 10. Híbrida | Prática | `$rankFusion` ($search + $vectorSearch) | Termos exatos e intenção na mesma query |
| 11. Resumo | — | — | Recapitulação e perguntas frequentes |

## Pré-requisitos

- Cluster Atlas **M0, Flex ou M10+**. Em M10+, **storage auto-scaling** é obrigatório.
- MongoDB **8.0+** para `$rankFusion` (etapa 10).
- Forma de pagamento na organização. Cada org recebe **200M tokens grátis por modelo** (alocação única). A cobrança sai na fatura do Atlas, separada por modelo. No Atlas, Automated Embedding **não precisa de chave Voyage**.
- Opcional: `VOYAGE_API_KEY` no `.env`, usada apenas na etapa 9 (comparação manual).
- Limite do M0: **3 índices de busca**. A demo usa exatamente 3 (`products_autoembed`, `products_vector_manual`, `products_text`).

## Preparar antes da reunião

Abra `http://localhost:3000/presenter` e clique em **Preparar tudo** (dados + índices `autoEmbed` e de texto). A página mostra checklist, status dos índices, roteiro por etapa e os botões de reset e teardown.

Pela linha de comando:

```bash
npm run vector:setup     # seed + índice autoEmbed + índice de texto
npm run vector:status    # aguarde READY / queryable=true
npm run vector:teardown  # remove índices e coleção
```

Para criar o índice ao vivo, remova `products_autoembed` em `/presenter`: a etapa 5 volta a exibir o botão.

## Referência rápida

### Índice

```js
db.products.createSearchIndex("products_autoembed", "vectorSearch", {
  fields: [
    { type: "autoEmbed", modality: "text", path: "description", model: "voyage-4" },
    { type: "filter", path: "category" },
    { type: "filter", path: "price" },
    { type: "filter", path: "inStock" }
  ]
})
```

Opcionais do campo `autoEmbed`: `numDimensions` (256 | 512 | **1024** | 2048), `quantization` (float | **scalar** | binary | binaryNoRescore), `similarity` (o default depende da quantization), `indexingMethod` (hnsw | flat), `hnswOptions`. Não é possível misturar `autoEmbed` e `vector` no mesmo path.

### Query

```js
db.products.aggregate([
  { $vectorSearch: {
      index: "products_autoembed",
      path: "description",
      query: { text: "algo para manter meu café quente na trilha" },
      // model: "voyage-4-lite",   // opcional; precisa ser compatível com o modelo do índice
      numCandidates: 100,          // ou exact: true (ENN)
      limit: 5,
      filter: { inStock: true }
  } },
  { $project: { name: 1, score: { $meta: "vectorSearchScore" } } }
])
```

### Modelos

| Modelo | Uso | US$/1M tokens |
|---|---|---|
| `voyage-4-lite` | volume e custo | 0.02 |
| `voyage-4` | **recomendado** | 0.06 |
| `voyage-4-large` | máxima precisão | 0.12 |
| `voyage-code-4` | código (somente Atlas) | 0.12 |

Os modelos da família `voyage-4` são compatíveis entre si: dá para indexar com `-large` e consultar com `-lite`. Os modelos `voyage-code-*` não são compatíveis com os outros.

## Arquivos

- `service.js`: todas as operações de banco (API e CLI usam este arquivo)
- `pipelines.js`: construção dos pipelines (`auto`, `manual`, `keyword`, `hybrid`)
- `indexes.js`: definições dos 3 índices
- `voyage.js`: cliente Voyage usado apenas na comparação manual
- `playgrounds/`: os mesmos passos em `.mongodb.js` (VS Code MongoDB extension ou `mongosh --file`)
- `public/`: UI guiada, vista pelo cliente. `snippets.js` contém o código exibido na tela
- `presenter/`: página privada com setup, queries sugeridas e troubleshooting. O roteiro de falas e detalhes técnicos fica em `presenter/runbook.js`

## Docs

- [Automated Embedding](https://www.mongodb.com/docs/vector-search/crud-embeddings/automated-embedding/)
- [Index fields (autoEmbed)](https://www.mongodb.com/docs/vector-search/indexes/vector-search-type/)
- [$vectorSearch](https://www.mongodb.com/docs/vector-search/query/aggregation-stages/vector-search-stage/)
- [Billing](https://www.mongodb.com/docs/vector-search/crud-embeddings/automated-embedding/billing/)
- [$rankFusion](https://www.mongodb.com/docs/manual/reference/operator/aggregation/rankfusion/)
