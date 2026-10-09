# PROJECT: THE FOREST VILLAGE — INTERACTIVE 3D DEVELOPER PORTFOLIO

## YOUR ROLE

Act as a senior creative developer, 3D game engineer, technical artist, UX designer, and Next.js architect.

Build a polished, production-quality, browser-based interactive 3D isometric portfolio using Next.js, TypeScript, React Three Fiber, Three.js, and Rapier Physics.

The experience should feel like a small, beautifully crafted, explorable fantasy adventure.

It must be an actual functioning application, not a static scene, landing page mockup, or collection of disconnected demos.

Visitors should be able to control a character, move freely throughout a forest village, jump over small obstacles, walk into or interact with buildings, discover portfolio content, and explore the developer's professional story.

The design should balance:
- Beautiful world design
- Smooth gameplay
- Strong interaction design
- Portfolio usability
- Excellent performance
- Clean architecture
- Accessibility
- Maintainability

Do not optimize exclusively for visual appearance. Movement, navigation, content readability, and production quality are equally important.

---

# 1. CORE CREATIVE CONCEPT

## World Name

"The Forest Village"

## Narrative

The visitor arrives in a magical forest village built by a software developer.

Each location represents a part of the developer's professional identity.

The village is a metaphor for creativity, engineering, craftsmanship, curiosity, and continuous learning.

A blacksmith's forge represents building software projects.

A cozy forest house represents the developer's personal identity.

Other carefully designed structures represent technical skills, professional experience, writing, and ways to get in touch.

The world should appear handcrafted, warm, vibrant, organic, and full of subtle environmental life.

## Art Direction

Use a stylized low-poly fantasy aesthetic.

Visual references:
- Cozy fantasy exploration games
- Handcrafted miniature dioramas
- Stylized forest environments
- Small medieval villages
- Soft illustrated fantasy worlds
- Welcoming indie adventure games

Do not copy any existing game's protected assets or specific visual identity.

Use original procedural geometry and appropriately licensed models.

The world must look like a cohesive artistic environment rather than random primitive objects.

## Color Palette

Forest green: #526B4E

Deep green: #273F36

Soft grass: #86A76A

Warm cream: #F4E8C8

Wood brown: #8A5A3B

Stone gray: #8C9186

Golden sunlight: #FFD28A

Forge orange: #FF873D

Water blue: #77B8C8

Create variation within the palette. Avoid using uniform colors for every tree, rock, building, or terrain surface.

## Important Art Rules

- Avoid perfect grids.
- Avoid perfectly rectangular villages.
- Avoid repeated buildings that look identical.
- Avoid flat, featureless ground.
- Avoid sharp modern architecture.
- Prefer curved roads, uneven terrain, and irregular silhouettes.
- Add organic clusters of plants, flowers, stones, mushrooms, and shrubs.
- Maintain strong visual readability at an isometric camera angle.
- Use warm ambient lighting and subtle shadows.
- Use small environmental animations to make the world feel alive.
- Preserve consistent scale across characters, doors, furniture, props, and buildings.

---

# 2. REQUIRED TECHNOLOGY

Use:

Framework:
- Next.js App Router
- React
- TypeScript in strict mode

3D:
- Three.js
- @react-three/fiber
- @react-three/drei
- @react-three/rapier

State:
- Zustand

UI:
- Tailwind CSS
- shadcn/ui
- Radix primitives
- Motion for DOM transitions
- Lucide icons

Assets:
- Blender-compatible glTF/GLB assets
- GLTFLoader via useGLTF
- Optimized textures
- Draco or Meshopt compression where appropriate

Audio:
- Howler.js, loaded only on the client

Testing:
- Vitest for pure logic
- Playwright for browser testing

Optional:
- Leva for development-only 3D tuning
- postprocessing only where it provides measurable visual improvement

Use current compatible stable versions. Do not automatically introduce unnecessary libraries.

Use React Three Fiber as the rendering integration layer. Access native Three.js APIs where necessary.

The final architecture must work properly with Next.js client components and server components.

---

# 3. 3D CAMERA SYSTEM

Implement a genuine isometric or isometric-style camera.

Requirements:

