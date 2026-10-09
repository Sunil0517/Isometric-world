"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Compass,
  Leaf,
  Map,
  Settings2,
  Volume2,
  VolumeX,
  Footprints,
  ChevronsUp,
  Menu,
  X,
} from "lucide-react";
import { locations, portfolio } from "@/lib/village/data";
import { input, releaseInput, useGame } from "@/lib/village/store";
import { blocksMovement, useAdventure } from "@/lib/village/minigames/store";
import { nearestActivity } from "@/lib/village/minigames/config";
import Panels, { VillageMap } from "./Panels";
const AdventureUI = dynamic(() => import("./minigames/AdventureUI"), {
  ssr: false,
});
const Scene = dynamic(() => import("./Scene"), { ssr: false });
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-failure">
        <h2>The village couldn’t load.</h2>
        <p>Your portfolio is still available.</p>
        <a className="primary-button" href="/portfolio">
          Open standard portfolio <ArrowUpRight size={18} />
        </a>
      </div>
    ) : (
      this.props.children
    );
  }
}
function interact() {
  const game = useGame.getState();
  if (game.panel || useAdventure.getState().activeGame) return;
  const activity = nearestActivity(...game.position);
  if (activity) useAdventure.getState().start(activity.id);
  else if (game.near) game.open(game.near);
}
function MobileControls() {
  const pad = useRef<HTMLDivElement>(null),
    [stick, setStick] = useState({ x: 0, y: 0 });
  const near = useGame((s) => s.near),
    position = useGame((s) => s.position);
  function update(event: React.PointerEvent) {
    const rect = pad.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (event.clientX - rect.left - rect.width / 2) / 36,
      y = (event.clientY - rect.top - rect.height / 2) / 36;
    const length = Math.max(1, Math.hypot(x, y));
    input.x = x / length;
    input.y = -y / length;
    setStick({ x: input.x * 28, y: -input.y * 28 });
  }
  function stop() {
    input.x = 0;
    input.y = 0;
    setStick({ x: 0, y: 0 });
  }
  return (
    <div className="mobile-controls">
      <div
        className="joystick"
        ref={pad}
        role="group"
        aria-label="Movement joystick"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          update(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) update(e);
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
      >
        <span style={{ transform: `translate(${stick.x}px,${stick.y}px)` }}>
          <Footprints size={20} />
        </span>
      </div>
      <div className="touch-actions">
        <button
          aria-label="Jump"
          onPointerDown={() => {
            input.jumpAt = performance.now() / 1000;
          }}
        >
          <ChevronsUp size={24} />
          <small>Jump</small>
        </button>
        <button
          disabled={!near && !nearestActivity(...position)}
          onClick={() => interact()}
          aria-label="Interact"
        >
          <ArrowUpRight size={24} />
          <small>Explore</small>
        </button>
      </div>
    </div>
  );
}
function useAudio() {
  const sound = useGame((s) => s.sound),
    volume = useGame((s) => s.volume),
    audio = useRef<import("howler").Howl | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (sound) {
      import("howler").then(({ Howl }) => {
        if (cancelled) return;
        if (!audio.current)
          audio.current = new Howl({
            src: ["/sounds/village-chill.wav"],
            loop: true,
            volume: useGame.getState().volume,
          });
        if (!document.hidden && !audio.current.playing()) audio.current.play();
      });
    } else audio.current?.pause();
    return () => {
      cancelled = true;
    };
  }, [sound]);
  useEffect(() => {
    audio.current?.volume(volume);
  }, [volume]);
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) audio.current?.pause();
      else if (
        useGame.getState().sound &&
        audio.current &&
        !audio.current.playing()
      )
        audio.current.play();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      audio.current?.unload();
    };
  }, []);
}
export default function Experience() {
  const started = useGame((s) => s.started),
    ready = useGame((s) => s.ready),
    reduced = useGame((s) => s.reduced),
    near = useGame((s) => s.near),
    open = useGame((s) => s.open),
    start = useGame((s) => s.start),
    sound = useGame((s) => s.sound),
    visited = useGame((s) => s.visited),
    position = useGame((s) => s.position),
    elevation = useGame((s) => s.elevation),
    movementState = useGame((s) => s.motion),
    panel = useGame((s) => s.panel);
  const activeGame = useAdventure((s) => s.activeGame),
    phase = useAdventure((s) => s.phase);
  const [menu, setMenu] = useState(false),
    [slow, setSlow] = useState(false);
  useAudio();
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    useGame.setState({
      reduced: mq.matches,
      quality:
        window.innerWidth < 768 || navigator.hardwareConcurrency <= 4
          ? "low"
          : "medium",
    });
    const onMotion = () => useGame.setState({ reduced: mq.matches });
    mq.addEventListener("change", onMotion);
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase(),
        game = useGame.getState();
      if (
        key === " " &&
        event.target instanceof HTMLElement &&
        event.target.closest("button,a")
      )
        return;
      if (
        event.target instanceof HTMLElement &&
        (event.target.closest("input,textarea,select") ||
          (game.panel && event.target.closest('[role="dialog"]')))
      )
        return;
      if (useAdventure.getState().activeGame && key === "e") return;
      if (blocksMovement()) return;
      if (key === "m" && !event.repeat) {
        event.preventDefault();
        if (game.panel === "map") game.close();
        else game.open("map");
        return;
      }
      if (
        key === "e" &&
        !event.repeat &&
        game.started &&
        !game.panel &&
        (game.near || nearestActivity(...game.position))
      ) {
        event.preventDefault();
        interact();
        return;
      }
      if (
        game.started &&
        !game.panel &&
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          "shift",
          " ",
        ].includes(key)
      ) {
        event.preventDefault();
        input.keys.add(key);
        if (key === " " && !event.repeat)
          input.jumpAt = performance.now() / 1000;
      }
    };
    const onUp = (event: KeyboardEvent) =>
      input.keys.delete(event.key.toLowerCase());
    const onHidden = () => {
      if (document.hidden) releaseInput();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", releaseInput);
    document.addEventListener("visibilitychange", onHidden);
    const timer = setTimeout(() => setSlow(true), 15000);
    return () => {
      clearTimeout(timer);
      mq.removeEventListener("change", onMotion);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", releaseInput);
      document.removeEventListener("visibilitychange", onHidden);
      releaseInput();
    };
  }, []);
  useEffect(() => {
    if (panel) releaseInput();
  }, [panel]);
  const target = locations.find((l) => l.id === near);
  const activityTarget = nearestActivity(...position);
  return (
    <main
      className={`village-experience ${started ? "is-exploring" : ""} ${reduced ? "reduced-motion" : ""}`}
    >
      <a className="skip-link" href="/portfolio">
        Skip to standard portfolio
      </a>
      <div
        className="scene-host"
        id="world-input"
        role="group"
        tabIndex={0}
        aria-label="Interactive isometric forest village"
      >
        <SceneBoundary>
          <Scene />
        </SceneBoundary>
      </div>
      <div className="village-vignette" />
      <header className="village-header">
        <Link href="/" className="village-brand">
          <span className="brand-symbol">
            <Leaf size={22} />
          </span>
          <span>
            The Forest Village
            <small>
              {portfolio.name} · {portfolio.role}
            </small>
          </span>
        </Link>
        <nav
          className={`village-nav ${menu ? "open" : ""}`}
          aria-label="Portfolio navigation"
        >
          {locations.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                open(l.id);
                setMenu(false);
              }}
            >
              {l.id === "about"
                ? "About me"
                : l.id.charAt(0).toUpperCase() + l.id.slice(1)}
            </button>
          ))}
        </nav>
        <div className="header-tools">
          <button
            aria-label={sound ? "Mute sound" : "Enable sound"}
            title={sound ? "Mute sound" : "Enable sound"}
            aria-pressed={sound}
            onClick={() => useGame.setState({ sound: !sound })}
          >
            {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            aria-label="Open settings"
            title="Settings"
            onClick={() => open("settings")}
          >
            <Settings2 size={18} />
          </button>
          <button
            aria-label="Open village map"
            title="Village map (M)"
            onClick={() => open("map")}
          >
            <Map size={18} />
          </button>
          <button
            className="mobile-menu"
            aria-label="Toggle portfolio menu"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      <div className="world-status">
        <span className="status-dot" /> A small world. A little of me.
        <span className="status-divider">/</span>
        <span>Built to be explored</span>
      </div>
      {!started && (
        <section className="village-welcome">
          <span className="welcome-kicker">
            <span /> A DEVELOPER’S LITTLE WORLD
          </span>
          <h1>
            Thoughtful code.
            <br />A curious <em>spirit.</em>
          </h1>
          <p>
            Welcome to my corner of the forest.
            <br />
            Follow the trails. Peek inside. Get to know
            <br className="desktop-break" /> the maker behind the work.
          </p>
          <button
            id="explore-button"
            className="primary-button"
            disabled={!ready}
            onClick={() => {
              start();
              document.getElementById("world-input")?.focus();
            }}
          >
            <Compass size={19} />
            {ready ? "Explore the village" : "Preparing the village…"}
            <ArrowUpRight size={18} />
          </button>
          <a className="standard-link" href="/portfolio">
            Just here for the portfolio? <ArrowUpRight size={14} />
          </a>
          {slow && !ready && (
            <p className="loading-note" role="status">
              Loading is taking a little longer. The standard portfolio is
              available above.
            </p>
          )}
        </section>
      )}
      {started && (
        <div className="exploration-note">
          <Compass size={16} />
          <span>
            {visited.length === 5
              ? "You’ve explored every landmark."
              : "Make yourself at home."}
            <small>{visited.length} of 5 places discovered</small>
          </span>
          <button
            id="explore-button"
            className="reset-view"
            onClick={() => {
              releaseInput();
              useGame.setState({ started: false });
            }}
          >
            Overview
          </button>
        </div>
      )}
      <div className="north-marker">
        <Compass size={24} />
        <span>N</span>
      </div>
      <footer className="village-footer">
        <div className="controls-hint">
          <span className="control-keys">
            <kbd>W</kbd>
            <span>
              <kbd>A</kbd>
              <kbd>S</kbd>
              <kbd>D</kbd>
            </span>
          </span>
          <span>
            Wander around
            <small>
              <kbd>Shift</kbd> run <span>·</span> <kbd>Space</kbd> jump
            </small>
          </span>
        </div>
        <div className="footer-center">
          {started && !activeGame && (target || activityTarget) ? (
            <button className="interaction-prompt" onClick={interact}>
              <kbd>E</kbd>
              <span>
                {activityTarget
                  ? activityTarget.prompt
                  : `Explore ${target?.name}`}
              </span>
              <ArrowUpRight size={16} />
            </button>
          ) : (
            <span>
              <Leaf size={14} /> Take the scenic route.
            </span>
          )}
        </div>
        <button
          className="map-open-button"
          onClick={() => open("map")}
          aria-label="View full village map"
        >
          <VillageMap compact />
          <span>
            Village map <kbd>M</kbd>
          </span>
        </button>
      </footer>
      {started &&
        !panel &&
        (!activeGame || (activeGame === "parkour" && phase === "playing")) && (
          <MobileControls />
        )}
      <output
        className="player-diagnostics"
        data-y={elevation}
        data-x={position[0]}
        data-z={position[1]}
        data-state={movementState}
        aria-label="Player status"
      >
        {movementState}
      </output>
      <AdventureUI />
      <Panels />
    </main>
  );
}
