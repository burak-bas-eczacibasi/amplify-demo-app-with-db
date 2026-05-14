# Implementation Plan: Amplify Project Tracker

## Overview

This plan implements a full-stack Project Tracker application using AWS Amplify Gen 2, React (Vite), TypeScript, Tailwind CSS, and Shadcn/UI. The implementation proceeds from backend infrastructure through frontend components, validation logic, and testing — each step building on the previous one.

## Tasks

- [x] 1. Set up project structure and Amplify backend
  - [x] 1.1 Initialize Vite + React + TypeScript project and install dependencies
    - Initialize the project with Vite React-TS template if not already done
    - Install dependencies: `@aws-amplify/backend`, `@aws-amplify/ui-react`, `aws-amplify`, `tailwindcss`, `postcss`, `autoprefixer`
    - Install Shadcn/UI dependencies and initialize with `npx shadcn-ui@latest init`
    - Configure `tailwind.config.ts` and `postcss.config.js`
    - Create `vite.config.ts` at project root
    - _Requirements: 10.1, 11.4, 11.6_

  - [x] 1.2 Define Amplify Auth resource
    - Create `amplify/auth/resource.ts` with `defineAuth()` using `loginWith: { email: true }`
    - Cognito handles email verification and minimum 8-character password enforcement
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 1.3 Define Amplify Data resource with Project model
    - Create `amplify/data/resource.ts` with `defineData()` and `a.schema()`
    - Define Project model with `title` (required string), `description` (optional string), `status` (enum: "Not Started", "In Progress", "Completed")
    - Apply `.authorization(allow => [allow.owner()])` for per-user data isolation
    - Set `defaultAuthorizationMode: 'userPool'`
    - Export `Schema` type using `ClientSchema<typeof schema>`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 1.4 Create Amplify backend entry point
    - Create `amplify/backend.ts` that imports auth and data resources and calls `defineBackend({ auth, data })`
    - _Requirements: 11.1, 11.2, 11.3, 11.5_

- [x] 2. Implement validation and utility functions
  - [x] 2.1 Create validation module
    - Create `src/lib/validation.ts` with `validateProjectForm()` function
    - Implement title validation: reject empty/whitespace-only strings and strings > 100 characters
    - Implement description validation: reject strings > 500 characters, accept undefined
    - Return `ValidationResult` with `valid` boolean and `errors` record
    - _Requirements: 5.2, 5.3, 5.5, 5.7_

  - [x] 2.2 Create utility functions module
    - Create `src/lib/utils.ts` with `truncateDescription()` function (truncate at 100 chars with ellipsis)
    - Add `sortProjectsByDate()` function that sorts projects by `createdAt` descending (most recent first)
    - Define shared TypeScript types/interfaces: `ProjectStatus`, `ProjectFormData`, `ValidationResult`, `Project`
    - _Requirements: 6.1, 6.2_

  - [x]* 2.3 Write property tests for validation (Properties 1 & 2)
    - Install `fast-check` as dev dependency
    - Create `src/lib/validation.property.test.ts`
    - **Property 1: Title validation correctness** — For any string input, validation accepts iff trimmed length is 1–100
    - **Property 2: Description validation correctness** — For any string input, validation accepts iff length is 0–500; undefined always accepted
    - **Validates: Requirements 5.2, 5.3, 5.5, 5.7**

  - [x]* 2.4 Write property tests for utilities (Properties 3 & 4)
    - Create `src/lib/utils.property.test.ts`
    - **Property 3: Project sort ordering** — For any list of projects with distinct createdAt, sort produces descending order
    - **Property 4: Description truncation** — Strings ≤100 chars returned unchanged; strings >100 chars truncated to 100 chars + ellipsis
    - **Validates: Requirements 6.1, 6.2**

  - [x]* 2.5 Write unit tests for validation and utilities
    - Create `src/lib/validation.test.ts` with edge case examples (empty string, exactly 100 chars, 101 chars, whitespace-only)
    - Create `src/lib/utils.test.ts` with edge case examples for truncation and sorting
    - _Requirements: 5.2, 5.3, 5.7, 6.1, 6.2_

- [x] 3. Checkpoint - Ensure backend and core logic are correct
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement authentication UI and app shell
  - [x] 4.1 Configure Amplify in the frontend
    - In `src/main.tsx`, import and call `Amplify.configure()` with the generated `amplify_outputs.json`
    - Set up the Amplify client with `generateClient<Schema>()`
    - _Requirements: 1.3, 1.4_

  - [x] 4.2 Create App component with Authenticator wrapper
    - Create `src/App.tsx` wrapping the app in `<Authenticator>` from `@aws-amplify/ui-react`
    - Import `@aws-amplify/ui-react/styles.css` for Authenticator styling
    - When authenticated, render the Header and Dashboard components
    - When not authenticated, only the Authenticator sign-in/sign-up UI is shown
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 4.3 Create Header component with sign-out
    - Create `src/components/Header.tsx` with app title and Shadcn/UI Button for "Sign Out"
    - Accept `onSignOut` and `user` props
    - Sign-out button calls the Authenticator's `signOut` function
    - _Requirements: 9.2, 9.3, 10.3_

