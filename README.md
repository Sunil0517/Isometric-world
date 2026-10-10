# Hidden Leaf Village

Sunil Kumawat’s playable Hidden Leaf Village portfolio, filled from his supplied resume and built with Next.js 16, React 19, TypeScript, React Three Fiber, Drei, Rapier, Zustand, Radix Dialog, and Motion.

## Run locally

```sh
bun install
bun run dev
```

Open http://localhost:3000. The existing Next.js development server may already be using this port.

## Checks

```sh
bun run typecheck
bun run lint
bun run test
bunx playwright install chromium
bun run test:e2e
bun run build
```

Playwright uses software WebGL for reproducible browser checks. This is not a hardware performance benchmark.

## Explore

Click **Explore the village**, then use WASD or arrow keys to walk, Shift to run, Space to jump, and E near an entrance to interact. M opens the village map. Escape closes a panel. Mobile visitors get a drag joystick and jump/interaction buttons. Direct navigation and building labels open every portfolio section without walking. `/portfolio` exposes the same content as server-rendered HTML without WebGL.

Sound is muted until enabled. Panel focus returns to the control that opened it. Settings include graphics quality, volume, camera zoom, and reduced decorative motion. Graphics quality defaults to low on narrow screens and devices reporting four or fewer logical processors. This heuristic does not measure actual device performance.

## Content

- `lib/portfolio.ts`: resume-sourced profile, contact details, two work contributions, two career entries, skills, education, and certifications.
- `lib/village/data.ts`: Hidden Leaf landmarks and movement constants; re-exports shared portfolio data.
- `components/village/Panels.tsx`: interactive portfolio presentation.
- `components/village/ResumeDetails.tsx`: shared education, certifications, and resume download.
- `components/village/HiddenLeaf.tsx`: original procedural Hidden Leaf village gate.
- `components/village/VillageMap.tsx`: coordinate-based terrain map, numbered portfolio destinations, current position, visited landmarks, and optional crystal markers. The directory offers the same navigation as the pins; mobile layouts stack the map and directory.
- `public/Sunil_Kumawat_Resume.docx`: the supplied original resume, available as a download.

Professional content comes from the supplied resume. The projects are documented employer work contributions; no public project links were supplied. Career dates, including “Present,” are preserved as written. Contact links use the document’s email, phone, and embedded GitHub/LinkedIn targets. No proficiency scores or unreported achievements are invented.

## Architecture

The server page composes a client experience shell. The R3F canvas is dynamically imported with SSR disabled. High-level UI lives in Zustand; keys, velocity, controller, and animation timing stay outside subscribed state. Player position is published at most ten times per second for the map and prompts.

The character is a Rapier position-based kinematic capsule. Rapier's character controller solves collision motion at a fixed 60 Hz, with explicit gravity, slope limits, autostep, ground snapping, buffered jumping, and coyote time. Animation is procedural: idle, walk, run, jump/fall, landing, and interaction states are implemented without claiming imported animation clips. `CharacterModel` can be replaced independently of the controller.

Important landmarks have authored positions. Decoration is seeded, and repeated trees, flowers, grass, rocks, and path stones are instanced. Simplified colliders cover terrain, tree trunks, buildings, forge, bridge rails, a bench, and world boundaries. Decorative plants and small stones are deliberately nonblocking. The stream is shallow decorative water above the walkable ground; it is not a swimming simulation.

## Assets and attribution

All village geometry is original procedural geometry. The ambient WAV is an original generated breeze/bird sketch. No external 3D models, paid assets, or reference-image reproductions are required. Local Lora, DM Sans, Fredoka, and Nunito Sans fonts are supplied by Fontsource with their respective package licenses. Lucide provides icons under its package license. Older character artwork remains in `public/media` but is not used by the village.

To replace the character with a GLB, place an optimized, licensed asset in `public/models`, adapt `CharacterModel`, and load it with Drei `useGLTF`. Use animation clips only when the file actually contains them. Record model authors, source URLs, licenses, and modifications here. No GLB or compression pipeline is presently needed for the procedural scene.

## Current scope and remaining work

