# Kirill · Personal Portfolio

> **v5** — A personal developer portfolio built with React, no UI libraries, just pure code.

[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Canvas_API-1572b6?style=flat-square&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Live](https://img.shields.io/badge/status-live-10b981?style=flat-square)](https://github.com/loveinterium228/my-react-site)

---

## 🇬🇧 English

### About

This is my personal portfolio website — written entirely in a single `App.jsx` file without any third-party UI libraries. Every animation, layout, and interaction was built from scratch. The goal was not just to showcase my projects, but to make the site itself a demonstration of my frontend skills.

I'm Kirill, 14 years old, based in Kyiv, Ukraine. I started with Python, then got into web development, and now I work as a freelancer on Upwork doing automation, scraping, and web projects.

---

### ✨ Features

**Visual & UX**
- Interactive Canvas background with animated particles that react to cursor movement
- Cursor glow effect — zero React re-renders, pure direct DOM mutation via `useRef`
- Scroll progress bar at the top of the page (gradient: blue → purple → cyan)
- Noise texture overlay for depth and atmosphere
- Smooth scroll-linked hero glow that follows the mouse

**Animations**
- `Reveal` component using `IntersectionObserver` — elements animate in once when they enter the viewport
- Animated stat counters (`useCountUp`) with cubic ease-out, triggered on scroll
- Role cycling text in the hero (`useRoleCycle`) — rotates job titles every 3.5s
- Section label underline animation via CSS `::after` pseudo-element
- Spring, bounce, and ease-out custom CSS easing curves

**Navigation**
- Fixed navbar with `backdrop-filter: blur` glass effect
- Scroll spy (`useScrollSpy`) — active nav link updates automatically as you scroll
- Hamburger mobile menu with animated open/close transition
- Skip-to-content link for keyboard accessibility

**Performance & Accessibility**
- Full `prefers-reduced-motion` support — Canvas and CursorGlow are disabled for users who prefer less motion
- `rAF`-throttled scroll handlers — no jank, ~60fps scroll progress
- All interactive components wrapped in `React.memo` — minimal re-renders
- Semantic HTML: `<section>`, `<article>`, `<nav>`, `<footer>` with proper `aria-label` attributes
- `aria-live="polite"` on the cycling role text
- `role="list"` / `role="listitem"` on tech stack badges
- Fully keyboard-navigable with visible `:focus-visible` outlines
- `z-index` layering fixed to prevent canvas from overlapping content on some GPUs

**Design System**
- Dark-only theme (`color-scheme: dark`)
- CSS custom properties for all colors, shadows, spacing, and easing curves
- Three font families: `Instrument Serif` (display), `DM Mono` (code/nav), `DM Sans` (body)
- Fluid spacing with `clamp()` — adapts from mobile to wide desktop
- Custom 3px scrollbar
- Responsive grid layouts for both Skills and Projects sections

---

### 🗂 Sections

| Section | Description |
|---|---|
| **Hero** | Name, animated role, bio, stats (experience, projects, age, lines of code) |
| **About** | Short bio with metadata: status, location, freelance info, languages |
| **Skills** | 4 skill cards — Frontend, Backend/Python, Tools, Automation |
| **Projects** | 5 project cards with stack badges, status tags, year, GitHub links |
| **Contact** | GitHub + Telegram links, Upwork mention |
| **Footer** | Copyright, nav links |

---

### 🛠 Tech Stack

```
React 18         — UI framework (hooks only, no class components)
CSS3             — All styling in a single injected <style> block
Canvas API       — Particle background animation
IntersectionObserver API  — Scroll-triggered animations
requestAnimationFrame     — Smooth counter and scroll animations
Google Fonts     — Instrument Serif, DM Mono, DM Sans
```

No `react-router`, no `framer-motion`, no UI kit. Just React and the browser.

---

### 🏗 Architecture

The entire site lives in one file (`App.jsx`) structured as follows:

```
CONFIG / DATA         — All content: name, bio, roles, skills, projects, links
Custom Hooks          — useScrollSpy, useInView, useScrollProgress,
                        useReducedMotion, useHeroGlow, useRoleCycle, useCountUp
Styles                — ~1100 lines of CSS injected via <style>
UI Components         — ScrollProgress, CursorGlow, CanvasBg, Navbar,
                        Hero, About, Skills, Projects, Contact, Footer
App Root (Portfolio)  — Assembles everything
```

---

### 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/loveinterium228/my-react-site.git
cd my-react-site

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Requires Node.js 18+ and a React project setup (Vite recommended).

---

### 🐛 Bug Fixes in v5

This version resolves 9 bugs from previous iterations:

- `section-label::after` had no `width` — line animation wasn't working
- Canvas: `mouse.x > 0` broke at `x=0` — fixed with sentinel value `-9999`
- Canvas: redundant `Math.sqrt` — now caches `mdist`
- `useReducedMotion` was declared but never used — now applied to Canvas and CursorGlow
- Projects grid: `minmax(460px)` + `560px` left a gap between 461–559px — fixed
- Mobile "Contact me" button had no `display:block` + `text-align` — fixed
- `aria-live="polite"` was missing on the cycling role text
- Dividers were rendering behind the fixed canvas on some GPUs
- Hero glow transition was `1.2s` — visibly laggy — reduced to `0.55s`

---

### 📬 Contact

- **GitHub:** [github.com/loveinterium228](https://github.com/loveinterium228)
- **Telegram:** [t.me/imqm1137](https://t.me/imqm1137)
- **Upwork:** Available for freelance — Python, automation, web scraping, frontend

---

---

## 🇷🇺 Русский

### О проекте

Это моё личное портфолио — написано целиком в одном файле `App.jsx`, без сторонних UI-библиотек. Каждая анимация, каждый лейаут и каждое взаимодействие сделаны вручную. Цель была не только показать проекты, но и сделать сам сайт демонстрацией моих фронтенд-навыков.

Меня зовут Кирилл, мне 14 лет, живу в Киеве. Начал с Python, потом затянуло в веб-разработку — сейчас работаю на фрилансе через Upwork: автоматизация, скрейпинг, веб-проекты.

---

### ✨ Возможности

**Визуал и UX**
- Интерактивный Canvas-фон с анимированными частицами, реагирующими на курсор
- Свечение за курсором — ноль ре-рендеров React, прямая DOM-мутация через `useRef`
- Полоса прогресса прокрутки вверху страницы (градиент: синий → фиолетовый → голубой)
- Текстура шума для глубины и атмосферы
- Плавное hero-свечение, следующее за мышкой

**Анимации**
- Компонент `Reveal` на базе `IntersectionObserver` — элементы анимируются при входе в viewport
- Анимированные счётчики статистики (`useCountUp`) с кубическим ease-out, запускаются при скролле
- Смена ролей в hero (`useRoleCycle`) — каждые 3.5 секунды
- Анимация подчёркивания меток секций через CSS `::after`
- Кастомные кривые easing: spring, bounce, ease-out

**Навигация**
- Фиксированный navbar с эффектом стекла `backdrop-filter: blur`
- Scroll spy (`useScrollSpy`) — активная ссылка обновляется автоматически при скролле
- Мобильное меню-гамбургер с анимацией открытия/закрытия
- Ссылка «перейти к содержимому» для навигации с клавиатуры

**Производительность и доступность**
- Полная поддержка `prefers-reduced-motion` — Canvas и CursorGlow отключаются для пользователей с соответствующей настройкой
- Обработчики скролла через `rAF` — без рывков, ~60fps
- Все компоненты обёрнуты в `React.memo` — минимальное количество ре-рендеров
- Семантический HTML: `<section>`, `<article>`, `<nav>`, `<footer>` с `aria-label`
- `aria-live="polite"` на тексте смены ролей
- `role="list"` / `role="listitem"` на бейджах стека
- Полная навигация с клавиатуры с видимыми `:focus-visible` обводками
- Исправлен `z-index`, чтобы canvas не перекрывал контент на некоторых GPU

**Дизайн-система**
- Только тёмная тема (`color-scheme: dark`)
- CSS-переменные для цветов, теней, отступов и кривых анимации
- Три шрифтовые семьи: `Instrument Serif` (заголовки), `DM Mono` (код/навигация), `DM Sans` (текст)
- Гибкие отступы через `clamp()` — адаптируется от мобильного до широкого десктопа
- Кастомный скроллбар 3px
- Адаптивные сетки для секций «Навыки» и «Проекты»

---

### 🗂 Разделы сайта

| Раздел | Описание |
|---|---|
| **Hero** | Имя, анимированная роль, биография, статистика (опыт, проекты, возраст, строки кода) |
| **Обо мне** | Краткое описание с метаданными: статус, местоположение, фриланс, языки |
| **Навыки** | 4 карточки — Frontend, Backend/Python, Инструменты, Автоматизация |
| **Проекты** | 5 карточек проектов с бейджами стека, статусом, годом, ссылками на GitHub |
| **Контакт** | GitHub + Telegram, упоминание Upwork |
| **Footer** | Copyright, навигационные ссылки |

---

### 🛠 Технологии

```
React 18         — UI-фреймворк (только хуки, без классовых компонентов)
CSS3             — Всё в одном <style>-блоке
Canvas API       — Анимация частиц на фоне
IntersectionObserver API  — Анимации по скроллу
requestAnimationFrame     — Плавные счётчики и прогресс
Google Fonts     — Instrument Serif, DM Mono, DM Sans
```

Без `react-router`, без `framer-motion`, без UI-кита. Только React и браузер.

---

### 🏗 Архитектура

Весь сайт — один файл (`App.jsx`):

```
CONFIG / DATA         — Весь контент: имя, биография, роли, навыки, проекты, ссылки
Кастомные хуки        — useScrollSpy, useInView, useScrollProgress,
                        useReducedMotion, useHeroGlow, useRoleCycle, useCountUp
Стили                 — ~1100 строк CSS, инжектируются через <style>
UI-компоненты         — ScrollProgress, CursorGlow, CanvasBg, Navbar,
                        Hero, About, Skills, Projects, Contact, Footer
Корень приложения     — Portfolio — собирает всё вместе
```

---

### 📦 Запуск

```bash
# Клонировать репозиторий
git clone https://github.com/loveinterium228/my-react-site.git
cd my-react-site

# Установить зависимости
npm install

# Запустить сервер разработки
npm run dev

# Собрать для продакшна
npm run build
```

Требуется Node.js 18+ и React-проект (рекомендуется Vite).

---

### 🐛 Исправления в v5

В этой версии исправлено 9 багов:

- `section-label::after` не имел `width` — анимация линии не работала
- Canvas: `mouse.x > 0` ломался при `x=0` — исправлено значением-стражем `-9999`
- Canvas: лишний `Math.sqrt` — теперь кешируется `mdist`
- `useReducedMotion` объявлен, но не использовался — теперь применяется к Canvas и CursorGlow
- Projects grid: `minmax(460px)` + `560px` оставлял зазор между 461–559px — исправлено
- Мобильная кнопка «Написать мне» без `display:block` + `text-align` — исправлено
- Отсутствовал `aria-live="polite"` на сменяемом тексте роли
- Dividers уходили за фиксированный canvas на некоторых GPU
- Transition hero-свечения `1.2s` — заметный лаг — уменьшен до `0.55s`

---

### 📬 Контакт

- **GitHub:** [github.com/loveinterium228](https://github.com/loveinterium228)
- **Telegram:** [t.me/imqm1137](https://t.me/imqm1137)
- **Upwork:** Открыт к заказам — Python, автоматизация, скрейпинг, фронтенд

---

*© 2025 Кирилл · Сделано с душой*
