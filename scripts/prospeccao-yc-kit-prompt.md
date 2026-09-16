# Kit prospecção YC — prompt para agente

Referência fixa para preencher planilhas **YC CEOs** no Notion (Message + Message 2). Tom **humano**, **natural**, **sem cara de IA**. Mensagens em **inglês** (founders YC).

Leia também: [`positioning.md`](../positioning.md), [`pitch/offer.md`](../pitch/offer.md).

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

## Colunas Notion

| Campo | Uso |
|-------|-----|
| Message | Primeiro DM após connect (ou corpo principal) |
| Message 2 | Follow-up único |
| Status | Não alterar salvo instrução explícita |
| Notes | Só se houver flag (dupe, skip, etc.) |

## Template Message 1 (paid)

```
Hi {FirstName}, Paulo here. Product designer — mostly UI for AI and technical teams.

I run DUDESIGN as a design partner for AI startups: product calls, UX/UI, and we ship the interface in code.

{One sentence tying their product to a concrete UI surface — not generic praise.}

If it's useful, I can send a short loom on one screen I'd tighten — no deck. If timing's bad, one word is enough.
```

## Template Message 2 (paid)

```
Hi {FirstName}. Friendly bump once.

Still happy to share a quick, concrete take on {surface hint} at {Company} if that helps. No pitch call unless you want one.

If it's not on your radar, totally fine — just say so.
```

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

- Não reutilizar LinkedIn slugs já nas semanas 1–5 ou no master merged.
- LinkedIn **só** de páginas YC live (`data-page` founders).
- Linhas `[FAKE DELETE]` / `[DUP DELETE]`: não mensagem.

## Prompt para colar em chat novo (Week 6+ ou reescrita)

```
Você preenche Message + Message 2 na planilha YC CEOs do Notion usando scripts/prospeccao-yc-kit-prompt.md, positioning.md e pitch/offer.md.

Regras: inglês, tom humano, SEM oferta free/case study swap. Foco clientes pagos (design partner + UI em código). Personalize surface a partir do one-liner. Nunca enviar LinkedIn. Não mudar Status salvo pedido.

Entrega: atualizar Notion + opcional messages.json no workspace. Nada enviado ao LinkedIn.
```

## Prompt separado — só montar planilha (roster)

```
Monte a próxima planilha YC (100–200 CEOs) no Notion: schema igual às semanas anteriores, Status = To send invite, LinkedIn só do YC, dedupe contra master. Depois use scripts/prospeccao-yc-kit-prompt.md para drafts paid. Nunca enviar DMs.
```
