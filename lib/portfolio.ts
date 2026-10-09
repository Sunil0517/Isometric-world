export interface Profile {
  name: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
  intro: string;
  description: string;
  resumeUrl?: string;
}
export interface Project {
  id: string;
  title: string;
  type: string;
  description: string;
  longDescription?: string;
  category: "Websites" | "Applications";
  color: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  thumbnail?: string;
}
export interface Experience {
  id: string;
  position: string;
  company: string;
  dates: string;
  responsibilities: string[];
  technologies: string[];
  outcome?: string;
}
export interface SocialLink {
  label: string;
  url: string;
}
export interface Skill {
  name: string;
  category: string;
  description: string;
}
// Add only verified professional history here.
export const experiences: Experience[] = [];
// Replace these reference details with your own before publishing.
export const portfolio: Profile = {
  name: "Sunil Kumawat",
  role: "Web Developer",
  email: "",
  github: "",
  linkedin: "",
  intro: "A little imagination. A lot of thoughtful code.",
  description:
    "I build welcoming digital spaces that look good, feel natural, and work beautifully. From the first sketch to the final interaction, I care about the little things.",
};
export const projects: Project[] = [
  {
    id: "botanical",
    longDescription:
      "A storefront exploring product discovery, clear navigation, and responsive shopping layouts.",
    title: "Botanical",
    type: "Storefront concept",
    description:
      "A calm little corner of the internet for plants and the people who love them.",
    category: "Websites",
    color: "sage",
    tags: ["Next.js", "Storefront", "Responsive"],
  },
  {
    id: "daylight",
    longDescription:
      "A dashboard exploring everyday project organization and clear information hierarchy.",
    title: "Daylight",
    type: "Dashboard concept",
    description:
      "A simple, sunny workspace for keeping everyday projects moving.",
    category: "Applications",
    color: "blue",
    tags: ["React", "Dashboard", "UI design"],
  },
  {
    id: "studio",
    longDescription:
      "A studio portfolio exploring expressive typography and subtle animation.",
    title: "Clay Studio",
    type: "Portfolio concept",
    description:
      "A playful home for a creative studio, with a little personality in every detail.",
    category: "Websites",
    color: "peach",
    tags: ["Next.js", "Animation", "Portfolio"],
  },
];