- Use an OrthographicCamera by default.
- Start with a diagonal view approximating a 45-degree horizontal angle.
- Start with a camera elevation of approximately 35 degrees.
- Allow fine-tuning of camera elevation and zoom.
- Camera follows the character smoothly.
- Camera movement uses delta-time-aware damping.
- The character remains comfortably visible on screen.
- Camera must not shake while character physics updates.
- Camera must maintain a predictable scale.
- Avoid abrupt camera snapping.

The camera should frame the world like a beautiful miniature diorama.

Add:
- Smooth camera tracking
- Camera follow offset
- Zoom limits
- Optional user-controlled zoom
- Camera bounds to prevent excessive empty-space viewing
- Camera obstruction handling, using transparency or camera-aware fading for large objects if necessary

Movement must remain intuitive relative to the camera orientation.

Do not implement conflicting camera control systems.

---

# 4. PLAYABLE CHARACTER

Build a stylized adventurer character that represents the developer.

Character design:
- Small low-poly proportions
- Friendly fantasy-adventurer silhouette
- Simple clothing
- Backpack or small utility bag
- Neutral, welcoming visual style
- Clearly visible at isometric distance

Start with a procedural character if custom models are unavailable.

Provide an asset abstraction so that a GLB character can later replace the procedural character without rewriting movement logic.

## Required Character States

- Idle
- Walk
- Run
- Jump
- Fall
- Land
- Interact

Use a finite-state animation approach with transitions and blending.

If animated GLB assets are available, integrate useAnimations.

If no animated assets exist, create reasonable procedural animation for idle, walking, and jumping.

Do not pretend an imported model has animations when the animation clips are absent.

---

# 5. CHARACTER MOVEMENT AND PHYSICS

The character must actually move through the 3D environment.

Desktop controls:

W / Arrow Up: Move forward

S / Arrow Down: Move backward

A / Arrow Left: Move left

D / Arrow Right: Move right

Shift: Run

Space: Jump

E: Interact

Escape: Close interaction modal

M: Toggle map

Movement behavior:

- Camera-relative directions
- Smooth acceleration
- Smooth deceleration
- Normalized diagonal movement
- Character rotates toward movement direction
- Smooth animation transitions
- Consistent movement regardless of frame rate
- Clear distinction between walk, run, idle, and jump

## Physics

Use Rapier.

Implement a reliable character-controller approach compatible with the selected version of @react-three/rapier.

Choose either:
1. A kinematic controller with explicit gravity, jump velocity, and collision resolution.
2. A dynamic rigid-body controller with appropriate damping, grounded detection, and controlled horizontal velocity.

Explain the chosen model and implement it consistently.

Do not combine incompatible control strategies.

Required physics:
- Gravity
- Ground collision
- Tree collision
- Rock collision
- Building collision
- Wall collision
- Jumping
- Slope handling
- Stair or step traversal where appropriate
- Grounded detection
- Landing behavior
- No movement through obstacles

Jump:
- Space triggers a jump only when allowed.
- Apply configurable jump velocity.
- Include a small jump input buffer for responsiveness.
- Optional coyote time of approximately 100 ms.
- Prevent uncontrolled double jumping.
- Allow easy tuning of jump height.
- Avoid getting stuck at seams between colliders.

Create typed movement configuration constants:
- walkSpeed
- runSpeed
- acceleration
- deceleration
- jumpVelocity
- gravityScale
- rotationSpeed
- groundCheckDistance
- coyoteTime
- jumpBufferTime

Use frame-rate-independent calculations and a fixed physics timestep where supported.

The character must be able to navigate across the village without falling through the terrain or getting stuck on decorative props.

---

# 6. WORLD DESIGN — AN ORGANIC FOREST VILLAGE

Construct one seamless explorable outdoor environment.

Target an initial world size around 100 x 100 units, subject to performance and gameplay testing.

Do not make the entire world visually dense. Use varied areas of open space, natural boundaries, landmarks, and scenery.

The environment must include:

- Forest paths
- Grass fields
- Rolling hills
- Trees
- Rocks
- Flowers
- Mushrooms
- Bushes
- Tree stumps
- Wooden fences
- Lanterns
- Wooden bridges
- Small streams
- Pond
- Gentle waterfalls where practical
- Decorative logs
- Signposts
- Benches
- Fireflies
- Village buildings
- Small gardens

## Terrain

Create an organic terrain system using suitable procedural geometry or modeled meshes.

