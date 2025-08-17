# Team Coding Guidelines

_(React + TypeScript + Vite Project)_

## 1. JavaScript & General Rules

- **Always use `const`** unless you need to reassign (then use `let`). Never use `var`.
- **Always use strict equality**: `===` / `!==` (not `==` / `!=`).
- **No unused variables** — if a variable is unused, remove it. If needed for structure, prefix with `_` (e.g. `_unused`).
- **No duplicate imports** in the same file.
- **Console logs** → Use only `console.warn` or `console.error` in production code. Remove `console.log`.
- **Arrow functions** → Use concise syntax if returning directly.

  ```ts
  // ✅ Good
  const getName = () => "John";

  // ❌ Avoid
  const getName = () => {
    return "John";
  };
  ```

- **Avoid unnecessary else** after `return`.

## 2. Import Rules

- Order imports:
  1. **Built-in Node modules** (e.g., `fs`, `path`)
  2. **External npm packages** (e.g., `react`, `axios`)
  3. **Internal aliases** (`@/utils`, `@/components`)
  4. **Relative imports** (`../file`, `./file`)
- Always leave **one blank line after imports**.
- **Sort alphabetically** within each group.

✅ Example:

```ts
import fs from "fs"; // Built-in
import React from "react"; // External
import { formatDate } from "@/utils/date"; // Internal alias
import "./styles.css"; // Local
```

## 3. TypeScript Rules

- **No `any`** unless absolutely unavoidable — prefer specific types.
- **Always type function return values** for public functions.
  ```ts
  // ✅ Good
  function add(a: number, b: number): number {
    return a + b;
  }
  ```
- **Use type-only imports** for types:
  ```ts
  import type { User } from "@/types";
  ```
- **No unhandled promises** — always `await` or `.catch()` them.
- Prefer `??` (nullish coalescing) over `||` when handling `null`/`undefined`.

## 4. React Rules

- **No need to import React** in JSX files (React 17+).
- **Follow Hooks rules**:
  - Only call Hooks at the top level, never inside loops or conditions.
  - Only call Hooks from React functions (components or custom hooks).
- **Check `useEffect` dependencies** — include all variables used inside the effect.
- **Use functional components** and avoid class components unless needed.
- **Components name will be capitalized** - starts with uppercase.

## 5. Accessibility (JSX-a11y)

- Always add `alt` text to images.
- Form inputs must have associated labels.
- Ensure interactive elements (`button`, `a`, etc.) are accessible.

## 6. Prettier Formatting

_(Applied automatically on save)_

- **2 spaces** for indentation.
- **100 characters** max per line.
- **Single quotes** for strings.
- **Always** add semicolons.
- **Trailing commas** in objects/arrays when possible.
- **Space inside braces** → `{ name: 'John' }`.

## 7. Workflow

- **Format before commit** — Prettier & ESLint run automatically.
- **Don’t ignore ESLint warnings** — fix them before pushing.
- **Commit small, focused changes** for easier review.
