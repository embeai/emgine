# Emgine — Creative Ideation (Parallelization)
# Location: prompts/ideation.md
# Usage: Run BEFORE writing design.md — only for high-stakes projects where layout direction matters.
# NOT the default workflow. Use when: client-facing work, carousel, or when you've shipped something
# and regretted the layout direction after the fact.
#
# To run: "Read prompts/ideation.md and run ideation for active/<project-slug>/brief.md"

---

## HOW TO USE

1. Make sure `active/<project-slug>/brief.md` is filled and approved first
2. Tell Claude: `Read prompts/ideation.md and run ideation for active/<project-slug>/brief.md`
3. Claude assesses complexity and recommends agent count — **wait for your approval before spawning**
4. Claude spawns agents in parallel, collects outputs, presents all directions clearly
5. You pick the winning direction (or combine elements from two)
6. Claude writes `active/<project-slug>/ideation.md` with the winner marked
7. Proceed to write `design.md` based on the winning direction

---

## ORCHESTRATOR INSTRUCTIONS (Claude reads this when running ideation)

### Step 1 — Assess before spawning

Read `active/<project-slug>/brief.md` and output this assessment. Do not spawn anything yet.

```
PROJECT:         [slug]
OUTPUT TYPE:     [thumbnail / carousel / ad creative / etc.]
COMPLEXITY:      [Simple / Medium / High]
RECOMMENDED:     [2 agents for Simple / 3 for Medium or High]
TOKEN COST:      [Low / Medium / High]

Proceed with [N] agents? (waiting for confirmation)
```

Rules:
- Simple = single static output (thumbnail, single ad) → 2 agents max
- Medium = multi-panel or client-facing → 3 agents
- High = carousel (5+ slides), landing page → 3 agents (never more)
- Never spawn more than 3 agents without explicit user instruction

---

### Step 2 — After user confirms, spawn agents in parallel

Spawn all agents simultaneously — not one at a time.

Each agent gets:
- The full content of `active/<project-slug>/brief.md`
- Their assigned direction name and definition (see DIRECTION LENSES below)
- The exact output format (see AGENT OUTPUT FORMAT below)
- Hard constraints: no TSX, no code, no questions, structured output only

---

### Step 3 — Collect and present

After all agents return, present all directions side by side in a clean table, then list each direction in full.
Do NOT pick a winner — the user picks.

Format:

```
## Ideation Results — [Project Name]

| # | Direction | Strategic Fit | Tone | Composition Focus |
|---|-----------|--------------|------|-------------------|
| 1 | [Name]    | [1 sentence] | [axes summary] | [zone] |
| 2 | [Name]    | [1 sentence] | [axes summary] | [zone] |
| 3 | [Name]    | [1 sentence] | [axes summary] | [zone] |

---

[Full spec for each direction below]
```

Then ask: "Which direction do you want to build? You can also combine elements — tell me what to take from each."

---

### Step 4 — Save to ideation.md

After user picks, write `active/<project-slug>/ideation.md` with:
- All directions listed
- Winning direction clearly marked
- Any combination notes from the user

---

## DIRECTION LENSES

Use these when assigning a lens to each agent. Pick the most relevant ones for the output type.

| Lens Name | Definition |
|-----------|------------|
| **Authority Minimal** | One dominant element, maximum whitespace, almost no text. The metric or visual does all the work. Credibility through restraint. |
| **Data Forward** | The result/metric is the hero — large, center, impossible to miss. Everything else is supporting context. |
| **Story Arc** | Before/after or problem/solution structure. Two visual zones in tension. Viewer reads left-to-right or top-to-bottom like a sentence. |
| **Brand Signal** | Platform or tool identity is prominent. Colors, logo, recognizable UI patterns — viewer knows what this is about in under 1 second. |
| **Human Trust** | Face, team, or human element as the anchor. Warmer palette, softer edges. Credibility through people, not data. |
| **Contrarian** | Breaks the visual formula for the category. If everyone is dark, go light. If everyone leads with text, lead with image. Scroll-stopper through surprise. |
| **Editorial Flow** | Used for carousels. Each panel flows into the next — consistent rhythm, swipe momentum. Designed as a sequence, not individual slides. |
| **Conversion Direct** | Hook → proof → CTA hierarchy, no decoration. Every element earns its place by moving the viewer toward one action. |

For **thumbnails**: use Authority Minimal, Data Forward, Story Arc (pick 2–3 most relevant)
For **carousels**: use Editorial Flow + 2 others
For **ad creatives**: use Conversion Direct + 2 others
For **client-facing work**: always include one Contrarian direction

---

## AGENT OUTPUT FORMAT

Each agent must return exactly this structure. No deviations.

```
DIRECTION NAME: [Name from lens list]
WHY THIS WORKS: [1 sentence — strategic fit for this specific project and audience]
TONE:
  Minimal↔Rich:      [1-10]
  Dark↔Light:        [1-10]
  Technical↔Human:   [1-10]
  Loud↔Quiet:        [1-10]
COMPOSITION:    [Describe zones — e.g. "Top 40%: headline metric. Middle: platform logo. Bottom: outcome label"]
TYPOGRAPHY:     [Display treatment for headline, body treatment for supporting text]
COLOR STRATEGY: [Which color is hero, which is supporting, any accent usage]
ASSET PRIORITY: [Which asset or element gets the most visual weight, what recedes]
CTA:            [Action verb + specific outcome written from the reader's perspective — not the brand's]
DIFFERENT FROM OTHERS: [1 sentence — what makes this direction distinct vs the other directions]
```

Hard constraints for every agent:
- No TSX, no code blocks, no markdown headers inside the output
- No questions, no options, no "you could also..."
- Fill every field — no blanks, no "N/A"
- CTA must be specific to this project — never "Learn More" or "Get Started"

---

## TOKEN GUARDRAILS

- Each agent reads only `brief.md` — no other files
- Each agent returns one structured spec — no conversation, no drafts
- Synthesizer (Claude) presents outputs, does not generate additional content
- Total ideation cost: ~3-4x one agent call — acceptable for client-facing or high-stakes work
- For simple personal projects: skip ideation, use traditional workflow

---

## VARIABLES REFERENCE

| Variable | What it maps to |
|----------|----------------|
| `<project-slug>` | The folder name under `active/` |
| Brief fields | All fed directly to each agent as-is |
| Direction lens | Assigned per agent based on output type rules above |
