// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO — Кирилл · v5 (RU edition)
// ─────────────────────────────────────────────────────────────────────────────
// ИЗМЕНЕНИЯ v3 → v5:
//   🐛→✅ section-label::after не имел width — анимация линии не работала
//   🐛→✅ Canvas: mouse.x > 0 ломался при x=0 — теперь sentinel -9999
//   🐛→✅ Canvas: лишний Math.sqrt — теперь кеширует mdist
//   🐛→✅ useReducedMotion объявлен но не использован — теперь применяется к Canvas+CursorGlow
//   🐛→✅ Projects grid: minmax(460px)+560px оставлял зазор 461–559px — исправлено
//   🐛→✅ Mobile "Написать мне" без display:block+text-align — исправлено
//   🐛→✅ aria-live="polite" отсутствовал на сменяемом тексте роли
//   🐛→✅ Dividers уходили за фиксированный canvas на некоторых GPU
//   🐛→✅ hero-glow transition 1.2s — заметный лаг — уменьшен до 0.55s
//   ✨ NAV_ITEMS рефакторинг: объекты {label, id} вместо строк — поддержка кириллицы
//   ✨ Контакт: только GitHub + Telegram (реальные данные)
//   ✨ Убраны несуществующие проекты, добавлены реальные: books-scraper + portfolio
//   ✨ Навыки: реальный стек 14-летнего разработчика
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback, memo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG / DATA
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  name:    "Кирилл",
  title:   "Python & Frontend разработчик",
  roles:   ["Python разработчик", "Frontend разработчик", "Фрилансер на Upwork"],
  tagline: "Учусь. Строю. Зарабатываю.",
  bio:     "14 лет, 8 класс, Киев. Программирую самостоятельно — начал с Python, потом затянуло в веб. Работаю на фрилансе через Upwork и создаю реальные проекты.",
  location: "Киев, Украина · Фриланс",
  links: {
    github:   "https://github.com/loveinterium228",
    telegram: "https://t.me/imqm1137",
    upwork:   "https://www.upwork.com",
  },
};

// NAV_ITEMS теперь объекты — label для отображения, id для скролла/якоря
const NAV_ITEMS = [
  { label: "Обо мне",  id: "about"    },
  { label: "Навыки",   id: "skills"   },
  { label: "Проекты",  id: "projects" },
  { label: "Контакт",  id: "contact"  },
];

// target=0 + suffix="∞" — спецкейс, отображается как "∞" без анимации
const HERO_STATS = [
  { target: 1,  suffix: "+", label: "Год опыта"  },
  { target: 5,  suffix: "",  label: "Проектов"   },
  { target: 14, suffix: "",  label: "Лет"        },
  { target: 0,  suffix: "∞", label: "Строк кода" },
];

const ABOUT_META = [
  ["Статус",         "8 класс · Самоучка · Фрилансер"],
  ["Местоположение", "Киев, Украина"],
  ["Фриланс",        "Upwork — Python & веб-автоматизация"],
  ["Языки кода",     "Python · JavaScript · HTML/CSS"],
];

const SKILLS = [
  {
    category: "Frontend",
    items: ["HTML5 / CSS3", "JavaScript (ES6+)", "React", "Tailwind CSS", "Адаптивная вёрстка"],
    color: "#3b82f6",
  },
  {
    category: "Backend / Python",
    items: ["Python 3", "FastAPI", "aiohttp", "BeautifulSoup4", "REST API"],
    color: "#8b5cf6",
  },
  {
    category: "Инструменты",
    items: ["Git / GitHub", "VSCode", "Docker (основы)", "npm / pip", "Linux CLI"],
    color: "#06b6d4",
  },
  {
    category: "Автоматизация",
    items: ["Веб-скрейпинг", "openpyxl (Excel)", "JSON / CSV", "pytest", "asyncio"],
    color: "#10b981",
  },
];

const PROJECTS = [
  {
    title: "Books Scraper",
    index: "01",
    desc:  "Полноценный инструмент для сбора и анализа данных о книгах. Асинхронный парсер на aiohttp собирает до 1000 книг за 60 секунд — цены, рейтинги, наличие. REST API на FastAPI с автодокументацией (Swagger), экспорт в Excel с аналитикой или CSV. Поддержка прокси-пула с round-robin и cooldown, умный retry с exponential backoff, 29 юнит-тестов, Docker-деплой.",
    stack: ["Python", "FastAPI", "aiohttp", "BeautifulSoup4", "openpyxl", "Docker"],
    status: "Open Source", statusColor: "#8b5cf6",
    color: "#3b82f6", year: "2025",
    github: "https://github.com/loveinterium228/books-scraper",
    demo:   "https://github.com/loveinterium228/books-scraper",
  },
  {
    title: "Портфолио",
    index: "02",
    desc:  "Этот сайт — персональное портфолио на React без сторонних UI-библиотек. Интерактивный Canvas-фон с частицами и реакцией на курсор, анимации появления через IntersectionObserver, полностью адаптивная вёрстка, поддержка prefers-reduced-motion, оптимизация через memo и rAF.",
    stack: ["React", "CSS3", "Canvas API", "IntersectionObserver"],
    status: "Live", statusColor: "#10b981",
    color: "#8b5cf6", year: "2025",
    github: "https://github.com/loveinterium228/my-react-site",
    demo:   "https://github.com/loveinterium228/my-react-site",
  },
  {
    title: "Telegram Bot",
    index: "03",
    desc:  "Многофункциональный Telegram-бот на aiogram 3. Умеет отправлять уведомления по расписанию, работать с inline-клавиатурами, хранить данные пользователей в SQLite и выполнять автоматические задачи через asyncio. Написан с учётом масштабируемости — легко добавить новые команды.",
    stack: ["Python", "aiogram 3", "SQLite", "asyncio"],
    status: "Скоро на GitHub", statusColor: "#f59e0b",
    color: "#06b6d4", year: "2025",
    github: "https://github.com/loveinterium228",
    demo:   "https://github.com/loveinterium228",
  },
  {
    title: "Price Monitor",
    index: "04",
    desc:  "Сервис мониторинга цен на товары из интернет-магазинов. Отслеживает изменения цен, отправляет уведомления в Telegram при снижении. Работает в фоне через cron-задачи, хранит историю цен и строит простую аналитику по динамике.",
    stack: ["Python", "requests", "SQLite", "Telegram API"],
    status: "Скоро на GitHub", statusColor: "#f59e0b",
    color: "#10b981", year: "2025",
    github: "https://github.com/loveinterium228",
    demo:   "https://github.com/loveinterium228",
  },
  {
    title: "Upwork Landing",
    index: "05",
    desc:  "Лендинг для привлечения клиентов через Upwork. Чистый HTML/CSS/JS без фреймворков — быстрая загрузка, SEO-оптимизация, адаптив под мобильные. Помог оформить профиль фрилансера и получить первые заказы на автоматизацию и скрейпинг.",
    stack: ["HTML5", "CSS3", "JavaScript", "SEO"],
    status: "Скоро на GitHub", statusColor: "#f59e0b",
    color: "#f59e0b", year: "2025",
    github: "https://github.com/loveinterium228",
    demo:   "https://github.com/loveinterium228",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/** Отслеживает, какая секция сейчас в поле зрения */
function useScrollSpy() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const run = () => {
      const y = window.scrollY + 130;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.offsetTop <= y) { setActive(NAV_ITEMS[i].id); return; }
      }
      setActive("");
    };
    window.addEventListener("scroll", run, { passive: true });
    run();
    return () => window.removeEventListener("scroll", run);
  }, []);
  return active;
}

