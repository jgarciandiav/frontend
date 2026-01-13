# AGENTS.md

This file provides guidance for agentic coding assistants working on this React frontend project.

## Build & Test Commands

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # TypeScript compilation + Vite production build
npm run preview      # Preview production build locally
npm test             # Run all Vitest tests
npm test -- <pattern> # Run specific test file matching pattern
```

## Project Stack

- **Framework:** React 18.3.1 + TypeScript 5.2.2
- **Build Tool:** Vite 7.2.2
- **Routing:** React Router DOM 6.20.0
- **State/Queries:** TanStack Query 5.32.0
- **Forms:** React Hook Form 7.51.0 + Zod 3.22.4
- **API:** Axios 1.6.0 with `withCredentials: true`
- **UI:** Bootstrap 5.3.8
- **Testing:** Vitest 4.0.16 + Testing Library
- **Notifications:** React Hot Toast 2.4.1
- **PDF Generation:** jsPDF + html2canvas

## Code Style Guidelines

### Imports
Order imports from external to internal:
```ts
import React from "react"
import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { api } from "../api"
import { notify } from "../utils/notify"
```

### Naming Conventions
- **Components:** PascalCase - `DataTable.tsx`, `Spinner.tsx`
- **Hooks:** camelCase with "use" prefix - `useDataTable.ts`, `useCrudQuery.ts`
- **Utilities/Services:** camelCase - `notify.ts`, `api.ts`
- **Types:** PascalCase - `Column<T>`, interfaces in `src/types/`
- **Schemas:** camelCase - `facturaSchema`

### Component Structure
Functional components with TypeScript props:
```tsx
type Props<T> = { data: T[]; columns: Column<T>[] }

export default function Component<T>({ data, columns }: Props<T>) {
  const [state, setState] = useState<T>()
  // Logic here
  return <div>{/* JSX */}</div>
}
```

### Forms (React Hook Form + Zod)
Define schemas in `src/schemas/`, use custom hooks:
```ts
type FacturaInput = z.infer<typeof facturaSchema>

export function useFacturaForm(defaultValues?: Partial<FacturaInput>) {
  const nav = useNavigate()
  const { register, handleSubmit, formState, setValue, watch } = useForm<FacturaInput>({
    resolver: zodResolver(facturaSchema),
    defaultValues: { fecha: new Date().toISOString().slice(0, 10), ...defaultValues },
  })

  const onSubmit = async (data: FacturaInput) => {
    await notify.promise(api.post("/facturas", data), {
      loading: "Guardando...", success: "Factura creada", error: "Error"
    })
    nav("/dashboard")
  }

  return { register, handleSubmit: handleSubmit(onSubmit), formState, setValue, watch }
}
```

### Data Fetching (TanStack Query)
Use custom hooks or the `useCrudQuery` utility:
```ts
import { useCrudQuery } from "../hooks/useCrudQuery"

const { data, isLoading, create, remove } = useCrudQuery<Factura>("/facturas", "facturas")
```

Query keys should be descriptive strings matching the endpoint resource.

### Validation (Zod)
Define schemas in `src/schemas/`:
```ts
export const itemSchema = z.object({
  service: z.string().min(1, "Escriba un servicio"),
  importe: z.number().positive("Importe > 0"),
})
```

### Error Handling
- API calls through `api.ts` (axios with `withCredentials`)
- User notifications via `notify` utility: `notify.success()`, `notify.error()`, `notify.promise()`
- Simple try/catch in utilities: `try { ... } catch { return false }`
- Query errors handled automatically by TanStack Query

### React Router
Route definitions in `src/AppRoutes.tsx` with lazy loading:
```ts
const Dashboard = lazy(() => import("../pages/Dashboard"))
<Suspense fallback={<Spinner />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Suspense>
```

### Icons
Use React Icons (`react-icons/fi` for Feather icons):
```ts
import { FiMenu, FiLogOut, FiSearch } from "react-icons/fi"
<FiMenu size={24} />
```

### PDF Generation
Use jsPDF for PDF generation:
```ts
import jsPDF from "jspdf"
const pdf = new jsPDF("p", "mm", "a4")
pdf.text("Hello", 20, 20)
pdf.save("document.pdf")
```

### File Organization
```
src/
├── components/      # Reusable UI components
├── pages/          # Route/page components
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
├── schemas/        # Zod validation schemas
├── utils/          # Helper functions
├── api.ts          # Axios instance configuration
├── auth.ts         # Authentication utilities
├── AppRoutes.tsx   # Route definitions
└── main.tsx        # Application entry point
```

### TypeScript Rules
- Always type component props and hooks
- Use generic types for reusable components: `<T extends object>`
- Non-null assertions only when safe (e.g., DOM elements guaranteed to exist)
- Return types on functions for clarity
- Infer types from Zod schemas: `type Input = z.infer<typeof schema>`

### State Management
- Local component state: `useState`, `useReducer`
- Server state: TanStack Query with custom hooks
- Form state: React Hook Form + Zod resolvers
- URL state: React Router params

### Bootstrap Integration
Import Bootstrap CSS in `main.tsx`. Use Bootstrap classes for layout and styling.
```tsx
<div className="card shadow-sm">
  <div className="card-body">
    <button className="btn btn-primary">Action</button>
  </div>
</div>
```

### Authentication
Routes protected via `auth.ts`. API uses `withCredentials: true` for cookie-based auth.
```ts
export async function logout() {
  await api.post("/users/logout")
  window.location.href = "/login"
}
```

### Code Formatting
- Use 2 spaces for indentation
- Prefer single quotes for strings
- Use semicolons
- Keep lines under 100 characters when practical
- Use meaningful variable names in Spanish/English as appropriate for the domain