Requirements:
- Gentle elevation changes
- Playable slopes
- No accidental invisible walls
- Natural transitions between grass, dirt, stone, and paths
- Walkable terrain mesh
- Accurate simplified physics colliders
- Distinct clearings for important buildings

Use seeded generation for repeatable decorative placement.

Do not randomly regenerate the village on every render or page reload.

Build a deterministic authored layout for important landmarks, with procedural decoration around that layout.

## Path Generation

The paths must look naturally worn into the terrain.

Use:
- Curved paths
- Widened village crossroads
- Small dirt patches
- Irregular borders
- Occasional stepping stones
- Grass intrusion
- Gentle elevation changes

Major destinations must be physically connected by walkable paths.

Avoid path intersections that create impassable slopes or intersect buildings.

## Trees

Implement several original low-poly tree variations.

Examples:
- Tall pine
- Rounded oak
- Birch
- Small saplings
- Stylized broadleaf trees

Randomize:
- Height
- Crown scale
- Trunk width
- Color variation
- Rotation

Use instancing for large repeated decorative sets.

Keep collider geometry simple.

Only assign physical colliders where collision is needed.

## Atmosphere

Use:
- Warm directional sunlight
- Ambient lighting
- Soft fog
- Contact shadows or economical real-time shadows
- Subtle wind sway
- Slow cloud movement
- Floating pollen particles
- Fireflies near the pond at night
- Animated water

Avoid overly expensive real-time effects.

---

# 7. VILLAGE MASTER PLAN

Create the following major areas:

A. Arrival Clearing — Introduction

B. The Blacksmith's Forge — Projects

C. My Forest House — About Me

D. Knowledge Library — Skills

E. Guild Hall — Experience

F. Communication Tower — Contact

G. Forest Trails — Discovery and decorative exploration

The arrival clearing is the central navigational anchor.

All other areas must be reachable naturally from it.

The architecture must provide recognizable silhouettes so visitors can visually identify destinations.

Add signposts at major intersections.

Use world-space labels when the player approaches buildings.

---

# 8. ARRIVAL CLEARING — PORTFOLIO ENTRANCE

This is the spawn point.

Create a beautiful opening scene.

Required elements:
- Small open grassy clearing
- Large landmark tree
- Wooden welcome sign
- Cobblestone or dirt pathway
- Nearby flowers
- Animated birds or butterflies
- A visible route toward the forge
- Warm sunlight
- The player's character

Display a tasteful introduction overlay:

"Welcome to My World"

"I build software, solve problems, and turn ideas into experiences."

Primary actions:
- Start Exploring
- View Projects
- Learn About Me

When Start Exploring is clicked:
- Transition out the welcome overlay.
- Enable player movement.
- Show gameplay HUD.
- Introduce controls briefly.

Do not force a long animation before the visitor can explore.

Use a short guided introduction that can be skipped.

Provide a direct-access portfolio menu for visitors who do not want to navigate through the 3D world.

---

# 9. BLACKSMITH FORGE — PROJECTS

THIS IS THE MOST IMPORTANT PORTFOLIO LOCATION.

Build a large, distinctive blacksmith forge in the village.

This building represents software craftsmanship.

## Exterior

Include:
- Timber-frame structure
- Stone foundation
- Large chimney
- Animated chimney smoke
- Glowing furnace
- Anvil outside the workshop
- Hammer
- Wood stacks
- Metal tools
- Forge sign
- Warm flickering light
- Sparks near the furnace
- Workbench
- Open workshop entrance

Forge sign:

"The Code Forge"

Subtitle:

"Where ideas become products."

## Player Interaction

When the character approaches the forge:
- Highlight the entrance subtly.
- Show an interaction prompt: "Press E to Explore Projects".
- Show the same interaction through touch-friendly UI.
- Optionally show a small decorative particle effect around the forge sign.

When the visitor interacts:
- Transition the camera closer to the forge, or open an accessible DOM-based project gallery.
- Pause character movement while an interaction panel is open.
- Show the developer's real projects from structured portfolio data.

## Project Presentation

Projects should look like objects crafted by the blacksmith.

Each project should have:
- Project title
- Screenshot
- Short description
- Technology stack
- Role
- Main features
- Technical challenges
- Solutions
- Optional architecture summary
- GitHub link
- Live demo link
- Case study link
- Project category
- Featured flag