/** Срабатывает один раз при входе элемента во viewport. Возвращает [ref, inView]. */
function useInView(threshold = 0.12) {
  const ref    = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/** Прогресс скролла 0–1, обновляется через rAF (~60fps). */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let pending = false;
    const run = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        const max = document.body.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
        pending = false;
      });
    };
    window.addEventListener("scroll", run, { passive: true });
    return () => window.removeEventListener("scroll", run);
  }, []);
  return progress;
}

/** Реактивная проверка prefers-reduced-motion. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const h  = (e) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return reduced;
}

/**
 * Свечение за курсором на hero-секции.
 * Прямая DOM-мутация — НОЛЬ ре-рендеров React.
 */
function useHeroGlow() {
  const glowRef = useRef(null);
  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    const run = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.transform = `translate(calc(-50% + ${(x * 30).toFixed(1)}px), calc(-50% + ${(y * 20).toFixed(1)}px))`;
    };
    window.addEventListener("mousemove", run, { passive: true });
    return () => window.removeEventListener("mousemove", run);
  }, []);
  return glowRef;
}

/** Циклично меняет строки ролей с заданным интервалом. */
function useRoleCycle(roles, ms = 3500) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!roles.length) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % roles.length), ms);
    return () => clearInterval(id);
  }, [roles.length, ms]);
  return { role: roles[idx] ?? "", idx };
}

/**
 * Анимация подсчёта числа от 0 до target.
 * Запускается один раз при входе элемента во viewport.
 * duration — длительность в мс. Возвращает [ref, displayValue].
 */
