# Kit prospecção YC — prompt para agente

Referência fixa para **Message + Message 2** na planilha **master** do Notion. Tom **humano**, **natural**, **sem cara de IA**. Mensagens em **inglês** (founders YC).

**Planilha única:** [`docs/prospeccao-yc-master.md`](../docs/prospeccao-yc-master.md) (links Notion + data source MCP).

Leia também: [`positioning.md`](../positioning.md), [`pitch/offer.md`](../pitch/offer.md).

## Onde escrever (obrigatório)

| ✅ Sim | ❌ Não |
|--------|--------|
| **YC CEOs — master outreach** (dentro de *YC CEOs — master (Weeks 1–5 merged)*) | Week 1, Week 2, Week 3, Week 4, Week 5 (só arquivo) |
| Novas linhas no **master** com `Source week` = rótulo do lote | Criar nova database “Week N” só para mensagens |
| Data source MCP: `collection://3b1fd109-9879-4ab1-9cff-23f2d075b483` | Duplicar mensagens em duas planilhas |

Link de trabalho (humano): https://app.notion.com/p/YC-CEOs-master-Weeks-1-5-merged-3dd0f86a17208174bc33d1f37773a50d?v=3cf0f86a172081f3b94a000c5077834c

## Estratégia comercial (set 2026)

- **Foco atual:** clientes **pagos**. DUDESIGN é product design partner para AI startups (product + UX/UI + interface em código).
- **Free:** já há **2–3 projetos free** em andamento ou fechados. **Não** oferecer trabalho grátis, case study swap, ou “no cost” em mensagens novas.
- **Se o pipeline pagar secar** (free acabaram e zero clientes novos), Daniel pode autorizar voltar ao free — até lá, só paid.
- **Nunca** enviar convites ou DMs no LinkedIn a partir do agente. Só rascunhos na planilha. Paulo/Daniel revisam e enviam manualmente.

## O que vender (sem pitch frio)

- **Partner engagement**, não vaga IC nem agency genérica.
- **Entrega:** product judgment, UX/UI, **production UI in code** (React/Next).
- **Não** abrir DM com tabela de preço. Se perguntarem: Standard ~8 semanas / $21k para uma surface fechada; Partner $6k/mo (detalhes em `pitch/offer.md`).
- **CTA leve:** loom curto em **uma** tela, ou call de 15 min — opcional, fácil recusar (“one word is fine”).

## Regras de escrita

- Frases curtas. Parágrafos com linha em branco entre blocos (como nas semanas 3–5).
- Variar abertura (“Paulo here” / “I'm Paulo” / “Product designer…”).
- **Proibido:** em dash longo `—`; travessão como pontuação; “I'd love to”; “reach out”; “synergy”; “leverage”; “excited”; “game-changer”; “I hope this finds you well”.
- **Proibido (oferta):** free, no cost, at no cost, case study for me, trade, in return I write it up.
- Mencionar **DUDESIGN** no máximo uma vez, de forma natural.
- Personalizar **uma** hipótese de surface com base no one-liner (ex.: timeline de agent run, review screen, inbox de voz, etc.).
- Message 2: **um** follow-up só, tom “friendly nudge”, sem repetir o Message 1 inteiro.

## Colunas Notion (master)

| Campo | Uso |
|-------|-----|
| **Message** | **Convite** LinkedIn (nota curta ao pedir conexão, ~300 chars quando possível) |
| **Message 2** | **Resposta** após aceitar (primeiro DM: quem é Paulo, paid partner, 1 hipótese de UI, loom opcional) |
| Status | Não alterar salvo instrução explícita |
| Source week | Rótulo do lote (Week 6, expansion Sep 2026, etc.) |
| Notes | Só se houver flag (dupe, skip, etc.) |

Gerador no repo: `scripts/generate_yc_paid_messages.py` (invite + reply humanizados, variação por pessoa).

## Template Message (convite)

```
Hi {FirstName}, Paulo here. I design product UI for AI teams and ship the front end. {Company} stood out on YC. Would be good to connect.
```

Variar abertura; manter curto e coloquial. Sem oferta free. Sem pitch longo no convite.

## Template Message 2 (resposta)

```
Thanks for connecting, {FirstName}.

I'm Paulo. I run DUDESIGN, a small product design partner for AI startups. Product calls, UX/UI, and we implement the interface in React/Next, not just Figma.

On {Company}, I'd probably poke at {surface} first. {Why it matters in plain words}.

If it's ever useful, I can record a quick loom on one screen. No call unless you want one. If not, totally fine.
```

Tom de mensagem real (contractions, uma ideia concreta). **Message 2 não é bump**; é a primeira resposta depois do connect.

## Surface hints (escolher 1 por empresa)

Use o one-liner YC. Exemplos:

| Sinal no one-liner | Onde começar (UI) |
|--------------------|-------------------|
| agent / automation | agent run timeline or handoff screen |
| voice / call | live call or escalation UI |
| eval / observability / quality | run detail or eval comparison view |
| docs / documentation | in-app doc or changelog users actually read |
| hiring / ATS / CRM | pipeline or candidate review screen |
| legal / compliance | review queue or approval step |
| hardware / CAD | primary workspace or config panel |
| data / training | dataset or labeling review UI |
| default | main workflow screen where users decide to trust the output |

## Exclusões e dedupe

- Dedupe contra **master** (Name + LinkedIn slug), não contra week sheets isoladas.
- LinkedIn **só** de páginas YC live (`data-page` founders).
- Linhas `[FAKE DELETE]` / `[DUP DELETE]`: não mensagem.

## Prompt para colar em chat novo (mensagens)

```
Você preenche Message + Message 2 SOMENTE na planilha master YC CEOs — master outreach (Notion). Leia docs/prospeccao-yc-master.md e scripts/prospeccao-yc-kit-prompt.md, positioning.md, pitch/offer.md.

Data source: collection://3b1fd109-9879-4ab1-9cff-23f2d075b483

Regras: inglês, tom humano, SEM oferta free/case study swap. Foco clientes pagos. Personalize surface a partir do one-liner. NÃO editar Week 1–5 week databases. Nunca enviar LinkedIn. Não mudar Status salvo pedido.

Entrega: atualizar linhas no master + opcional messages.json no repo. Nada enviado ao LinkedIn.
```

## Prompt separado — roster (novos CEOs no master)

```
Adicione novos CEOs YC como linhas na database YC CEOs — master outreach (Notion), data source collection://3b1fd109-9879-4ab1-9cff-23f2d075b483. Dedupe contra o master. LinkedIn só do YC. Status = To send invite. Source week = Week N (rótulo). NÃO criar planilha Week separada para mensagens.

Depois preencha Message + Message 2 com scripts/prospeccao-yc-kit-prompt.md (paid). Nunca enviar DMs.
```
