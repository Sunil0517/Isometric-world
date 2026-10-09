import { portfolio, projects, experiences } from "@/lib/portfolio";
export { portfolio, projects, experiences };
export type Section =
  "about" | "projects" | "skills" | "experience" | "contact";
export interface VillageLocation {
  id: Section;
  name: string;
  subtitle: string;
  position: [number, number, number];
  color: string;
  radius: number;
}
export const locations: VillageLocation[] = [
  {
    id: "about",
    name: "Forest House",
    subtitle: "Meet the maker",
    position: [-9, 0, -8],
    color: "#dd9851",
    radius: 5,
  },
  {
    id: "projects",
    name: "The Forge",
    subtitle: "Things I’ve crafted",
    position: [6, 0, -7],
    color: "#c8663d",
    radius: 5,
  },
  {
    id: "skills",
    name: "The Library",
    subtitle: "Tools of the trade",
    position: [-11, 0, 5],
    color: "#527f82",
    radius: 5,
  },
  {
    id: "experience",
    name: "Guild Hall",
    subtitle: "The journey so far",
    position: [7, 0, 7],
    color: "#667649",
    radius: 5,
  },
  {
    id: "contact",
    name: "Lookout Tower",
    subtitle: "Start a conversation",
    position: [16, 0, -1],
    color: "#547d78",
    radius: 5,
  },
];
export const skillGroups = [
  {
    title: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML & CSS",
      "Tailwind CSS",
    ],
    description: "Interfaces, responsive layouts, and the browser.",
  },
  {
    title: "Backend",
    items: ["Node.js", "APIs", "Databases", "Authentication"],
    description: "Services and the systems behind an interface.",
  },
  {
    title: "Creative development",
    items: ["Three.js", "React Three Fiber", "WebGL"],
    description: "Interactive worlds and visual experiences.",
  },
  {
    title: "Tools",
    items: ["Git", "Docker", "Testing", "CI/CD"],
    description: "A dependable workflow from idea to release.",
  },
];
export const movement = {
  walkSpeed: 4,
  runSpeed: 7,
  acceleration: 15,
  deceleration: 22,
  jumpVelocity: 7,
  gravityScale: 1,
  rotationSpeed: 12,
  groundCheckDistance: 0.15,
  coyoteTime: 0.1,
  jumpBufferTime: 0.15,
} as const;
export type MovementState =
  "idle" | "walk" | "run" | "jump" | "fall" | "land" | "interact";
