"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { portfolio } from "@/lib/portfolio";

const chapters = [
  {
    title: "A little world of thoughtful websites.",
    detail: "Scroll to meet the maker.",
  },
  {
    title: "Hey, I’m " + portfolio.name.split(" ")[0] + ".",
    detail: "I turn a little imagination into something you can use.",
  },
  {
    title: "Ideas take shape.",
    detail: "Thoughtful interfaces. Playful details. Built with care.",
  },
];
export default function ScrollStory() {
  const section = useRef<HTMLDivElement>(null),
    host = useRef<HTMLDivElement>(null),
    progressBar = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false,
      frame = 0,
      current = 0,
      lastChapter = -1;
    let engine:
      | Awaited<ReturnType<typeof import("@/lib/clay-scene").createClayScene>>
      | undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const draw = () => {
      frame = 0;
      if (!engine || !section.current) return;
      const rect = section.current.getBoundingClientRect();
      const distance = Math.max(
        1,
        section.current.offsetHeight - window.innerHeight,
      );
      const target = media.matches
        ? 0
        : Math.min(1, Math.max(0, -rect.top / distance));
      current = target;
      setReduced(media.matches);
      engine.update(current, media.matches);
      if (progressBar.current)
        progressBar.current.style.transform = `scaleX(${current})`;
      const nextChapter = current < 0.25 ? 0 : current < 0.58 ? 1 : 2;
      if (lastChapter !== nextChapter) {
        lastChapter = nextChapter;
        setChapter(nextChapter);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      engine?.resize();
      schedule();
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    const observer = new ResizeObserver(resize);
    async function init() {
      try {
        const { createClayScene } = await import("@/lib/clay-scene");
        await document.fonts.ready;
        if (cancelled || !element) return;
        engine = await createClayScene(element);
        if (cancelled) {
          engine.dispose();
          return;
        }
        element.addEventListener("webglcontextlost", onContextLost, true);
        observer.observe(element);
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", resize);
        media.addEventListener("change", resize);
        schedule();
      } catch (error) {
        if (!cancelled) {
          console.error("Clay scene unavailable", error);
          setFailed(true);
        }
      }
    }
    void init();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      media.removeEventListener("change", resize);
      element.removeEventListener("webglcontextlost", onContextLost, true);
      engine?.dispose();
    };
  }, []);
  function goToChapter(index: number) {
    if (!section.current) return;
    const distance = section.current.offsetHeight - window.innerHeight;
    const start = section.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: start + distance * [0, 0.4, 0.82][index],
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <div
      className={`story-scroll${failed ? " story-unavailable" : ""}`}
      ref={section}
    >
      <div className="story-stage">
        <div className="clay-canvas" ref={host} />
        <h1 className="sr-only">
          {portfolio.name} — {portfolio.role}
        </h1>
        {failed && (
          <div className="story-fallback">
            <span className="eyebrow">{portfolio.role}</span>
            <h2>{portfolio.name}</h2>
            <p>A little imagination. A lot of thoughtful code.</p>
            <a href="#work" className="clay-button">
              Explore my work <ArrowUpRight size={18} />
            </a>
          </div>
        )}
        <div className="story-caption" aria-live="polite" aria-atomic="true">
          <span className="story-eyebrow">
            {chapter === 0
              ? "Meet the maker"
              : chapter === 1
                ? "A friendly hello"
                : "From idea to interface"}
          </span>
          <h2>{chapters[chapter].title}</h2>
          <p>{chapters[chapter].detail}</p>
        </div>
        <div className="story-bottom">
          <a
            href={chapter === 2 || reduced || failed ? "#work" : "#story-end"}
            onClick={(event) => {
              if (chapter < 2 && !reduced && !failed) {
                event.preventDefault();
                goToChapter(chapter + 1);
              }
            }}
            className="explore-link"
          >
            {chapter === 2 || reduced || failed
              ? "Explore my work"
              : "Scroll to unfold the story"}
            <ArrowDown size={16} />
          </a>
          <nav className="story-chapters" aria-label="Story chapters">
            {["The workspace", "Meet the maker", "Ideas take shape"].map(
              (label, index) => (
                <button
                  key={label}
                  onClick={() => goToChapter(index)}
                  className={chapter === index ? "active" : ""}
                  aria-label={label}
                  aria-current={chapter === index ? "step" : undefined}
                >
                  <span />
                  {label}
                </button>
              ),
            )}
          </nav>
          <span className="story-scroll-label">SCROLL TO EXPLORE</span>
        </div>
        <div className="story-track" aria-hidden="true">
          <div ref={progressBar} />
        </div>
      </div>
      <div id="story-end" />
    </div>
  );
}
