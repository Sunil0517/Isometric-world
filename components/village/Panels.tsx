"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  Flame,
  House,
  Mail,
  Mountain,
  X,
} from "lucide-react";
import {
  locations,
  portfolio,
  projects,
  skillGroups,
  experiences,
  type Section,
} from "@/lib/village/data";
import { crystals } from "@/lib/village/minigames/config";
import { useAdventure } from "@/lib/village/minigames/store";
import { restoreFocus, useGame } from "@/lib/village/store";
export const sectionIcons = {
  about: House,
  projects: Flame,
  skills: BookOpen,
  experience: Mountain,
  contact: Mail,
};
export function PortfolioContent({ section }: { section: Section }) {
  const [filter, setFilter] = useState("All"),
    [detail, setDetail] = useState<string | null>(null);
  if (section === "about")
    return (
      <div className="about-content">
        <span className="portrait-mark">
          {portfolio.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
        <h3>Hi, I’m {portfolio.name.split(" ")[0]}.</h3>
        <p>{portfolio.description}</p>
        <div className="panel-note">
          <strong>A little imagination. Thoughtful code.</strong>
          <p>{portfolio.intro}</p>
        </div>
        <p>
          This village brings my interest in welcoming interfaces and playful
          interactions into one small world.
        </p>
      </div>
    );
  if (section === "projects")
    return (
      <>
        <p>
          Ideas shaped into interfaces. These are the sample concepts from this
          portfolio; live project links haven’t been configured.
        </p>
        <div className="project-filters" aria-label="Filter projects">
          {["All", "Websites", "Applications"].map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => {
                setFilter(f);
                setDetail(null);
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="village-projects">
          {projects
            .filter((p) => filter === "All" || p.category === filter)
            .map((p) => (
              <article key={p.id} className="village-project">
                <div className={`project-illustration project-${p.id}`}>
                  <span>
                    {p.id === "botanical"
                      ? "✿"
                      : p.id === "daylight"
                        ? "☀"
                        : "✦"}
                  </span>
                  <small>{p.type}</small>
                  <strong>{p.title}</strong>
                </div>
                <div className="project-copy">
                  <small>CONCEPT · {p.category}</small>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="village-tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  {p.liveUrl && (
                    <a
                      className="text-button"
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit project <ArrowUpRight size={16} />
                    </a>
                  )}
                  {p.githubUrl && (
                    <a
                      className="text-button"
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View code <ArrowUpRight size={16} />
                    </a>
                  )}
                  <button
                    className="text-button"
                    aria-expanded={detail === p.id}
                    onClick={() => setDetail(detail === p.id ? null : p.id)}
                  >
                    {" "}
                    {detail === p.id ? "Close details" : "Explore concept"}{" "}
                    <ArrowUpRight size={16} />
                  </button>
                  {detail === p.id && (
                    <div className="panel-note">
                      <strong>{p.type}</strong>
                      <p>{p.longDescription}</p>
                      <p>
                        Sample concept. Case studies, screenshots, and
                        repository links can be added when available.
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))}
        </div>
      </>
    );
  if (section === "skills")
    return (
      <>
        <p>
          A configurable library of tools and technologies. These sample
          categories describe the portfolio structure; they aren’t verified
          claims of personal expertise.
        </p>
        <div className="skills-list">
          {skillGroups.map((group) => (
            <article key={group.title}>
              <BookOpen size={20} />
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <div className="village-tags">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </>
    );
  if (section === "experience" && experiences.length)
    return (
      <div className="career-timeline">
        {experiences.map((entry) => (
          <article key={entry.id}>
            <small>{entry.dates}</small>
            <h3>{entry.position}</h3>
            <strong>{entry.company}</strong>
            <ul>
              {entry.responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <div className="village-tags">
              {entry.technologies.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            {entry.outcome && <p>{entry.outcome}</p>}
          </article>
        ))}
      </div>
    );
  if (section === "experience")
    return (
      <div className="empty-history">
        <Mountain size={44} />
        <h3>Every journey has a beginning.</h3>
        <p>
          Professional experience hasn’t been added yet. This hall has room for
          employment, freelance projects, internships, and open-source
          contributions.
        </p>
        <div className="panel-note">
          Explore the Forge to see the current sample project concepts.
        </div>
      </div>
    );
  return (
    <>
      <p>
        Good things start with a hello. Find the configured ways to get in touch
        below.
      </p>
      <div className="contact-links">
        {portfolio.email ? (
          <a href={`mailto:${portfolio.email}`}>
            <Mail size={22} />
            <span>
              Email<small>{portfolio.email}</small>
            </span>
            <ArrowUpRight />
          </a>
        ) : (
          <div className="panel-note">
            <Mail size={24} />
            <h3>The mailbox is waiting.</h3>
            <p>
              An email address hasn’t been configured yet. No messages can be
              sent from this portfolio until contact details are added.
            </p>
          </div>
        )}
        {portfolio.github && (
          <a href={portfolio.github} target="_blank" rel="noopener noreferrer">
            GitHub <ArrowUpRight />
          </a>
        )}
        {portfolio.resumeUrl && (
          <a
            href={portfolio.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View resume <ArrowUpRight />
          </a>
        )}
        {portfolio.linkedin && (
          <a
            href={portfolio.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn <ArrowUpRight />
          </a>
        )}
      </div>
    </>
  );
}
export function VillageMap({ compact = false }: { compact?: boolean }) {
  const position = useGame((s) => s.position),
    open = useGame((s) => s.open),
    visited = useGame((s) => s.visited);
  const collected = useAdventure((s) => s.collected);
  const coordinate = (n: number) => 50 + n * 1.6;
  return (
    <div className={`village-map ${compact ? "compact" : ""}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M18 30 Q12 48 18 70 L32 85 Q52 95 74 79 L88 60 Q91 43 78 24 L55 11 Q30 8 18 30"
          fill="#7b9660"
        />
        <path
          d="M7 76 Q35 62 48 78 T94 69"
          fill="none"
          stroke="#83bec7"
          strokeWidth="6"
        />
        <path
          d="M50 60 Q34 52 36 41 M50 60 Q65 58 60 44 M50 60 L33 63 M50 60 L61 67 M61 67 L76 52 M50 60 L50 84"
          fill="none"
          stroke="#dbc69b"
          strokeWidth="2"
        />
        {Array.from({ length: 20 }, (_, i) => (
          <path
            key={i}
            d="M-2 3 L0 -3 L2 3Z"
            fill={i % 2 ? "#4d704a" : "#58794b"}
            transform={`translate(${22 + (Math.sin(i * 7) + 1) * 28},${15 + (Math.cos(i * 7) + 1) * 32})`}
          />
        ))}
      </svg>
      {crystals
        .filter((c) => !collected.includes(c.id))
        .map((c) => (
          <span
            key={c.id}
            className="map-crystal-region"
            title="Crystal search region"
            style={{
              left: `${coordinate(c.position[0])}%`,
              top: `${coordinate(c.position[2])}%`,
            }}
          />
        ))}
      {locations.map((l) => {
        const Icon = sectionIcons[l.id];
        if (compact)
          return (
            <span
              className="compact-landmark"
              key={l.id}
              style={{
                left: `${coordinate(l.position[0])}%`,
                top: `${coordinate(l.position[2])}%`,
              }}
            >
              <Icon size={12} />
            </span>
          );
        return (
          <button
            disabled={compact}
            tabIndex={compact ? -1 : 0}
            key={l.id}
            title={l.name}
            aria-label={`Open ${l.name} from map`}
            style={{
              left: `${coordinate(l.position[0])}%`,
              top: `${coordinate(l.position[2])}%`,
            }}
            className={visited.includes(l.id) ? "visited" : ""}
            onClick={() => open(l.id)}
          >
            <Icon size={compact ? 12 : 20} />
            {!compact && <span>{l.name}</span>}
          </button>
        );
      })}
      {position[0] < 30 && (
        <span
          className="map-player"
          style={{
            left: `${coordinate(position[0])}%`,
            top: `${coordinate(position[1])}%`,
          }}
          title="Your position"
        />
      )}
      {!compact && <span className="map-arrival">Arrival clearing</span>}
    </div>
  );
}
export default function Panels() {
  const panel = useGame((s) => s.panel),
    close = useGame((s) => s.close),
    quality = useGame((s) => s.quality),
    reduced = useGame((s) => s.reduced),
    zoom = useGame((s) => s.zoom),
    volume = useGame((s) => s.volume),
    sound = useGame((s) => s.sound);
  const location = locations.find((l) => l.id === panel);
  const titles =
    panel === "map"
      ? ["Village map", "Choose a place to explore"]
      : panel === "settings"
        ? ["Make yourself at home", "Your adventure, your pace"]
        : [location?.name, location?.subtitle];
  return (
    <Dialog.Root
      open={!!panel}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <AnimatePresence>
        {panel && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="panel-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                restoreFocus();
              }}
            >
              <motion.section
                className={`portfolio-panel ${panel === "map" ? "map-panel" : ""}`}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Dialog.Close className="panel-close" aria-label="Close panel">
                  <X size={20} />
                </Dialog.Close>
                <span className="panel-eyebrow">THE FOREST VILLAGE</span>
                <Dialog.Title>{titles[0]}</Dialog.Title>
                <Dialog.Description>{titles[1]}</Dialog.Description>
                <div className="panel-body">
                  {panel === "map" ? (
                    <>
                      <VillageMap />
                      <p>
                        Select a landmark to open its portfolio section. The
                        golden dot marks your current position.
                      </p>
                    </>
                  ) : panel === "settings" ? (
                    <div className="settings-content">
                      <label>
                        Graphics quality
                        <select
                          value={quality}
                          onChange={(e) =>
                            useGame.setState({
                              quality: e.target.value as typeof quality,
                            })
                          }
                        >
                          <option value="low">Low · lighter rendering</option>
                          <option value="medium">Medium · balanced</option>
                          <option value="high">High · sharper shadows</option>
                          <option value="ultra">
                            Ultra · realistic materials & water
                          </option>
                        </select>
                      </label>
                      <label>
                        Camera zoom
                        <input
                          type="range"
                          min=".75"
                          max="1.5"
                          step=".05"
                          value={zoom}
                          onChange={(e) =>
                            useGame.setState({ zoom: Number(e.target.value) })
                          }
                        />
                      </label>
                      <label>
                        Village chill ambience volume
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step=".05"
                          value={volume}
                          onChange={(e) =>
                            useGame.setState({ volume: Number(e.target.value) })
                          }
                        />
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={sound}
                          onChange={(e) =>
                            useGame.setState({ sound: e.target.checked })
                          }
                        />{" "}
                        Village chill ambience · breeze, stream & soft chimes
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={reduced}
                          onChange={(e) =>
                            useGame.setState({ reduced: e.target.checked })
                          }
                        />{" "}
                        Reduce decorative motion
                      </label>
                      <a href="/portfolio">
                        Open the standard portfolio <ArrowUpRight size={16} />
                      </a>
                    </div>
                  ) : (
                    <PortfolioContent key={panel} section={panel} />
                  )}
                </div>
              </motion.section>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