## Project Card Design

Use fantasy-inspired cards with modern readability.

A project card should feel like a forged artifact or illustrated workshop blueprint.

Card layout:
- Visual thumbnail
- Project name
- Category
- Technology badges
- Short summary
- View Details button
- Live Demo button
- GitHub button

The design must remain legible and usable.

Do not distort text with 3D transforms.

Prefer accessible HTML overlays for reading detailed content.

## Additional Forge Interactions

Create several decorative project pedestals or floating artifacts inside and near the forge.

Each artifact corresponds to a featured project.

When approaching an artifact:
- Show its project name.
- Highlight its model.
- Allow interaction.
- Open the corresponding project detail panel.

Add forge atmosphere:
- Hammering animation
- Furnace glow
- Slow sparks
- Warm lights
- Anvil particles

Keep particle counts low.

## Project Filtering

Support:
- All Projects
- Frontend
- Backend
- Full Stack
- AI / ML
- Experiments

Categories should only appear if matching projects exist.

Projects must be populated from typed data rather than hardcoded inside 3D meshes.

If real project data is unavailable, use clearly marked demo placeholders and provide an easy way to replace them.

Do not invent achievements or pretend demo projects are real.

---

# 10. MY FOREST HOUSE — ABOUT ME

Create a beautiful personal house in a peaceful forest clearing.

The house represents the developer's personality and story.

## Exterior

Include:
- Cozy wooden cottage
- Natural stone foundation
- Curved or asymmetrical roof silhouette
- Wooden front door
- Warm illuminated windows
- Flower garden
- Small mailbox
- Vegetable patch
- Wooden fence
- Porch
- Bench
- Lantern
- Smoke rising from chimney
- Personal nameplate

Surround the house with:
- Oak trees
- Mushrooms
- Wildflowers
- Mossy stones
- Small shrubs

The house must feel lived in, not like a generic repeated building.

## Interior

Create an explorable interior if practical within the initial build.

For the first implementation, use either:
- A separate optimized interior scene, or
- A camera transition with the roof fading away.

Choose the simpler stable method first.

Inside the house:
- Developer workstation
- Desk
- Monitor
- Bookshelf
- Maps
- Notes
- Potted plants
- Bed
- Personal items
- Fireplace
- Photographs or framed art placeholders

## About Me Interaction

When interacting with the desk:
Open the About Me panel.

Display:
- Developer name
- Job title
- Bio
- Professional interests
- Development philosophy
- Current focus
- Career goals
- Resume download

When interacting with the bookshelf:
Show learning interests and technologies being explored.

When interacting with the wall map:
Open the world navigation map.

When interacting with the mailbox:
Open contact options.

Personal data must be stored in a single maintainable configuration file.

---

# 11. KNOWLEDGE LIBRARY — SKILLS

Create a small magical library in the forest village.

Exterior:
- Tall wooden building
- Arched entrance
- Books symbol
- Hanging lanterns
- Moss-covered stonework
- Small reading garden

Interior:
- Bookshelves
- Scrolls
- Magical floating books
- Study desk
- Soft lights

Interaction:
"Press E to Explore Skills"

Show skills organized by category:

Frontend:
- React
- Next.js
- TypeScript
- JavaScript
- HTML
- CSS
- Tailwind CSS

Backend:
- Node.js
- APIs
- Databases
- Authentication

3D / Creative Development:
- Three.js
- React Three Fiber
- WebGL

Tools:
- Git
- Docker
- Testing
- CI/CD

All skill entries must be editable.

Do not represent example skills as confirmed personal expertise unless supplied in the portfolio data.

Use skill cards with real descriptions rather than arbitrary numerical proficiency percentages.

---

# 12. GUILD HALL — EXPERIENCE

Build a fantasy guild hall representing professional history.

Design:
- Timber building
- Banners
- Notice board
- Large central table
- Wooden plaques
- Lanterns
- Historical artifacts

When interacting:
Display a career timeline.

Each entry includes:
- Position
- Company
- Dates
- Responsibilities
- Major contributions
- Technologies
- Outcome or impact where known

Use a clean timeline UI.

Do not fabricate employment history or numerical accomplishments.

