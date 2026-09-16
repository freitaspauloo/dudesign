# YC CEOs outreach — planilha master (Notion)

**Fonte única** para Message, Message 2, Status e novos contatos YC. As planilhas Week 1–5 no Notion são **arquivo** (roster/status histórico); **não** editar mensagens lá.

## Links

| O quê | URL |
|-------|-----|
| **Página master (trabalho)** | https://app.notion.com/p/YC-CEOs-master-Weeks-1-5-merged-3dd0f86a17208174bc33d1f37773a50d?v=3cf0f86a172081f3b94a000c5077834c |
| Database | https://app.notion.com/p/d98d651796c04f70900f46e090c52979 |
| Data source (MCP / SQL) | `collection://3b1fd109-9879-4ab1-9cff-23f2d075b483` |

## Repo (agente)

| Arquivo | Uso |
|---------|-----|
| [`scripts/prospeccao-yc-kit-prompt.md`](../scripts/prospeccao-yc-kit-prompt.md) | Tom, templates paid, prompts para colar em chat |
| [`scripts/generate_yc_paid_messages.py`](../scripts/generate_yc_paid_messages.py) | Gera Message + Message 2 a partir de JSON (stdin) |
| [`positioning.md`](../positioning.md) / [`pitch/offer.md`](../pitch/offer.md) | Oferta comercial |

## Regras operacionais

1. **Escrever mensagens** só na tabela **YC CEOs — master outreach** (parent: *YC CEOs — master (Weeks 1–5 merged)*).
   - **Message** = texto do **convite** (conexão LinkedIn, curto).
   - **Message 2** = **resposta** após aceitar (primeiro DM, paid partner, humano).
2. **Novos CEOs:** criar linha no **master**; preencher Batch, Company, LinkedIn, One-liner, Role, YC; Status = `To send invite`; **Source week** = rótulo do lote (ex. `Week 6`).
3. **Dedupe:** não repetir Name ou slug do LinkedIn já presente no master. Ignorar `[DUP DELETE]`, `[FAKE DELETE]`, página *FAKE rows to delete*.
4. **LinkedIn:** agente **nunca** envia convite ou DM; Paulo/Daniel enviam manualmente após revisão.
5. **Oferta (set 2026):** clientes **pagos** — ver kit; sem oferta free / case study swap em mensagens novas.

## Views no master

- **All** — tabela completa com Message / Message 2 (view id interno `3dd0f86a-1720-8101-a1ff-000cf15530c3`)
- **By status** — board por Status
- **Default view** — tabela padrão

O parâmetro `v=` na URL do Notion pode diferir do view id MCP; use sempre a **página master** acima como bookmark.

## Filtros úteis

- `Name` does not contain `[DUP DELETE]`
- `Status` = `To send invite` (fila de rascunho / envio)
- Ordenar por `Source week` ao auditar lotes

## Histórico Week 1–5

Merge de 700 pessoas únicas (set 2026). Semanas antigas permanecem no Notion para referência; **sync de mensagens para o master** já foi feito onde aplicável. Daqui em diante, tratar só o master como live.
