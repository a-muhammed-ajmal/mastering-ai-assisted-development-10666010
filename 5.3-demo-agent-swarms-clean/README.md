# Chapter 4.3: Agent Swarms — Parallel Component Development

## Starting Point

This is a clean starting point for the agent swarms demo. You have package configuration and task definitions, but no implementations yet.

## Your Task

Build a complete React component library by assigning work to three parallel agents:

- **Agent A** — Button, Input, Select components
- **Agent B** — Modal, Toast, Dropdown components
- **Agent C** — Tests for all components

## The Agent Swarms Pattern

All three agents work **in parallel** on their assignments:

### Agent A: Form Components
Implement:
- `src/components/Button.tsx` — Button with variants (primary, secondary, danger)
- `src/components/Input.tsx` — Text input with label, error state, disabled state
- `src/components/Select.tsx` — Dropdown select with options

Requirements:
- TypeScript with exported Props interfaces
- Functional components with named exports
- Inline styles (Tailwind classes) — no CSS files
- Props: label, placeholder, value, onChange, disabled, error, etc.

Command:
```
Implement three form components:
1. Button — with variant='primary'|'secondary'|'danger', disabled, onClick
2. Input — with label, type, value, onChange, error, disabled, required
3. Select — with options, value, onChange, error, disabled, required

All must pass tests. Each ~50-60 lines.
```

### Agent B: Layout Components
Implement:
- `src/components/Modal.tsx` — Dialog with overlay, title, footer
- `src/components/Toast.tsx` — Auto-dismiss notification (success, error, warning, info)
- `src/components/Dropdown.tsx` — Menu with trigger button and items

Requirements:
- TypeScript with exported Props interfaces
- Functional components with named exports
- Inline styles (Tailwind classes)
- Props: isOpen/visible, onClose, message, type, items, onSelect, etc.

Command:
```
Implement three layout components:
1. Modal — with isOpen, onClose, title, footer, closeOnOverlayClick
2. Toast — with message, type='success'|'error'|'warning'|'info', duration, auto-dismiss
3. Dropdown — with trigger, items, onSelect, openOnClick, closeOnClick

All must pass tests. Each ~60-70 lines.
```

### Agent C: Comprehensive Tests
Write tests in `tests/`:
- `Button.test.tsx` — Already exists (reference)
- `Input.test.tsx` — Input component tests
- `Select.test.tsx` — Select component tests
- `Modal.test.tsx` — Modal component tests
- `Toast.test.tsx` — Toast component tests (including auto-dismiss)
- `Dropdown.test.tsx` — Dropdown component tests (menu open/close, selection)

Requirements:
- Use @testing-library/react
- Cover: rendering, user interactions, state changes, error states, edge cases
- All tests must pass
- Aim for 80%+ code coverage

Command:
```
Write comprehensive tests for all components.
Cover:
- Happy path rendering
- User interactions (click, change, etc.)
- Error states and validation
- Edge cases
- Props variations

Run: npm test — all must pass
```

## The Shared Contract

All three agents share:
- `src/index.ts` — Barrel export (list all components)
- `src/components/` — Component directory
- `tests/` — Test directory
- `package.json` — Dependencies and scripts
- `tsconfig.json` — TypeScript configuration

## Success Criteria

After all agents finish:
- [ ] 6 components implemented (Button, Input, Select, Modal, Toast, Dropdown)
- [ ] Each component has exported Props interface
- [ ] Each component is a functional component with named export
- [ ] 50+ tests written (all passing)
- [ ] No lint or TypeScript errors
- [ ] All components exported from `src/index.ts`
- [ ] Agents worked in parallel and coordinated via shared files

## Quick Start

```bash
npm install
npm test  # Should show failures until components are implemented
npm run test:watch  # Watch mode for TDD
npm run build  # TypeScript compilation
```

## Component Structure Example

```typescript
// src/components/Button.tsx
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
  className = '',
}) => {
  // Implementation here (~50 lines)
};
```

## Key Patterns

1. **Parallel Development** — All three agents work simultaneously
2. **Shared Files** — Agents coordinate via package.json, tsconfig.json, shared index.ts
3. **Pull Model** — Each agent pulls requirements from TASKS.md
4. **Integration** — Tests automatically validate all components when imported
5. **No Blocking** — Agents are independent, can work in any order

## Tips for Agents

- Start with Button (simplest, no external state management)
- Input and Select follow similar patterns
- Modal/Toast/Dropdown use React hooks (useState, useEffect, useRef)
- Tests use @testing-library/react (fireEvent, render, screen)
- Use Tailwind classes for styling (no CSS files)
- Each component file should be ~50-70 lines (including JSDoc)
- Tests should be comprehensive but concise (~40-50 lines per component)