If no experience data is provided, use an empty-state design that can support freelance work, internships, open-source work, or personal experience.

---

# 13. COMMUNICATION TOWER — CONTACT

Create a small wooden observation or communication tower.

Design:
- Elevated timber structure
- Lanterns
- Flags
- Notice board
- Wooden stairs
- Village view

Interaction:
"Send a Message"

Open a modern contact panel.

Display:
- Email
- GitHub
- LinkedIn
- Other configured social links
- Resume link
- Contact form if a secure backend is configured

The contact form must include:
- Validation
- Error handling
- Success feedback
- Spam mitigation
- Server-side validation
- Safe rate limiting where feasible

Never pretend a message was sent if no backend is configured.

Use an email link as the reliable default if no sending service is available.

---

# 14. FOREST EXPLORATION AND DISCOVERY

The forest must feel like more than decorative background.

Add:
- Hidden clearings
- A peaceful pond
- Bridge crossing
- Decorative campsite
- Flower field
- Scenic overlook
- Small waterfall
- Fireflies
- Benches
- Signs containing short developer-related messages

Optional Easter eggs:
- Secret developer quotes
- Hidden programming references
- Collectible glowing crystals
- Small celebratory animation after exploring all main portfolio landmarks

Exploration rewards must remain optional.

Never hide essential portfolio information behind collectibles or puzzles.

---

# 15. INTERACTION SYSTEM

Create one reusable interaction architecture.

Each interactive object must support:
- Unique interaction ID
- World position
- Interaction radius
- Display label
- Action type
- Availability conditions
- Visual highlight
- Keyboard interaction
- Touch interaction

Examples:

Forge:
Interaction ID: forge.projects
Action: Open projects panel

House:
Interaction ID: house.about
Action: Open about panel

Library:
Interaction ID: library.skills
Action: Open skills panel

Guild Hall:
Interaction ID: guild.experience
Action: Open experience timeline

Tower:
Interaction ID: tower.contact
Action: Open contact panel

Use player proximity detection to find relevant interactions.

Select the nearest valid interaction target where multiple objects overlap.

Pressing E should activate one clearly selected target.

Avoid updating global React state on every frame unnecessarily.

Use a lightweight proximity system.

Show an interaction label above or near the relevant object.

When an interaction panel opens:
- Pause movement input.
- Release active movement keys.
- Preserve the player's location.
- Allow Escape or a close button to return to exploration.
- Restore keyboard focus appropriately.

---

# 16. MODERN UI / UX

The experience is primarily 3D, but the portfolio interface must be professional and highly readable.

Use DOM-based UI for important content.

Do not render long-form paragraphs as textures inside the 3D scene.

## HUD

Desktop HUD should include:

Top left:
- Developer logo or name

Top right:
- Sound toggle
- Settings
- Map
- Portfolio menu

Bottom left:
- Controls hint

Bottom center:
- Contextual interaction prompt

Optional:
- Small compass
- Destination marker

## Overlay Design

Use:
- Warm translucent panels
- Cream backgrounds
- Subtle wood-inspired borders
- Soft shadows
- Rounded corners
- Clear typography
- Smooth transitions

Keep the UI modern.

Avoid exaggerated medieval fonts that reduce readability.

## Fast Navigation

Always provide direct menu links to:
- About
- Projects
- Skills
- Experience
- Contact

Selecting a location from the navigation menu should either:
- Open its portfolio content immediately, or
- Move the camera/player safely to that location.

Visitors must not be forced to walk long distances to find essential content.

## Accessibility

Provide:
- Keyboard accessibility
- Correct focus management
- Accessible modal dialogs
- Screen-reader-friendly HTML
- Reduced-motion support
- Visible focus indicators
- Sufficient color contrast
- Keyboard control instructions
- A non-3D portfolio mode

Use accessible UI components where possible.

---

# 17. MOBILE SUPPORT

The world must be responsive.

Desktop:
- WASD movement
- Space jump
- Shift run
- E interact

Mobile:
- Virtual joystick
- Jump button
- Interaction button
- Menu button
- Responsive overlays

Requirements:
- Touch controls must not scroll the page during active gameplay.
- Virtual controls should be comfortably sized.
- Avoid controls overlapping important UI.
- Mobile scene should use simpler effects and geometry where necessary.
- Dynamic resolution scaling should adapt to device capability.

