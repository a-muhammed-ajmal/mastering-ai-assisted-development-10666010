# Fullstack App with Agent Teams

## Overview

This is the **capstone demo**: building a complete task management application with coordinated agents handling different layers of the stack.

**Architecture**:
- React frontend + Express backend + Supabase (PostgreSQL + Auth)
- Frontend Agent: React components, routing, state management
- Backend Agent: Express routes, middleware, database integration
- Testing Agent: E2E tests, API tests, component tests

**Coordination**: Agents use shared types as the contract between frontend and backend.

## The Task Management App

### Features
1. **Authentication** — Sign up, sign in, sign out (via Supabase Auth)
2. **Projects** — Create, read, update, delete projects
3. **Tasks** — Create, read, update, delete tasks within projects
4. **Kanban Board** — Drag tasks between status columns (todo/in-progress/done)
5. **Real-time Updates** — Supabase subscriptions for live updates

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Testing**: Jest, React Testing Library, Cypress (E2E)

## Agent Coordination Strategy

### Key: API-First Design

**Backend Agent defines the API first**, then Frontend Agent builds UI against it.

This prevents the "frontend waiting for backend" problem.

```
Phase 1: Backend Agent defines API spec (endpoints, types, errors)
   ↓
Phase 2: Frontend Agent starts building UI (using mock API)
   ↓
Phase 3: Frontend Agent wires up to real API
   ↓
Phase 4: Testing Agent writes E2E tests (exercises both layers)
```

### Shared Types as Contract

Both agents import from `src/shared/types.ts`:

```typescript
export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
```

Frontend knows exactly what the API returns. Backend knows exactly what to return.

## The Three Agent Roles

### Backend Agent
**Responsibility**: API endpoints, middleware, database layer

**Tasks**:
1. Define all TypeScript interfaces in `src/shared/types.ts`
2. Create Express routes in `src/routes/`
3. Implement Supabase integration in `src/db/`
4. Define error handling and custom errors
5. Write API tests

**Output**: Working Express API with Supabase integration

**Example endpoint**:
```typescript
// src/routes/tasks.ts
router.post('/projects/:id/tasks', async (req, res) => {
  const { title, description } = req.body;
  const { id: projectId } = req.params;

  try {
    const task = await createTask({ projectId, title, description });
    res.status(201).json({ data: task, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});
```

### Frontend Agent
**Responsibility**: React components, routing, state management

**Tasks**:
1. Import types from `src/shared/types.ts`
2. Create React components in `src/components/`
3. Build pages in `src/pages/`
4. Set up routing in `src/routes.tsx`
5. Use hooks for API calls (useFetch, useAsync)
6. Write component tests

**Output**: Working React UI connected to API

**Example component**:
```typescript
// src/pages/ProjectTasks.tsx
import { Task } from '../shared/types';

export const ProjectTasks: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/tasks`)
      .then(r => r.json())
      .then(data => setTasks(data.data))
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
```

### Testing Agent
**Responsibility**: E2E tests, integration tests, test infrastructure

**Tasks**:
1. Write API integration tests (using real Supabase, isolated DB)
2. Write React component tests
3. Write E2E tests with Cypress (real browser, full stack)
4. Create test utilities and fixtures
5. Set up CI/CD integration

**Output**: Comprehensive test suite covering all layers

**Example E2E test**:
```typescript
// e2e/project-workflow.cy.ts
describe('Project Workflow', () => {
  it('creates a project and adds a task', () => {
    cy.visit('/');
    cy.contains('Create Project').click();
    cy.get('input[placeholder="Project name"]').type('My Project');
    cy.contains('Create').click();
    cy.contains('My Project').should('be.visible');

    cy.contains('Add Task').click();
    cy.get('input[placeholder="Task title"]').type('Write tests');
    cy.contains('Save').click();

    cy.contains('Write tests').should('be.visible');
    cy.get('[data-testid="task-status"]').should('contain', 'todo');
  });
});
```

## Coordination Timeline

### Week 1, Day 1: Planning
- **Team Lead**: Create spec, define shared types, create TASKS.md
- **All Agents**: Review architecture and conventions

### Week 1, Days 2-3: Backend Development
- **Backend Agent**: Define API spec, implement routes, write API tests
- **Frontend Agent**: Start building UI components (mocked API)
- **Testing Agent**: Create test infrastructure, fixtures, test utilities

### Week 1, Days 4-5: Integration
- **Frontend Agent**: Wire real API calls, test against backend
- **Testing Agent**: Write E2E tests, resolve any issues
- **Backend Agent**: Fine-tune API, handle edge cases

### Week 1, Day 6: Final Polish
- **Team Lead**: Code review, merge, deploy to staging
- **All Agents**: Final testing, documentation

## Handling Blockers

**Scenario**: Frontend Agent needs to fetch tasks, but Backend Agent hasn't finished the endpoint.

**Solution**:
1. Backend Agent creates a mock response in `src/shared/types.ts`
2. Frontend Agent creates a mock fetch function
3. Frontend Agent builds UI against the mock
4. Backend Agent finishes the real endpoint
5. Frontend Agent switches from mock to real API

```typescript
// src/api/tasks.ts (Frontend uses this)
export const fetchTasks = async (projectId: string): Promise<Task[]> => {
  // If API is ready, use it
  // If not, use mock:
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return MOCK_TASKS;  // Imported from shared types
  }
  // Real API call
  const res = await fetch(`/api/projects/${projectId}/tasks`);
  return res.json();
};
```

## Files in This Demo

- `README.md` (this file)
- `specs/task-app.md` — Complete specification
- `src/shared/types.ts` — Shared type definitions (both agents use)
- `src/shared/mocks.ts` — Mock data for frontend development
- `src/api/` (backend) — API layer
- `src/pages/` (frontend) — React pages
- `src/components/` (frontend) — React components
- `tests/` — Test suites for all layers
- `e2e/` — End-to-end Cypress tests
- `package.json` — Shared dependencies

## Getting Started

1. Review `specs/task-app.md` for full specification
2. Review `src/shared/types.ts` to understand the data contract
3. Imagine three agents working on this:
   - Backend Agent implements Express API
   - Frontend Agent builds React UI
   - Testing Agent writes comprehensive tests
4. Study the sample code in each layer
5. Give Claude the team prompt to see agents coordinate

## Key Lessons

1. **API-First Design**: Define types and API spec before implementation
2. **Shared Contract**: Both frontend and backend use the same types
3. **Mock-Driven Frontend**: Frontend can build UI before API is ready
4. **Clear Boundaries**: Each agent owns one layer; minimal overlap
5. **Frequent Integration**: Test integration continuously, not at the end

## Key Takeaway

Fullstack agent teams work best when boundaries are clear (frontend/backend/testing), communication is via shared types and contracts, and each agent can work semi-independently with a clear integration plan.