- [x] 5. Implement Dashboard and project listing
  - [x] 5.1 Create Dashboard component
    - Create `src/components/Dashboard.tsx`
    - Fetch projects on mount using `client.models.Project.list()` and sort by `createdAt` descending
    - Manage state: `projects`, `loading`, `error`, `createModalOpen`, `editingProject`, `deletingProject`
    - Display loading indicator while fetching
    - Display empty state message when no projects exist
    - Display error message if fetch fails
    - Render project cards in a responsive grid (1 col < 640px, 2 cols 640–1023px, 3 cols ≥ 1024px)
    - Include "Create Project" button that opens the create modal
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 9.1, 9.4_

  - [x] 5.2 Create ProjectCard component
    - Create `src/components/ProjectCard.tsx` using Shadcn/UI Card
    - Display project title, truncated description (using `truncateDescription()`), and status
    - Include Edit and Delete action buttons (Shadcn/UI Button)
    - Accept `project`, `onEdit`, `onDelete` props
    - _Requirements: 6.2, 10.2, 10.3_

- [x] 6. Implement Create Project functionality
  - [x] 6.1 Add Shadcn/UI components (Dialog, Input, Select, Button)
    - Add required Shadcn/UI components using CLI: `npx shadcn-ui@latest add dialog input select button card`
    - _Requirements: 10.2, 10.3, 10.4, 10.5_

  - [x] 6.2 Create CreateProjectModal component
    - Create `src/components/CreateProjectModal.tsx` using Shadcn/UI Dialog
    - Include Input for title (1–100 chars), Input/Textarea for description (0–500 chars), Select for status (default "Not Started")
    - Run `validateProjectForm()` on submit; display inline errors if invalid
    - On valid submit, call `client.models.Project.create()` with trimmed values
    - On success, close modal and refresh project list
    - On API failure, display error message and keep modal open with data preserved
    - On cancel/dismiss, close modal without saving
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_

- [x] 7. Implement Update Project functionality
  - [x] 7.1 Create EditProjectForm component
    - Create `src/components/EditProjectForm.tsx` using Shadcn/UI Dialog
    - Pre-populate form with current project title, description, and status
    - Run `validateProjectForm()` on submit; display inline errors if invalid
    - On valid submit, call `client.models.Project.update()` with the project ID and updated fields
    - On success, close form and reflect changes in the Dashboard
    - On API failure, display error message and preserve entered data
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 8. Implement Delete Project functionality
  - [x] 8.1 Create DeleteConfirmDialog component
    - Create `src/components/DeleteConfirmDialog.tsx` using Shadcn/UI Dialog
    - Display confirmation message identifying the project by title
    - Provide Confirm and Cancel buttons
    - On confirm, call `client.models.Project.delete()` with the project ID
    - On success, remove project from Dashboard list
    - On API failure, display error message and retain project in list
    - On cancel, dismiss dialog and leave project unchanged
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 9. Checkpoint - Ensure full CRUD flow works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Responsive layout and final polish
  - [x] 10.1 Apply responsive styling and touch targets
    - Ensure the layout fits within viewport width (320px–1920px) without horizontal scrolling
    - Apply responsive grid classes to Dashboard: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
    - Ensure all interactive elements have minimum 44x44px touch targets on mobile (< 640px)
    - Verify Header elements (title + sign-out) remain visible at all viewport widths
    - _Requirements: 9.1, 9.2, 9.4, 9.5_

  - [x]* 10.2 Write component unit tests
    - Create `src/components/Dashboard.test.tsx` — test loading state, empty state, error state, project card rendering
    - Create `src/components/ProjectCard.test.tsx` — test title/description/status display, edit/delete button clicks
    - Create `src/components/CreateProjectModal.test.tsx` — test form validation, submit, cancel behavior
    - _Requirements: 5.7, 6.2, 6.3, 6.4, 6.5_

- [x] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The Amplify Authenticator component handles all auth UI (Requirement 1) — no custom auth forms needed
- Owner-based authorization (Requirement 4) is enforced at the AppSync level via `allow.owner()` — no frontend filtering logic required

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["1.4", "2.1", "2.2"] },
    { "id": 3, "tasks": ["2.3", "2.4", "2.5", "4.1"] },
    { "id": 4, "tasks": ["4.2", "4.3", "6.1"] },
    { "id": 5, "tasks": ["5.1", "5.2"] },
    { "id": 6, "tasks": ["6.2", "7.1", "8.1"] },
    { "id": 7, "tasks": ["10.1", "10.2"] }
  ]
}
```