This is an outdoor playable implementation, not the completion of every item in the expansive original brief. Building entrances open accessible DOM panels; walkable interiors, roof fades, animated GLB assets, project screenshots/live links, swimming, terrain hills with matching colliders, camera obstruction fading, butterflies, and surface-specific footsteps remain future work. The audio is one optional ambient loop, rather than spatial forge and house soundscapes. Shader water and waterfalls are represented by simple stylized geometry. Tailwind/shadcn scaffolding is not included; styles are custom CSS with accessible Radix primitives. Performance presets control resolution and shadows, but real desktop/mobile hardware profiling has not been performed. The world is approximately 52 units across, rather than the eventual 100-unit target.

## Hosting preparation

Set `NEXT_PUBLIC_SITE_URL` to the canonical origin before building to generate a sitemap and robots sitemap reference. Run all checks and build, then have an authorized human use the host's normal Next.js publishing workflow. Agent sessions must never run production deployment commands, `deploy.sh`, push to main, or create/push deploy tags.

## Vercel deployment

This repository includes a GitHub Actions workflow at `.github/workflows/vercel-deploy.yml` that deploys to Vercel production on every push to `main` (and can also be run manually with **Run workflow**).

Configure these repository secrets before using it:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Dependency audit note

The npm audit check on 9 October 2026 reported a `braces <=3.0.3` stack-exhaustion advisory through the existing Next.js ESLint configuration (`eslint-config-next → fast-glob → micromatch → braces`). This is a development tooling chain; the registry currently exposes no newer braces release. npm's proposed automatic fix downgrades the Next.js lint configuration to 14.x, so it has not been applied to this Next.js 16 project. Recheck this chain when a compatible patch is released.

### Village adventures

Explore the village, then use **Adventure journal** or walk to an activity sign
and press **E** (the touch Explore button also works). Portfolio navigation stays
available independently of game rewards.

- **Forge:** five strikes; Space/click/tap when the moving marker crosses the centre.
- **Crystal hunt:** eight sensor collectibles; dashed map regions hint at their locations.
- **Jungle trial (parkour):** a separate river-lagoon arena far east of the island
  (`ARENA_MIN_X` in `lib/village/minigames/course.ts`); the player is teleported in on
  **Begin** and back to the sign on **Exit**. Nine flag islands, five hearts, and
  49 gems to collect:
  - Rolling logs and swinging spiked balls hurt (knock-back, 1.6s of invulnerability);
    falling into the water costs a heart and returns you to the last flag.
  - Bramble grunts patrol the plank bridges: land on one from above to stomp it,
    touch one from the side and it hurts.
  - Mushroom springs bounce, green chevron pads boost (jump from the pad to clear the
    long gap), and moving rafts carry you across the river.
  - Two floating hearts restore one heart each (only collected when you are hurt).
  - Finishing earns 1 star; 60%+ gems earns 2; 90%+ gems with 3+ hearts earns 3.
    Best time, gems, and stars are saved. Timing excludes pauses.

  Course layout, hazards, gems, and their motion are pure data and maths in
  `lib/village/minigames/course.ts` (unit-tested in `tests/course.test.ts`); rendering
  and the fixed-step hazard simulation are in
  `components/village/minigames/JungleCourse.tsx`. Hazards run on a 60 Hz course clock
  shared with the physics step, so they behave identically at any refresh rate and
  freeze while paused. The arena mounts only while the trial is active, and the
  village's shadow-casting sun follows the player into it.
- **Library:** select the four runes in the order described by the clue.
- **Archery:** a thirty-second round; pointer/touch aim and shoot, or arrows + Space.
- **Garden:** choose a seed, plant, and water; flowers bloom in four seconds.

Achievements, crystals, garden plants, and personal bests save to this browser
under `forest-village-adventure-v1`. The adventure store hydrates on client mount;
live game state and Three.js/Rapier objects are never saved. Activity definitions
and coordinates live in `lib/village/minigames/config.ts`.

In **Settings → Graphics quality**, select **Ultra · realistic materials & water**
for procedural surface grain, physical reflective ripple water, generated environment
lighting, and 4096px shadows. Balanced/low modes keep the original lighter rendering.
The sound button enables an original local village chill loop: soft harmonic pads,
breeze, stream-like noise, and distant birds. Settings include a mute toggle and
volume slider; ambience pauses when the tab is hidden. Game sounds follow the same
mute and volume controls. No remote audio or environment downloads are required.