Provide a standard 2D portfolio fallback for unsupported devices or poor WebGL performance.

---

# 18. ANIMATION SYSTEM

Add animations that make the village feel alive.

Character:
- Idle breathing
- Walk
- Run
- Jump
- Landing
- Turning

Environment:
- Tree sway
- Leaf movement
- Water movement
- Chimney smoke
- Forge fire
- Forge sparks
- Floating pollen
- Butterflies
- Fireflies
- Lantern flicker

Animations should be subtle.

Use instanced or shader-based animation when beneficial.

Do not attach expensive React state updates to every particle.

Honor prefers-reduced-motion.

---

# 19. AUDIO DESIGN

Use a lightweight sound system.

Ambient forest:
- Birds
- Wind
- Flowing water

Forge:
- Hammer hits
- Fire crackling

House:
- Fireplace sound

Interactions:
- Soft hover feedback
- Menu open sound
- Successful interaction cue

Character:
- Footsteps on different surfaces
- Jump and landing effects

Audio requirements:
- Default muted or require a clear user gesture before playback.
- Include volume controls.
- Allow complete mute.
- Load audio lazily.
- Do not autoplay sounds in violation of browser policies.

Avoid distracting repeated sounds.

---

# 20. PERFORMANCE ENGINEERING

Target smooth gameplay on modern desktop and acceptable performance on capable mobile devices.

Performance targets are goals, not claims:
- Approximately 60 FPS on representative modern desktops
- Approximately 30 FPS or better on supported mid-range mobile hardware
- Responsive interactions
- Reasonable download size
- No major frame stalls during exploration

Implement:
- Geometry reuse
- Material reuse
- InstancedMesh for repeated objects
- Culling
- Texture compression
- Optimized GLB models
- Simplified physics colliders
- Model lazy loading
- Conservative shadow maps
- Device-aware pixel ratio
- Reduced particle counts on mobile
- Minimal per-frame allocations
- Object pooling where beneficial

Use performant asset-loading patterns.

Avoid:
- Hundreds of separate draw calls for identical trees
- Excessive transparent surfaces
- Massive uncompressed textures
- Extremely detailed colliders
- Unnecessary shadow-casting lights
- Frequent React component rerenders caused by frame updates
- Heavy postprocessing on low-end devices

Implement performance presets:
- Low
- Medium
- High

Provide an automatic initial preset based on lightweight capability checks, while allowing manual override.

Profile the actual scene before making performance claims.

---

# 21. NEXT.JS ARCHITECTURE

Use Next.js App Router correctly.

The 3D canvas and browser-dependent physics logic must live inside client components.

Avoid accessing window, document, or WebGL APIs during server rendering.

Load the 3D experience dynamically when appropriate.

Keep public portfolio metadata and regular page content server-renderable.

Provide:
- SEO metadata
- Open Graph information
- Semantic HTML
- Sitemap
- robots.txt
- Accessible fallback pages
- Error boundaries
- Loading states

The portfolio must still expose useful crawlable HTML content even if the 3D scene cannot load.

Avoid treating the entire application as one giant client component.

---

# 22. RECOMMENDED FILE STRUCTURE

Use a feature-oriented architecture similar to:

src/
  app/
    layout.tsx
    page.tsx
    globals.css
    loading.tsx
    not-found.tsx
    portfolio/
      page.tsx

  components/
    experience/
      ExperienceCanvas.tsx
      WorldScene.tsx
      ExperienceLoader.tsx

    character/
      Player.tsx
      CharacterModel.tsx
      CharacterAnimations.tsx
      CharacterController.tsx
      PlayerCamera.tsx

    world/
      World.tsx
      Terrain.tsx
      Forest.tsx
      Paths.tsx
      Lighting.tsx
      EnvironmentEffects.tsx
      VillageLayout.tsx

    buildings/
      Forge.tsx
      ForestHouse.tsx
      Library.tsx
      GuildHall.tsx
      CommunicationTower.tsx

    interactions/
      InteractionSystem.tsx
      InteractiveObject.tsx
      InteractionPrompt.tsx

    portfolio/
      ProjectsPanel.tsx
      ProjectCard.tsx
      ProjectDetail.tsx
      AboutPanel.tsx
      SkillsPanel.tsx
      ExperiencePanel.tsx
      ContactPanel.tsx

    ui/
      HUD.tsx
      WorldMap.tsx
      MainMenu.tsx
      MobileControls.tsx
      SettingsPanel.tsx
      LoadingScreen.tsx

  hooks/
    useKeyboardControls.ts
    usePlayerMovement.ts
    useInteraction.ts
    useDeviceQuality.ts

  stores/
    useGameStore.ts
    useUIStore.ts
    useSettingsStore.ts

  data/
    profile.ts
    projects.ts
    skills.ts
    experience.ts
    village.ts

  lib/
    physics/
    geometry/
    procedural/
    performance/
    utilities/

  types/
    portfolio.ts
    world.ts
    interactions.ts

