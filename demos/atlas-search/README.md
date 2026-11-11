# Atlas Search

Full-text com relevância no próprio cluster: analyzer customizado, fuzzy, highlight, autocomplete, regras de ranking, facets, ordenação e sinônimos. Um único índice cobre a demo inteira.

## O que a demo mostra

A demo é voltada ao cliente: primeiro o conceito, depois a prática no cluster. Preparo, roteiro e troubleshooting ficam em `/presenter/atlas-search`.

| Etapa | Tipo | O que acontece no cluster | Mensagem |
|---|---|---|---|
| Capa | — | — | Abertura, sem número na barra lateral |
| 1. O problema | Conceito | — | O usuário não digita como o catálogo foi escrito; regex não resolve |
| 2. Como a busca entende texto | Conceito | — | Analyzer, índice invertido, score e operadores |
| 3. Como o Atlas resolve | Conceito | — | `mongot` no mesmo cluster, sync automático, `$search` no aggregation |
| 4. Dados | Prática | leitura da coleção | Catálogo com `name` e `description` em pt e en |
| 5. Índice | Prática | `createSearchIndex` | Analyzer `folded`, tipos por campo, mapeamento de sinônimos |
| 6. Full-text | Prática | `$regex` vs `$search.text` | Acento, ordem e erro de digitação, com highlight |
| 7. Autocomplete | Prática | `$search.autocomplete` por tecla | Sugestões em milissegundos, com fuzzy |
| 8. Relevância | Prática | `compound` + `boost` + `function` | Regras de negócio dentro do ranking, com `scoreDetails` |
| 9. Facets | Prática | `facet` + `count` + `sort` + `$$SEARCH_META` | Contagens, total e ordenação em uma query |
| 10. Sinônimos | Prática | `insertOne` em `catalog_synonyms` + cronômetro | Sinônimos como dado, sem reindexar |
| 11. Resumo | — | — | Recapitulação e perguntas frequentes |

A busca usa o idioma da página: com `?lang=pt`, os campos `name.pt` e `description.pt`; com `?lang=en`, os campos `.en`.

## Pré-requisitos

- Cluster Atlas **M0, Flex ou M10+**.
- Limites do M0: **3 índices de busca por cluster** e **1 mapeamento de sinônimos por índice**. Esta demo usa 1 índice e 1 mapeamento. A demo de Vector Search usa 3 índices: no mesmo M0, remova um deles antes.

## Preparar antes da reunião

Abra `http://localhost:3000/presenter/atlas-search` e clique em **Preparar tudo** (catálogo, sinônimos e índice).

Pela linha de comando:

```bash
npm run search:setup     # seed (catalog + catalog_synonyms) + índice
npm run search:status    # aguarde READY / queryable=true
npm run search:teardown  # remove o índice e as duas coleções
```

Para criar o índice ao vivo, remova `catalog_search` no presenter: a etapa 5 volta a exibir o botão. Depois de cada apresentação, **Remover sinônimos ao vivo** apaga os sinônimos criados na etapa 10.

## Referência rápida

### Índice (resumo; a definição completa está em [indexes.js](indexes.js))

```js
db.catalog.createSearchIndex("catalog_search", {
  analyzers: [{ name: "folded", tokenizer: { type: "standard" },
                tokenFilters: [{ type: "lowercase" }, { type: "icuFolding" }, { type: "stopword", tokens: [/* pt + en */] }] }],
  mappings: { dynamic: false, fields: {
    name: { type: "document", fields: { pt: [{ type: "string", analyzer: "folded" }, { type: "autocomplete" }], en: [/* idem */] } },
    description: { type: "document", fields: { pt: { type: "string", analyzer: "folded" }, en: { type: "string", analyzer: "folded" } } },
    brand: [{ type: "token" }, { type: "string", analyzer: "folded" }],
    category: { type: "token" }, price: { type: "number" }, rating: { type: "number" }, inStock: { type: "boolean" }
  } },
  synonyms: [{ name: "catalog_synonyms", analyzer: "folded", source: { collection: "catalog_synonyms" } }]
})
```

A coleção `catalog_synonyms` precisa existir, com documentos válidos, antes do índice.

### Regras que costumam gerar dúvida

- `synonyms` e `fuzzy` não podem ser usados no mesmo operador `text`.
- O analyzer do mapeamento de sinônimos precisa ser o mesmo dos campos buscados.
- Facets de texto exigem `token`; facets numéricos exigem `number`. Ordenar texto exige `token` em mapeamento estático.
- `highlight` exige `string` com `indexOptions: offsets` (padrão). Com autocomplete, o autocomplete precisa ser o único operador naquele path.
- `autocomplete.path` aceita um único campo.
- Sem stemming na demo: um analyzer serve os dois idiomas para caber em um mapeamento de sinônimos. Em produção, use o analyzer do idioma (`lucene.portuguese`, `lucene.english`) ou `multi`.

## Playgrounds

Arquivos em [playgrounds/](playgrounds/) para a extensão MongoDB do VS Code ou `mongosh --file`: criação do índice, full-text e autocomplete, relevância e facets, sinônimos ao vivo.
