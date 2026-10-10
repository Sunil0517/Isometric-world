export interface Profile {
  name: string;
  role: string;
  email: string;
  phone: string;
  phoneHref: string;
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
// Professional details transcribed from Sunil_Kumawat_Resume.docx.
// “Present” is retained as supplied, rather than inferring an end date.
export const portfolio: Profile = {
  name: "Sunil Kumawat",
  role: "Full Stack Developer",
  email: "sunilkumawat7717@gmail.com",
  phone: "+91 7300192621",
  phoneHref: "tel:+917300192621",
  github: "https://github.com/Sunil0517",
  linkedin: "https://www.linkedin.com/in/sunil-kumawat-3bb6ba178/",
  resumeUrl: "/Sunil_Kumawat_Resume.docx",
  intro: "Seeking to bring this experience to a high-growth fintech platform.",
  description:
    "Full Stack Developer with hands-on experience building and scaling web applications using React, Next.js, and Node.js, with strong backend and database expertise. Skilled in designing REST and GraphQL APIs, optimizing PostgreSQL schemas with Prisma and TypeORM, and building responsive interfaces with Tailwind CSS. Comfortable working across the stack with a backend-heavy focus, containerizing services with Docker, and collaborating in fast-paced, deadline-driven teams.",
};
export const experiences: Experience[] = [
  {
    id: "tdc-junior",
    position: "Junior Developer",
    company: "The Developer Company (TDC Consultancy Pvt Ltd), Udaipur",
    dates: "March 2024 – Present",
    responsibilities: [
      "Built a multi-tenant site builder platform end-to-end using Next.js, TypeORM, TypeScript, and Tailwind CSS, with file storage on Google Cloud Storage (GCS) and transactional email via Amazon SES.",
      "Designed and implemented a theme pilot for a multi-tenant e-commerce store, enabling merchants to manage and switch storefront themes directly from the CMS.",
      "Managed and optimized PostgreSQL databases, ensuring data integrity and query performance.",
      "Integrated REST APIs, GraphQL, and Nodemailer to support seamless communication and automation between services.",
      "Used Git for version control and collaborated with cross-functional teams to manage code repositories.",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "TypeORM",
      "Tailwind CSS",
      "PostgreSQL",
      "Google Cloud Storage",
      "Amazon SES",
      "REST APIs",
      "GraphQL",
      "Nodemailer",
      "Git",
    ],
  },
  {
    id: "tdc-trainee",
    position: "Trainee Developer (Internship)",
    company: "The Developer Company (TDC Consultancy Pvt Ltd), Udaipur",
    dates: "September 2023 – February 2024",
    responsibilities: [
      "Developed web applications using React, Next.js, and Node.js.",
      "Designed user interfaces with Tailwind CSS and Bootstrap, focusing on usability and aesthetics.",
      "Managed PostgreSQL databases, implementing efficient querying and performance tuning.",
      "Integrated REST APIs and GraphQL for dynamic data retrieval and communication.",
      "Consistently met project deadlines while working in a fast-paced, collaborative environment.",
    ],
    technologies: [
      "React",
      "Next.js",
      "Node.js",
      "Tailwind CSS",
      "Bootstrap",
      "PostgreSQL",
      "REST APIs",
      "GraphQL",
    ],
  },
];
// These are work contributions documented in the resume, not standalone
// personal projects. The resume supplies no public project/repository URLs.
export const projects: Project[] = [
  {
    id: "site-builder",
    title: "Multi-tenant Site Builder",
    type: "Professional work · The Developer Company",
    description:
      "An end-to-end platform for building sites, with cloud file storage and transactional email.",
    longDescription:
      "Built a multi-tenant site builder platform end-to-end using Next.js, TypeORM, TypeScript, and Tailwind CSS. Integrated Google Cloud Storage (GCS) for file storage and Amazon SES for transactional email, with PostgreSQL database management and optimization as part of the role.",
    category: "Applications",
    color: "sage",
    tags: [
      "Next.js",
      "TypeScript",
      "TypeORM",
      "Tailwind CSS",
      "PostgreSQL",
      "GCS",
      "Amazon SES",
    ],
  },
  {
    id: "storefront-themes",
    title: "E-commerce Theme Pilot",
    type: "Professional work · The Developer Company",
    description:
      "A theme pilot enabling merchants to manage and switch their storefront themes directly from the CMS.",
    longDescription:
      "Designed and implemented a theme pilot for a multi-tenant e-commerce store at The Developer Company. Merchants could manage and switch storefront themes directly from the CMS.",
    category: "Websites",
    color: "peach",
    tags: ["Multi-tenancy", "E-commerce", "Storefront themes", "CMS"],
  },
];
export const education = {
  degree: "Bachelor of Technology in Computer Science Engineering",
  institution: "Techno India NJR Institute of Technology",
  dates: "2020 – 2024",
  grade: "CGPA: 9.0 / 10",
};
export const certifications = [
  { title: "Advanced SQL: Learn SQL Functions and Formulas", issuer: "upGrad" },
  { title: "Programming with JavaScript", issuer: "Meta" },
  { title: "React Basics", issuer: "Meta" },
];
export const skillGroups = [
  {
    title: "Languages",
    items: ["JavaScript", "TypeScript", "C", "C++"],
    description: "Programming languages across the stack.",
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS"],
    description: "Responsive interfaces and web applications.",
  },
  {
    title: "Backend",
    items: ["Node.js", "REST APIs", "GraphQL", "Vercel AI SDK"],
    description: "Services, API design, and AI integrations.",
  },
  {
    title: "Database & ORM",
    items: ["PostgreSQL", "Prisma ORM", "TypeORM", "Supabase"],
    description: "Schema design, data integrity, and query performance.",
  },
  {
    title: "Tools & DevOps",
    items: [
      "Docker",
      "Git",
      "GitHub",
      "Vercel",
      "Google Cloud Storage (GCS)",
      "Amazon SES",
      "Postman",
    ],
    description:
      "Containerized services, collaboration, deployment, and cloud tools.",
  },
  {
    title: "Design tools",
    items: ["Figma", "Excalidraw", "Canva"],
    description: "Interface design, diagrams, and visual communication.",
  },
];