public/
  models/
  textures/
  sounds/
  images/

Organize files as needed, but preserve separation of responsibilities.

---

# 23. PORTFOLIO DATA MODEL

All portfolio information must be configurable.

Define a typed Project interface with fields similar to:

id: string
slug: string
title: string
description: string
longDescription?: string
category: ProjectCategory
technologies: string[]
thumbnail: string
screenshots?: string[]
liveUrl?: string
githubUrl?: string
caseStudyUrl?: string
featured: boolean
challenges?: string[]
solutions?: string[]
role?: string

Also create typed data interfaces for:
- Profile
- Skill
- Experience
- SocialLink
- VillageLocation

Keep portfolio content independent from 3D building implementations.

Do not use duplicated project arrays across different components.

Use one source of truth.

---

# 24. WORLD NAVIGATION MAP

Create a stylized illustrated village map.

The map should display:
- Player location
- Arrival clearing
- Forge
- House
- Library
- Guild Hall
- Communication Tower
- Major trails

Press M to open it.

Allow users to select a destination.

For the initial version, selecting a destination should show a directional marker or allow direct portfolio-section access.

Optional fast travel can be introduced later.

The map should visually match the forest-village aesthetic.

---

# 25. GAME STATE

Use Zustand to coordinate high-level state.

Examples:

gameStarted
playerPosition
playerDirection
playerMovementState
activeInteraction
activePanel
visitedLocations
settings
soundEnabled
graphicsQuality

Important:
Do not store raw mutable physics objects in globally subscribed UI state unless absolutely necessary.

Avoid writing player positions to Zustand on every rendered frame when consumers do not require such updates.

Keep frame-critical state in refs or appropriate physics objects.

Use Zustand selectors to reduce rerenders.

---

# 26. LOADING EXPERIENCE

Create an elegant loading screen.

Design:
- Forest silhouette
- Small animated character
- Warm color palette
- Short contextual message

Example:

"Preparing Your Adventure..."

Display real asset-loading progress where available.

Do not fake progress numbers.

Provide a fallback when loading takes unusually long.

Allow users to switch to the 2D portfolio.

---

# 27. DEVELOPMENT PHASES

Build in small verified phases.

## Phase 1 — Foundation

Deliver:
- Next.js setup
- TypeScript
- Tailwind
- R3F canvas
- Orthographic camera
- Lighting
- Terrain prototype
- Player character
- Basic movement
- Jumping
- Collision

Acceptance:
The character can walk, run, jump, land, and collide with obstacles reliably.

Do not proceed until these interactions actually work.

## Phase 2 — Organic World

Deliver:
- Forest environment
- Natural paths
- Trees
- Rocks
- Grass
- Pond
- Bridges
- Village layout
- Terrain colliders

Acceptance:
The player can reach every important destination.

## Phase 3 — Buildings

Deliver:
- Forge
- Forest House
- Library
- Guild Hall
- Communication Tower

Acceptance:
Buildings have coherent visual designs, recognizable silhouettes, and correct colliders.

## Phase 4 — Portfolio Interactions

Deliver:
- Interaction system
- Project gallery
- Project detail panels
- About panel
- Skills panel
- Experience timeline
- Contact panel

Acceptance:
Every building opens correct real or clearly placeholder content.

## Phase 5 — Polish

Deliver:
- Character animations
- Environmental movement
- Forge sparks
- Fireplace and chimney smoke
- UI transitions
- Sound
- Particle effects
- Improved lighting

Acceptance:
The world feels alive without compromising usability.

## Phase 6 — Optimization