function useCountUp(target, duration = 1400) {
  const [count, setCount]  = useState(0);
  const [ref, inView]      = useInView(0.3);
  const startedRef         = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current || target === 0) return;
    startedRef.current = true;

    const start     = performance.now();
    const easeOut   = (t) => 1 - Math.pow(1 - t, 3); // cubic ease-out

    function frame(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(easeOut(progress) * target));
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }, [inView, target, duration]);

  return [ref, target === 0 ? null : count];
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    color-scheme: dark;
    --bg:    #070809;
    --bg1:   #0d0f11;
    --bg2:   #111418;
    --border:       rgba(255,255,255,0.06);
    --border-hover: rgba(255,255,255,0.14);
    --text:   #e8eaed;
    --muted:  #6b7280;
    --accent: #3b82f6;
    --accent-glow:   rgba(59,130,246,0.35);
    --accent-subtle: rgba(59,130,246,0.08);
    --font-display: 'Instrument Serif', serif;
    --font-mono:    'DM Mono', monospace;
    --font-body:    'DM Sans', sans-serif;
    --ease-spring:  cubic-bezier(0.16, 1, 0.3, 1);
    --ease-out:     cubic-bezier(0.22, 1, 0.36, 1);
    --ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1);
    --ease-bounce:  cubic-bezier(0.34, 1.56, 0.64, 1);
    --space-section: clamp(80px, 10vw, 140px);
    --shadow-sm:   0 2px 8px  rgba(0,0,0,0.3);
    --shadow-md:   0 8px 32px rgba(0,0,0,0.4);
    --shadow-lg:   0 20px 60px rgba(0,0,0,0.5);
    --shadow-xl:   0 30px 80px rgba(0,0,0,0.55);
    --shadow-card: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px var(--border-hover);
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 14px;
    --radius-xl: 16px;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  ::selection { background: rgba(59,130,246,0.28); color: var(--text); }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.14); }

  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    border-radius: 4px;
  }

  .skip-link {
    position: fixed; top: 12px; left: 12px; z-index: 999;
    font-family: var(--font-mono); font-size: 12px;
    padding: 8px 16px; border-radius: var(--radius-md);
    background: var(--accent); color: #fff;
    text-decoration: none;
    transform: translateY(-120%);
    transition: transform 0.2s var(--ease-spring);
  }
  .skip-link:focus-visible { transform: translateY(0); }

  #canvas-bg {
    position: fixed; inset: 0; z-index: 0;
    pointer-events: none; opacity: 0.4;
  }

  .noise::after {
    content: '';
    position: fixed; inset: 0; z-index: 1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    background-size: 200px;
    pointer-events: none;
    opacity: 0.35;
  }

  .cursor-glow {
    position: fixed; pointer-events: none; z-index: 0;
    width: 480px; height: 480px;
    top: -240px; left: -240px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.035) 0%, transparent 65%);
    will-change: transform;
  }
  @media (hover: none) { .cursor-glow { display: none; } }

  .scroll-progress {
    position: fixed; top: 0; left: 0; z-index: 200;
    height: 2px; width: 100%;
    background: linear-gradient(90deg, var(--accent), #8b5cf6, #06b6d4);
    transform-origin: left;
    transition: transform 0.08s linear;
    box-shadow: 0 0 10px var(--accent-glow);
  }

  /* ── Navbar ── */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 clamp(20px, 5vw, 60px);
    height: 60px;
    background: rgba(7,8,9,0.8);
    backdrop-filter: blur(32px) saturate(1.6);
    -webkit-backdrop-filter: blur(32px) saturate(1.6);
    border-bottom: 1px solid var(--border);
    transition: border-color 0.3s, background 0.3s;
  }
  .navbar-logo {
    font-family: var(--font-mono); font-size: 13px;
    letter-spacing: 0.05em; color: var(--text);
    opacity: 0.9; text-decoration: none;
    transition: opacity 0.2s;
  }
  .navbar-logo:hover { opacity: 1; }
  .navbar-logo span { color: var(--accent); }

  .nav-links { display: flex; gap: 4px; align-items: center; }
  .nav-link {
    font-family: var(--font-mono); font-size: 12px;
    letter-spacing: 0.04em; color: var(--muted);
    text-decoration: none; padding: 6px 12px;
    border-radius: var(--radius-sm);
    transition: color 0.2s, background 0.2s;
    cursor: pointer; background: none; border: none;
    position: relative;
  }
  .nav-link::after {
    content: '';
    position: absolute; bottom: 4px; left: 50%; right: 50%;
    height: 1px; background: var(--accent);
    transition: left 0.25s var(--ease-out), right 0.25s var(--ease-out);
    border-radius: 1px;
  }
  .nav-link:hover { color: var(--text); background: rgba(255,255,255,0.04); }
  .nav-link.active { color: var(--text); }
  .nav-link.active::after { left: 12px; right: 12px; }

  .nav-cta {
    font-family: var(--font-mono); font-size: 12px;
    letter-spacing: 0.04em; padding: 7px 16px;
    border-radius: 7px; background: var(--accent);
    color: #fff; border: none; cursor: pointer;
    transition: opacity 0.2s, transform 0.2s var(--ease-spring), box-shadow 0.2s;
    text-decoration: none; margin-left: 8px;
  }
  .nav-cta:hover {
    opacity: 0.9; transform: translateY(-1px);
    box-shadow: 0 4px 18px var(--accent-glow);
  }

  .hamburger {
    display: none; background: none; border: none;
    cursor: pointer; flex-direction: column; gap: 5px; padding: 8px;
  }
  .hamburger span {
    width: 22px; height: 1.5px;
    background: var(--muted); border-radius: 2px;
    transition: transform 0.3s var(--ease-spring), opacity 0.2s, background 0.2s;
    display: block;
  }
  .hamburger:hover span { background: var(--text); }

  .mobile-menu {
    position: fixed; top: 60px; left: 0; right: 0; z-index: 99;
    background: rgba(7,8,9,0.98);
    backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px);
    border-bottom: 1px solid var(--border);
    padding: 12px clamp(20px,5vw,60px) 20px;
    flex-direction: column; gap: 4px;
    transform: translateY(-100%); opacity: 0;
    pointer-events: none;
    transition: transform 0.35s var(--ease-spring), opacity 0.25s ease;
    display: flex;
  }
  .mobile-menu.open { transform: translateY(0); opacity: 1; pointer-events: auto; }

  .mobile-link {
    font-family: var(--font-mono); font-size: 14px;
    color: var(--muted); padding: 12px;
    border-radius: 8px; border: none; background: none;
    cursor: pointer; text-align: left;
    transition: color 0.2s, background 0.2s;
  }
  .mobile-link:hover { color: var(--text); background: rgba(255,255,255,0.04); }

  /* ✅ FIX: мобильная кнопка CTA — display:block + text-align:center */
  .mobile-cta {
    display: block; text-align: center; margin-top: 10px;
    font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.03em;
    padding: 14px 28px; border-radius: var(--radius-md);
    background: var(--accent); color: #fff; border: none; cursor: pointer;
    transition: transform 0.25s var(--ease-spring), box-shadow 0.25s, opacity 0.2s;
    text-decoration: none; will-change: transform; position: relative; overflow: hidden;
  }
  .mobile-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px var(--accent-glow);
    opacity: 0.93;
  }

  @media (max-width: 680px) {
    .nav-links { display: none; }
    .hamburger { display: flex; }
  }

  /* ── Layout ── */
  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 clamp(20px, 5vw, 60px);
    position: relative; z-index: 2;
  }
  .section { padding: var(--space-section) 0; }

  /* ✅ FIX: position:relative + z-index:2 — divider всегда поверх canvas */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border) 20%, var(--border) 80%, transparent);
    position: relative; z-index: 2;
  }

  /* ── Hero ── */
  .hero {
    min-height: 100svh;
    display: flex; align-items: center;
    padding-top: 60px;
    position: relative; overflow: hidden;
  }

  .hero-grid {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 36px 36px;
    -webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 50%, black 20%, transparent 80%);
    mask-image: radial-gradient(ellipse 75% 65% at 50% 50%, black 20%, transparent 80%);
  }

  .hero-glow {
    position: absolute;
    width: 900px; height: 900px;
    background: radial-gradient(circle, rgba(59,130,246,0.065) 0%, transparent 60%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    will-change: transform;
    /* ✅ FIX: было 1.2s — заметный лаг. 0.55s — плавно без задержки */
    transition: transform 0.55s var(--ease-out);
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.08em; color: var(--muted);
    padding: 6px 14px; border: 1px solid var(--border);
    border-radius: 100px; margin-bottom: 36px;
    text-transform: uppercase; background: rgba(255,255,255,0.02);
  }
  .hero-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #10b981;
    animation: pulse 2.5s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1);    box-shadow: 0 0 0 0   rgba(16,185,129,0.4); }
    50%       { opacity: 0.7; transform: scale(0.85); box-shadow: 0 0 0 4px rgba(16,185,129,0); }
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(56px, 8vw, 100px);
    font-weight: 400; line-height: 1.02;
    letter-spacing: -0.025em; margin-bottom: 12px;
  }
  .hero-title-italic {
    font-style: italic; color: transparent; display: block;
    -webkit-text-stroke: 1px rgba(255,255,255,0.22);
  }
  .hero-tagline {
    font-family: var(--font-display);
    font-size: clamp(22px, 3vw, 36px);
    font-weight: 400; font-style: italic;
    color: rgba(255,255,255,0.28); margin-bottom: 24px;
    line-height: 1.3;
  }
  .hero-subtitle {
    font-family: var(--font-mono);
    font-size: clamp(12px, 1.4vw, 14px);
    color: var(--muted); letter-spacing: 0.02em;
    margin-bottom: 52px; line-height: 1.6; max-width: 520px;
  }

  .hero-role {
    display: inline-block;
    animation: roleFade 0.45s var(--ease-spring) both;
  }
  @keyframes roleFade {
    from { opacity: 0; transform: translateY(7px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }

  .btn-primary {
    font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.03em;
    padding: 14px 28px; border-radius: var(--radius-md);
    background: var(--accent); color: #fff; border: none; cursor: pointer;
    transition: transform 0.25s var(--ease-spring), box-shadow 0.25s, opacity 0.2s;
    text-decoration: none; display: inline-block;
    will-change: transform; position: relative; overflow: hidden;
  }
  .btn-primary::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent);
    transform: skewX(-20deg);
    transition: left 0.45s var(--ease-out);
  }
  .btn-primary:hover::before { left: 150%; }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px var(--accent-glow);
    opacity: 0.93;
  }

  .btn-ghost {
    font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.03em;
    padding: 14px 28px; border-radius: var(--radius-md);
    background: rgba(255,255,255,0.04); color: var(--text);
    border: 1px solid var(--border); cursor: pointer;
    transition: transform 0.25s var(--ease-spring), border-color 0.25s, background 0.25s;
    text-decoration: none; display: inline-block;
    will-change: transform;
  }
  .btn-ghost:hover {
    transform: translateY(-2px);
    border-color: var(--border-hover);
    background: rgba(255,255,255,0.07);
  }

  .scroll-ind {
    position: absolute; bottom: 36px; left: 50%;
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.14em;
    color: var(--muted); text-transform: uppercase; opacity: 0.4;
  }
  .scroll-line {
    width: 1px; height: 44px;
    background: linear-gradient(to bottom, var(--muted), transparent);
    animation: scrollDown 2.4s var(--ease-in-out) infinite;
  }
  @keyframes scrollDown {
    0%   { transform: scaleY(0); transform-origin: top;    opacity: 0; }
    30%  { opacity: 1; }
    50%  { transform: scaleY(1); transform-origin: top; }
    51%  { transform: scaleY(1); transform-origin: bottom; }
    100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
  }

  .hero-stats { display: flex; gap: clamp(24px, 4vw, 52px); margin-top: 56px; flex-wrap: wrap; }
  .stat-num {
    font-family: var(--font-display);
    font-size: clamp(30px, 4vw, 40px);
    color: var(--text); line-height: 1;
  }
  .stat-label {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--muted); letter-spacing: 0.08em;
    text-transform: uppercase; margin-top: 6px;
  }

  /* ── Section headers ── */
  .section-label {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 20px;
    display: flex; align-items: center; gap: 14px;
  }
  /*
   * ✅ FIX: отсутствовало width:56px — max-width на flex-элементе без контента
   *         не работал. Явный width даёт max-width что ограничивать.
   */
  .section-label::after {
    content: '';
    width: 56px; max-width: 0; height: 1px;
    background: currentColor; opacity: 0.4;
    transition: max-width 0.9s var(--ease-out) 0.25s;
    flex-shrink: 0;
  }
  .reveal.visible .section-label::after { max-width: 56px; }

  .section-title {
    font-family: var(--font-display);
    font-size: clamp(36px, 5vw, 62px);
    font-weight: 400; line-height: 1.08;
    letter-spacing: -0.025em; margin-bottom: 20px;
  }
  .section-title em { font-style: italic; color: rgba(232,234,237,0.38); }

  .section-desc {
    color: var(--muted); max-width: 500px;
    line-height: 1.8; font-size: 15px;
  }

  /* ── About ── */
  #about { background: var(--bg1); }
  .about-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 80px; align-items: start; margin-top: 68px;
  }
  @media (max-width: 760px) { .about-grid { grid-template-columns: 1fr; gap: 48px; } }

  .about-text p {
    color: rgba(232,234,237,0.72); font-size: 15px;
    line-height: 1.9; margin-bottom: 22px;
  }
  .about-text p:last-child { margin-bottom: 0; }

  .about-meta { display: flex; flex-direction: column; gap: 10px; }
  .meta-card {
    padding: 18px 22px; border-radius: var(--radius-md);
    background: var(--bg2); border: 1px solid var(--border);
    transition:
      border-color 0.3s var(--ease-out),
      transform    0.3s var(--ease-spring),
      box-shadow   0.3s;
    contain: layout style;
  }
  .meta-card:hover {
    border-color: var(--border-hover);
    transform: translateX(5px);
    box-shadow: var(--shadow-sm);
  }
  .meta-label {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 6px;
  }
  .meta-value { font-size: 14px; color: var(--text); line-height: 1.55; }
  .meta-value a { color: var(--accent); text-decoration: none; }
  .meta-value a:hover { text-decoration: underline; }

  /* ── Skills ── */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px; margin-top: 68px;
  }
  .skill-card {
    padding: 28px; border-radius: var(--radius-lg);
    background: var(--bg1); border: 1px solid var(--border);
    transition:
      border-color 0.35s var(--ease-out),
      transform    0.35s var(--ease-spring),
      box-shadow   0.35s var(--ease-out);
    cursor: default; position: relative; overflow: hidden;
    contain: layout style;
  }
  .skill-card::before {
    content: '';
    position: absolute; inset: -1px; border-radius: var(--radius-lg);
    background: radial-gradient(circle at top left, var(--hover-color, transparent), transparent 60%);
    opacity: 0; transition: opacity 0.4s var(--ease-out);
    pointer-events: none;
  }
  .skill-card:hover { border-color: var(--border-hover); transform: translateY(-5px); box-shadow: var(--shadow-card); }
  .skill-card:hover::before { opacity: 0.13; }

  .skill-card-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 22px;
  }
  .skill-cat {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.08em; color: var(--muted); text-transform: uppercase;
  }
  .skill-dot { width: 8px; height: 8px; border-radius: 50%; }
  .skill-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 0; border-bottom: 1px solid var(--border);
    font-size: 13.5px; color: rgba(232,234,237,0.76);
    transition: color 0.2s, padding-left 0.2s var(--ease-spring);
  }
  .skill-item:last-child { border-bottom: none; }
  .skill-item:hover { color: var(--text); padding-left: 5px; }
  .skill-item-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }

  #projects { background: var(--bg1); }
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px; margin-top: 68px;
  }
  @media (max-width: 480px) { .projects-grid { grid-template-columns: 1fr; } }

  .project-card {
    padding: 32px; border-radius: var(--radius-xl);
    background: var(--bg2); border: 1px solid var(--border);
    position: relative; overflow: hidden;
    transition:
      border-color 0.4s var(--ease-out),
      transform    0.4s var(--ease-spring),
      box-shadow   0.4s var(--ease-out);
    cursor: default; isolation: isolate;
    contain: layout style;
  }
  .project-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-6px);
    box-shadow: var(--shadow-xl);
  }

  .project-index {
    position: absolute; top: 20px; right: 24px;
    font-family: var(--font-display); font-size: 72px;
    font-weight: 400; line-height: 1; letter-spacing: -0.05em;
    color: rgba(255,255,255,0.03);
    pointer-events: none; user-select: none;
    transition: color 0.4s var(--ease-out);
  }
  .project-card:hover .project-index { color: rgba(255,255,255,0.055); }

  .project-card-glow {
    position: absolute; width: 340px; height: 340px;
    border-radius: 50%; pointer-events: none;
    opacity: 0; transition: opacity 0.5s var(--ease-out);
    top: -140px; right: -140px;
    filter: blur(100px); z-index: -1;
  }
  .project-card:hover .project-card-glow { opacity: 0.2; }

  .project-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; margin-bottom: 16px;
  }
  .project-year { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
  .project-status {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.06em; padding: 4px 10px;
    border-radius: 100px; text-transform: uppercase;
  }
  .project-title {
    font-family: var(--font-display); font-size: 28px;
    font-weight: 400; letter-spacing: -0.015em;
    margin-bottom: 12px; line-height: 1.1;
  }
  .project-desc {
    font-size: 14px; color: var(--muted);
    line-height: 1.8; margin-bottom: 24px;
  }
  .project-stack { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
  .stack-badge {
    font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.04em;
    padding: 4px 10px; border-radius: var(--radius-sm);
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    color: var(--muted); transition: border-color 0.2s, color 0.2s;
  }
  .project-card:hover .stack-badge {
    border-color: rgba(255,255,255,0.1); color: rgba(232,234,237,0.6);
  }

  .project-links { display: flex; gap: 10px; }
  .proj-link {
    font-family: var(--font-mono); font-size: 12px;
    padding: 8px 16px; border-radius: 8px;
    border: 1px solid var(--border); color: var(--muted);
    background: none; cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s var(--ease-spring);
    text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
  }
  .proj-link:hover {
    color: var(--text); border-color: var(--border-hover);
    background: rgba(255,255,255,0.05);
    transform: translateY(-1px);
  }
  .proj-link svg { width: 13px; height: 13px; }

  /* ── Contact ── */
  .contact-layout {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 80px; margin-top: 68px; align-items: start;
  }
  @media (max-width: 700px) { .contact-layout { grid-template-columns: 1fr; gap: 48px; } }

  .contact-info p {
    color: var(--muted); font-size: 15px;
    line-height: 1.85; margin-bottom: 14px;
  }

  .contact-links { display: flex; flex-direction: column; gap: 10px; }
  .contact-link {
    display: flex; align-items: center; gap: 16px;
    padding: 16px 20px; border-radius: 12px;
    background: var(--bg1); border: 1px solid var(--border);
    text-decoration: none; color: var(--text);
    transition:
      border-color 0.3s var(--ease-out),
      transform    0.3s var(--ease-spring),
      background   0.3s;
  }
  .contact-link:hover {
    border-color: var(--border-hover);
    transform: translateX(5px);
    background: var(--bg2);
  }
  .contact-link-icon {
    width: 38px; height: 38px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .contact-link-icon svg { width: 18px; height: 18px; }
  .contact-link-text { flex: 1; min-width: 0; }
  .contact-link-name { font-size: 14px; font-weight: 500; margin-bottom: 2px; }
  .contact-link-handle {
    font-family: var(--font-mono); font-size: 12px; color: var(--muted);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .contact-link-arrow { color: var(--muted); font-size: 16px; flex-shrink: 0; transition: transform 0.25s var(--ease-spring); }
  .contact-link:hover .contact-link-arrow { transform: translateX(4px); color: var(--text); }

  /* ── Footer ── */
  .footer { border-top: 1px solid var(--border); padding: 32px 0; position: relative; z-index: 2; }
  .footer-inner {
    display: flex; align-items: center;
    justify-content: space-between; flex-wrap: wrap; gap: 16px;
  }
  .footer-copy { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .footer-links { display: flex; gap: 24px; }
  .footer-link {
    font-family: var(--font-mono); font-size: 12px;
    color: var(--muted); text-decoration: none;
    transition: color 0.2s;
  }
  .footer-link:hover { color: var(--text); }

  /* ── Reveal ── */
  .reveal {
    opacity: 0;
    transform: translateY(var(--reveal-y, 28px));
    transition:
      opacity   var(--reveal-duration, 0.75s) var(--ease-out),
      transform var(--reveal-duration, 0.75s) var(--ease-spring);
    transition-delay: var(--reveal-delay, 0s);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { --reveal-delay: 0.08s; }
  .reveal-delay-2 { --reveal-delay: 0.18s; }
  .reveal-delay-3 { --reveal-delay: 0.28s; }
  .reveal-delay-4 { --reveal-delay: 0.38s; }
  .reveal-delay-5 { --reveal-delay: 0.48s; }
  .reveal-fast { --reveal-duration: 0.5s; }
  .reveal-slow { --reveal-duration: 1.0s; }

  /* ── Hero entrance animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-animate { animation: fadeUp 0.85s var(--ease-spring) forwards; opacity: 0; }
  .ha-1 { animation-delay: 0.10s; }
  .ha-2 { animation-delay: 0.22s; }
  .ha-3 { animation-delay: 0.38s; }
  .ha-4 { animation-delay: 0.52s; }
  .ha-5 { animation-delay: 0.65s; }
  .ha-6 { animation-delay: 0.80s; }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .reveal, .hero-animate, .skill-card, .project-card,
    .contact-link, .meta-card, .hero-role, .btn-primary::before {
      transition: none !important;
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    .scroll-line, .hero-badge-dot { animation: none !important; }
    .cursor-glow { display: none; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const GithubIcon = memo(() => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
));

const TelegramIcon = memo(() => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
));

const ArrowUpRightIcon = memo(() => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
));

const UpworkIcon = memo(() => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06a2.705 2.705 0 0 1 2.703 2.703 2.707 2.707 0 0 1-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H8.177v7.112a2.551 2.551 0 0 1-2.547 2.548 2.55 2.55 0 0 1-2.545-2.548V3.492H1v7.112c0 2.914 2.37 5.303 5.28 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.687 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
  </svg>
));

/** Одна stat-карточка с анимацией подсчёта */
const StatItem = memo(({ stat }) => {
  const [ref, count] = useCountUp(stat.target, 1200);
  // target === 0 + suffix "∞" → спецкейс без анимации
  const display = stat.suffix === "∞" ? "∞" : `${count ?? stat.target}${stat.suffix}`;
  return (
    <div ref={ref} role="listitem">
      <div className="stat-num">{display}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
});

// CONTACT_LINKS — GitHub, Telegram, Upwork
const CONTACT_LINKS = [
  {
    name:   "GitHub",
    handle: "@loveinterium228",
    icon:   <GithubIcon />,
    href:   CONFIG.links.github,
    bg:     "#161b22",
  },
  {
    name:   "Telegram",
    handle: "@imqm1137",
    icon:   <TelegramIcon />,
    href:   CONFIG.links.telegram,
    bg:     "#0088cc22",
  },
  {
    name:   "Upwork",
    handle: "Кирилл · Python & Web",
    icon:   <UpworkIcon />,
    href:   CONFIG.links.upwork,
    bg:     "#14a80022",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS — Particle background
// ─────────────────────────────────────────────────────────────────────────────
const CanvasBg = memo(() => {
  const canvasRef = useRef(null);
  // ✅ FIX: useReducedMotion объявлялся но не использовался — RAF крутился зря
  const reduced   = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // не запускаем анимацию при prefers-reduced-motion

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, W, H;

    // ✅ FIX: было mouse.x > 0 — ломалось при x === 0. Sentinel безопаснее.
    const mouse = { x: -9999, y: -9999 };

    const DOT_COUNT        = window.innerWidth < 768 ? 35 : 60;
    const CONNECTION_DIST  = 130;
    const CONNECTION_DIST2 = CONNECTION_DIST * CONNECTION_DIST;
    const MOUSE_RADIUS     = 100;
    const MOUSE_RADIUS2    = MOUSE_RADIUS * MOUSE_RADIUS;

    const dots = [];

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    let resizeTimer;
    const handleResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 100); };
    const handleMouse  = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleLeave  = () => { mouse.x = -9999; mouse.y = -9999; };

    resize();
    window.addEventListener("resize",     handleResize, { passive: true });
    window.addEventListener("mousemove",  handleMouse,  { passive: true });
    window.addEventListener("mouseleave", handleLeave);

    for (let i = 0; i < DOT_COUNT; i++) {
      dots.push({
        x:     Math.random() * window.innerWidth,
        y:     Math.random() * window.innerHeight,
        r:     Math.random() * 1.4 + 0.3,
        vx:    (Math.random() - 0.5) * 0.14,
        vy:    (Math.random() - 0.5) * 0.14,
        alpha: Math.random() * 0.35 + 0.08,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      const g1 = ctx.createRadialGradient(W * 0.2, H * 0.3, 0, W * 0.2, H * 0.3, 450);
      g1.addColorStop(0, "rgba(59,130,246,0.065)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

      const g2 = ctx.createRadialGradient(W * 0.82, H * 0.72, 0, W * 0.82, H * 0.72, 380);
      g2.addColorStop(0, "rgba(139,92,246,0.055)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

      // ✅ FIX: sentinel-check вместо > 0
      if (mouse.x !== -9999) {
        const gm = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS * 1.5);
        gm.addColorStop(0, "rgba(59,130,246,0.04)");
        gm.addColorStop(1, "transparent");
        ctx.fillStyle = gm; ctx.fillRect(0, 0, W, H);
      }

      for (let i = 0; i < dots.length; i++) {
        const d    = dots[i];
        const mdx  = mouse.x - d.x;
        const mdy  = mouse.y - d.y;
        const md2  = mdx * mdx + mdy * mdy;

        // ✅ FIX: mdist вычисляется один раз и переиспользуется ниже
        let mdist = Infinity;

        if (md2 < MOUSE_RADIUS2) {
          mdist = Math.sqrt(md2);
          const force = (1 - mdist / MOUSE_RADIUS) * 0.003;
          d.vx += mdx * force;
          d.vy += mdy * force;
          const spd = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
          if (spd > 0.6) { d.vx *= 0.6 / spd; d.vy *= 0.6 / spd; }
        }

        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;

        const near  = md2 < MOUSE_RADIUS2;
        const alpha = near
          ? d.alpha * (1 + (1 - mdist / MOUSE_RADIUS) * 1.5)
          : d.alpha;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,184,${Math.min(alpha, 0.7)})`;
        ctx.fill();
      }

      // Линии связи — пакетная отрисовка по alpha-бакетам
      const BUCKETS = 4;
      const buckets = Array.from({ length: BUCKETS }, () => []);

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= CONNECTION_DIST2) continue;
          const alpha = 0.065 * (1 - Math.sqrt(d2) / CONNECTION_DIST);
          const b     = Math.min(BUCKETS - 1, Math.floor(alpha / 0.065 * BUCKETS));
          buckets[b].push(dots[i].x, dots[i].y, dots[j].x, dots[j].y);
        }
      }

      ctx.lineWidth = 0.5;
      buckets.forEach((lines, b) => {
        if (!lines.length) return;
        const alpha = ((b + 0.5) / BUCKETS) * 0.065;
        ctx.strokeStyle = `rgba(148,163,184,${alpha.toFixed(4)})`;
        ctx.beginPath();
        for (let k = 0; k < lines.length; k += 4) {
          ctx.moveTo(lines[k], lines[k + 1]);
          ctx.lineTo(lines[k + 2], lines[k + 3]);
        }
        ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize",     handleResize);
      window.removeEventListener("mousemove",  handleMouse);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} id="canvas-bg" aria-hidden="true" />;
});

// ─────────────────────────────────────────────────────────────────────────────
// CURSOR GLOW
// ─────────────────────────────────────────────────────────────────────────────
const CursorGlow = memo(() => {
  // ✅ FIX: раньше JS-обработчик крутился даже при reduced motion
  const reduced = useReducedMotion();
  const ref     = useRef(null);

  useEffect(() => {
    if (reduced) return;
    const el  = ref.current;
    if (!el) return;
    const run = (e) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("mousemove", run, { passive: true });
    return () => window.removeEventListener("mousemove", run);
  }, [reduced]);

  if (reduced) return null;
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
});

// ─────────────────────────────────────────────────────────────────────────────
// REVEAL — Полиморфный враппер с анимацией появления
// ─────────────────────────────────────────────────────────────────────────────
const Reveal = memo(({ as: Tag = "div", children, delay = 0, className = "", style = {} }) => {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={[
        "reveal",
        inView  && "visible",
        delay   && `reveal-delay-${delay}`,
        className,
      ].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </Tag>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────
const ScrollProgress = memo(() => {
  const progress = useScrollProgress();
  return (
    <div
      className="scroll-progress"
      style={{ transform: `scaleX(${progress})` }}
      role="progressbar"
      aria-label="Прогресс прокрутки страницы"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
const Navbar = memo(() => {
  const active = useScrollSpy();
  const [open, setOpen] = useState(false);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Основная навигация">
        <a href="#" className="navbar-logo" aria-label="Главная">
          kirill<span>.</span>dev
        </a>

        <div className="nav-links" role="menubar">
          {NAV_ITEMS.map(({ label, id }) => (
            <button
              key={id}
              className={`nav-link${active === id ? " active" : ""}`}
              onClick={() => scrollTo(id)}
              role="menuitem"
              aria-current={active === id ? "page" : undefined}
            >
              {label}
            </button>
          ))}
          <a
            href={CONFIG.links.telegram}
            className="nav-cta"
            target="_blank"
            rel="noreferrer"
          >
            Написать
          </a>
        </div>

        <button
          className="hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span style={open ? { transform: "rotate(45deg) translate(4.5px, 4.5px)" } : {}} />
          <span style={open ? { opacity: 0, transform: "scaleX(0)" }                 : {}} />
          <span style={open ? { transform: "rotate(-45deg) translate(4.5px, -4.5px)" }: {}} />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`mobile-menu${open ? " open" : ""}`}
        aria-hidden={!open}
      >
        {NAV_ITEMS.map(({ label, id }) => (
          <button key={id} className="mobile-link" onClick={() => scrollTo(id)}>
            {label}
          </button>
        ))}
        {/* ✅ FIX: display:block + text-align:center для полноширинной кнопки */}
        <a
          href={CONFIG.links.telegram}
          className="mobile-cta"
          target="_blank"
          rel="noreferrer"
        >
          Написать
        </a>
      </div>
    </>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
const Hero = memo(() => {
  const glowRef       = useHeroGlow();
  const { role, idx } = useRoleCycle(CONFIG.roles);

  return (
    <section className="hero" aria-label="Приветствие">
      <div className="hero-grid" aria-hidden="true" />
      <div ref={glowRef} className="hero-glow" aria-hidden="true" />

      <div className="container">
        <div className="hero-badge hero-animate ha-1">
          <span className="hero-badge-dot" aria-hidden="true" />
          Открыт к сотрудничеству
        </div>

        <h1 className="hero-title hero-animate ha-2">
          {CONFIG.name}
          <span className="hero-title-italic" aria-label="разработчик">
            разработчик
          </span>
        </h1>

        <p className="hero-tagline hero-animate ha-3">
          &ldquo;{CONFIG.tagline}&rdquo;
        </p>

        <p className="hero-subtitle hero-animate ha-4">
          {/*
           * ✅ FIX: aria-live="polite" — скринридеры теперь
           *         объявляют каждую смену роли
           */}
          <span className="hero-role" key={idx} aria-live="polite" aria-atomic="true">
            {role}
          </span>
          {" \u00B7 "}{CONFIG.location}
        </p>

        <div className="hero-btns hero-animate ha-5">
          <a href="#projects" className="btn-primary">Мои проекты</a>
          <a
            href={CONFIG.links.telegram}
            className="btn-ghost"
            target="_blank"
            rel="noreferrer"
          >
            Написать мне
          </a>
        </div>

        <div className="hero-stats hero-animate ha-6" role="list">
          {HERO_STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      <div className="scroll-ind" aria-hidden="true">
        <div className="scroll-line" />
        скролл
      </div>
    </section>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────────────────────
const About = memo(() => (
  <section className="section" id="about" aria-label="Обо мне">
    <div className="container">
      <Reveal>
        <div className="section-label">Обо мне</div>
        <h2 className="section-title">
          Учусь в школе,<br />
          <em>пишу код дома.</em>
        </h2>
      </Reveal>

      <div className="about-grid">
        <Reveal delay={1} className="about-text">
          <p>Мне 14 лет, живу в Киеве, Украина. Учусь в 8 классе и параллельно занимаюсь разработкой — самостоятельно, без курсов. Начал с Python: скрипты, автоматизация, парсинг. Потом затянуло в веб — HTML, CSS, JavaScript, React.</p>
          <p>Уже работаю на фрилансе через <strong style={{color:"var(--text)"}}>Upwork</strong> — беру заказы на Python-автоматизацию и веб-скрейпинг, получаю реальный доход. Из 5 проектов 2 уже на GitHub, остальные скоро загружу.</p>
          <p>Открыт к интересным задачам, коллаборациям и любой обратной связи. Хочу расти и делать крутые вещи.</p>
        </Reveal>

        <Reveal delay={2} className="about-meta">
          {ABOUT_META.map(([label, value]) => (
            <div className="meta-card" key={label}>
              <div className="meta-label">{label}</div>
              <div className="meta-value">{value}</div>
            </div>
          ))}
          <div className="meta-card">
            <div className="meta-label">Открыт к</div>
            <div className="meta-value">
              Фриланс-заказам &middot;{" "}
              <a href={CONFIG.links.upwork} target="_blank" rel="noreferrer">Upwork</a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
));

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────────────────────
const SkillCard = memo(({ skill, delay }) => (
  <Reveal delay={delay}>
    <div
      className="skill-card"
      style={{ "--hover-color": skill.color }}
      role="region"
      aria-label={`Навыки: ${skill.category}`}
    >
      <div className="skill-card-top">
        <span className="skill-cat">{skill.category}</span>
        <span className="skill-dot" style={{ background: skill.color }} aria-hidden="true" />
      </div>
      {skill.items.map((item) => (
        <div className="skill-item" key={item}>
          <span className="skill-item-dot" style={{ background: skill.color }} aria-hidden="true" />
          {item}
        </div>
      ))}
    </div>
  </Reveal>
));

const Skills = memo(() => (
  <section className="section" id="skills" style={{ background: "var(--bg)" }} aria-label="Навыки">
    <div className="container">
      <Reveal>
        <div className="section-label">Мой стек</div>
        <h2 className="section-title">Навыки &amp; <em>инструменты</em></h2>
        <p className="section-desc">Технологии, которые я использую в своих проектах прямо сейчас.</p>
      </Reveal>

      <div className="skills-grid">
        {SKILLS.map((skill, i) => (
          <SkillCard key={skill.category} skill={skill} delay={Math.min(i + 1, 4)} />
        ))}
      </div>
    </div>
  </section>
));

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────
const ProjectCard = memo(({ project, delay }) => (
  <Reveal delay={delay}>
    <article className="project-card">
      <span className="project-index" aria-hidden="true">{project.index}</span>
      <div className="project-card-glow" style={{ background: project.color }} aria-hidden="true" />

      <div className="project-top">
        <span className="project-year">{project.year}</span>
        <span
          className="project-status"
          style={{
            background: `${project.statusColor}18`,
            color:       project.statusColor,
            border:      `1px solid ${project.statusColor}30`,
          }}
        >
          {project.status}
        </span>
      </div>

      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">{project.desc}</p>

      <div className="project-stack" role="list" aria-label="Стек технологий">
        {project.stack.map((s) => (
          <span className="stack-badge" key={s} role="listitem">{s}</span>
        ))}
      </div>

      <div className="project-links">
        <a
          href={project.github}
          className="proj-link"
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.title} — исходный код на GitHub`}
        >
          <GithubIcon /> GitHub
        </a>
        <a
          href={project.demo}
          className="proj-link"
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.title} — посмотреть`}
        >
          <ArrowUpRightIcon /> Открыть
        </a>
      </div>
    </article>
  </Reveal>
));

const Projects = memo(() => (
  <section className="section" id="projects" aria-label="Проекты">
    <div className="container">
      <Reveal>
        <div className="section-label">Мои работы</div>
        <h2 className="section-title">Проекты</h2>
        <p className="section-desc">Реальные проекты, которые я написал самостоятельно. Каждый научил меня чему-то новому.</p>
      </Reveal>

      <div className="projects-grid">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} delay={(i % 2) + 1} />
        ))}
      </div>
    </div>
  </section>
));

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────────────────────
const Contact = memo(() => (
  <section className="section" id="contact" style={{ background: "var(--bg)" }} aria-label="Контакт">
    <div className="container">
      <Reveal>
        <div className="section-label">Связаться</div>
        <h2 className="section-title">
          Пишите,<br />
          <em>всегда отвечаю.</em>
        </h2>
      </Reveal>

      <div className="contact-layout">
        <Reveal delay={1} className="contact-info">
          <p>Есть задача на автоматизацию, скрейпинг или веб? Нужен исполнитель через <strong style={{color:"var(--text)"}}>Upwork</strong>? Пиши — работаю быстро и по делу.</p>
          <p>Открыт к фриланс-заказам, pet-проектам и просто общению с разработчиками.</p>
        </Reveal>

        <Reveal delay={2} as="nav" className="contact-links" aria-label="Ссылки для связи">
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="contact-link"
              aria-label={`${link.name}: ${link.handle}`}
            >
              <div className="contact-link-icon" style={{ background: link.bg }} aria-hidden="true">
                {link.icon}
              </div>
              <div className="contact-link-text">
                <div className="contact-link-name">{link.name}</div>
                <div className="contact-link-handle">{link.handle}</div>
              </div>
              <span className="contact-link-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </Reveal>
      </div>
    </div>
  </section>
));

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
const Footer = memo(() => (
  <footer className="footer" role="contentinfo">
    <div className="container">
      <div className="footer-inner">
        <span className="footer-copy">
          &copy; {new Date().getFullYear()} {CONFIG.name} &middot; Сделано с душой
        </span>
        <nav className="footer-links" aria-label="Ссылки в футере">
          <a href={CONFIG.links.github}   className="footer-link" target="_blank" rel="noreferrer">GitHub</a>
          <a href={CONFIG.links.telegram} className="footer-link" target="_blank" rel="noreferrer">Telegram</a>
          <a href={CONFIG.links.upwork}   className="footer-link" target="_blank" rel="noreferrer">Upwork</a>
        </nav>
      </div>
    </div>
  </footer>
));

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  return (
    <>
      <style>{styles}</style>

      <a href="#main-content" className="skip-link">Перейти к содержимому</a>

      <ScrollProgress />
      <CursorGlow />

      <div className="noise">
        <CanvasBg />
        <Navbar />
        <main id="main-content">
          <Hero />
          <div className="divider" aria-hidden="true" />
          <About />
          <div className="divider" aria-hidden="true" />
          <Skills />
          <div className="divider" aria-hidden="true" />
          <Projects />
          <div className="divider" aria-hidden="true" />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}