Deliver:
- Instanced environment objects
- Asset compression
- Device presets
- Mobile touch controls
- Fallback portfolio
- Accessibility improvements

Acceptance:
Stable performance across representative target devices.

## Phase 7 — Production

Deliver:
- Unit tests
- E2E tests
- Error handling
- SEO
- Build validation
- Deployment readiness
- Documentation

Acceptance:
The application builds successfully and portfolio functionality remains available if WebGL cannot initialize.

---

# 28. TESTING REQUIREMENTS

Write tests for:
- Movement vector normalization
- Camera-relative movement mathematics
- Jump eligibility
- Interaction distance selection
- Nearest interactable target selection
- Portfolio filtering
- Navigation state
- Data validation

Use Playwright to test:
- Page loads
- Loading screen exits
- Portfolio menu opens
- Forge projects are accessible
- Project cards show correct data
- Contact links work
- Modal focus and close behavior
- Fallback portfolio works

Where practical, add a deterministic development/test mode that disables nonessential randomness and animations.

Do not report tests as passed without running them.

---

# 29. CODE QUALITY RULES

All code must be:
- Strictly typed
- Modular
- Reusable
- Maintainable
- Testable
- Reasonably documented

Use:
- Functional React components
- Custom hooks
- Named configuration constants
- Small focused modules
- Typed data schemas
- Clear error handling

Avoid:
- Large monolithic scene files
- Unnecessary any types
- Excessive prop drilling
- Direct DOM manipulation for application state
- Memory leaks
- Uncleaned event listeners
- Unmanaged animation loops
- Shared mutable state without ownership

Dispose of generated Three.js resources where appropriate.

Handle asset-loading failures gracefully.

---

# 30. DELIVERABLES

Generate:

1. Complete Next.js application structure
2. Working 3D world
3. Controllable player
4. Functional movement and jumping
5. Collision-enabled terrain
6. Organic forest environment
7. Blacksmith forge project gallery
8. Forest house About Me interaction
9. Skills library
10. Experience guild hall
11. Contact tower
12. Accessible portfolio panels
13. Responsive controls
14. Loading experience
15. Optimized assets or documented placeholders
16. Typed portfolio data
17. Automated tests
18. README with setup instructions
19. Asset attribution instructions
20. Deployment instructions

Provide clear commands for development, linting, testing, and building.

---

# 31. IMPLEMENTATION BEHAVIOR

Important instructions for the coding agent:

- Inspect the existing repository before making changes.
- Reuse established project conventions when reasonable.
- Confirm compatible package versions before installation.
- Do not rewrite unrelated code.
- Implement actual working components.
- Avoid pseudo-code in final implementation files.
- Do not invent nonexistent files, assets, or APIs.
- Do not depend on paid assets or external services without a fallback.
- Avoid importing entire libraries unnecessarily.
- Prefer original procedural assets when external assets are unavailable.
- Keep the application runnable after each development phase.
- Run available validation checks after changes.
- Explain any unimplemented requirement honestly.
- Do not claim the project is finished until its acceptance criteria are verified.

If the work is too large for one execution, prioritize a fully functioning vertical slice first.

The initial vertical slice must include:

- A Next.js application
- A 3D orthographic forest clearing
- A controllable character
- Working walking and jumping
- Ground and building collision
- One detailed blacksmith forge
- A working project interaction
- An accessible projects panel
- A basic forest house
- A functional About Me interaction

Only after this vertical slice works should the remaining structures and world features be expanded.

---

# 32. FINAL DESIGN OBJECTIVE

The visitor should feel as though they have entered a tiny handcrafted world.

They should naturally want to explore.

The blacksmith forge should make the developer's projects feel like things carefully crafted through engineering and creativity.

The forest house should make the developer feel like a real person rather than a collection of technical skills.

The world should be memorable, playful, visually distinctive, and professionally credible.

Prioritize the following in order:

1. Reliable movement and interaction
2. Clear presentation of portfolio content
3. Cohesive artistic design
4. Smooth performance
5. Accessibility
6. Environmental polish
7. Optional advanced features

BEGIN by inspecting the repository, establishing the project architecture, and implementing Phase 1.

Then build the first working vertical slice centered on the Forge and Forest House.

Do not stop at generating plans or placeholder files. Write functional production-oriented code.