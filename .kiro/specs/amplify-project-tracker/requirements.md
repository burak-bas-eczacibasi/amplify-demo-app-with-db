# Requirements Document

## Introduction

This document defines the requirements for a full-stack Project Tracker demo application built with AWS Amplify Gen 2, React (Vite), TypeScript, and Tailwind CSS. The application allows authenticated users to manage their own projects through a clean dashboard interface with per-user data isolation.

## Glossary

- **Application**: The full-stack Project Tracker web application built with React, Vite, and AWS Amplify Gen 2
- **Authenticator**: The AWS Amplify Authenticator UI component that provides sign-up and sign-in flows via AWS Cognito
- **User**: An authenticated individual who has signed up and logged in to the Application
- **Project**: A data record containing a title, description, status, and owner reference, stored in DynamoDB via AppSync
- **Dashboard**: The main view of the Application displaying the User's list of Projects and controls for managing them
- **Project_Status**: A categorical value representing the current state of a Project (e.g., "Not Started", "In Progress", "Completed")
- **Create_Project_Modal**: A dialog overlay that allows the User to input details for a new Project
- **Data_Layer**: The Amplify Data (AppSync/DynamoDB) backend that stores and retrieves Project records
- **Auth_Layer**: The Amplify Auth (Cognito) backend that handles user authentication and identity
- **Backend_Definition**: TypeScript resource files located in the `/amplify` folder that define the cloud infrastructure

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to sign up and log in to the application, so that I can securely access my projects.

#### Acceptance Criteria

1. THE Authenticator SHALL provide a sign-up flow that collects email and a password of at least 8 characters from the User
2. THE Authenticator SHALL provide a sign-in flow that authenticates the User with email and password
3. WHEN the User successfully authenticates, THE Application SHALL display the Dashboard
4. WHILE the User is not authenticated, THE Application SHALL display only the Authenticator sign-in/sign-up interface
5. IF authentication fails, THEN THE Authenticator SHALL display an error message indicating the reason for failure (e.g., incorrect credentials, user not found, or unverified account)
6. WHEN the User completes sign-up, THE Authenticator SHALL require email verification before allowing sign-in
7. IF the User attempts to sign up with an email that is already registered, THEN THE Authenticator SHALL display an error message indicating the email is already in use

### Requirement 2: Authentication Backend Configuration

**User Story:** As a developer, I want the authentication backend defined in TypeScript, so that the infrastructure is type-safe and follows Amplify Gen 2 conventions.

#### Acceptance Criteria

1. THE Auth_Layer SHALL be defined in `amplify/auth/resource.ts` using TypeScript and export a valid auth resource created with `defineAuth()` from `@aws-amplify/backend`
2. THE Auth_Layer SHALL configure AWS Cognito as the authentication provider with email as the sole login identifier
3. THE Auth_Layer SHALL enforce a minimum password length of 8 characters
4. THE Auth_Layer SHALL require email verification during the sign-up flow before granting authenticated access

### Requirement 3: Project Data Schema

**User Story:** As a developer, I want a well-defined data schema for projects, so that the application has a consistent and type-safe data model.

#### Acceptance Criteria

1. THE Data_Layer SHALL be defined in `amplify/data/resource.ts` using TypeScript
2. THE Data_Layer SHALL define a Project model with a required `title` field of type string with a maximum length of 200 characters
3. THE Data_Layer SHALL define a Project model with an optional `description` field of type string with a maximum length of 2000 characters
4. THE Data_Layer SHALL define a Project model with a `status` field that accepts exactly the values "Not Started", "In Progress", and "Completed", defaulting to "Not Started" when not specified
5. THE Data_Layer SHALL define a Project model with an `owner` field that references the authenticated User's identity

### Requirement 4: Per-User Data Isolation

**User Story:** As a user, I want my projects to be private to me, so that other users cannot access or modify my data.

#### Acceptance Criteria

1. THE Data_Layer SHALL enforce owner-based authorization rules at the API level such that create operations on Project records are restricted to the authenticated owner only
2. THE Data_Layer SHALL enforce owner-based authorization rules at the API level such that read operations on Project records are restricted to the authenticated owner only
3. THE Data_Layer SHALL enforce owner-based authorization rules at the API level such that update operations on Project records are restricted to the authenticated owner only
4. THE Data_Layer SHALL enforce owner-based authorization rules at the API level such that delete operations on Project records are restricted to the authenticated owner only
5. WHEN a User queries for Projects, THE Data_Layer SHALL return only Projects where the owner field matches the authenticated User's identity
6. IF a User attempts to read, update, or delete a Project they do not own, THEN THE Data_Layer SHALL deny the operation and return an authorization error to the caller
7. IF a request is made to the Data_Layer without a valid authentication token, THEN THE Data_Layer SHALL reject the request and return an authentication error to the caller

### Requirement 5: Create Project

**User Story:** As a user, I want to create new projects, so that I can track my work.

#### Acceptance Criteria

1. WHEN the User activates the "Create Project" action, THE Application SHALL display the Create_Project_Modal
2. THE Create_Project_Modal SHALL provide an input field for the Project title that accepts between 1 and 100 characters
3. THE Create_Project_Modal SHALL provide an optional input field for the Project description that accepts up to 500 characters
4. THE Create_Project_Modal SHALL provide a dropdown selector for the Project_Status with values "Not Started", "In Progress", and "Completed", defaulting to "Not Started"
5. WHEN the User submits the Create_Project_Modal with a title between 1 and 100 characters, THE Application SHALL save the Project to the Data_Layer with the User's identity as owner and the selected Project_Status
6. WHEN the Project is saved successfully, THE Application SHALL close the Create_Project_Modal and display the new Project in the Dashboard list
7. IF the User submits the form with an empty title or a title exceeding 100 characters, THEN THE Application SHALL display a validation error indicating the title constraint and prevent submission
8. IF the save to the Data_Layer fails, THEN THE Application SHALL display an error message indicating the failure and keep the Create_Project_Modal open with the entered data preserved
9. WHEN the User activates the cancel or dismiss action on the Create_Project_Modal, THE Application SHALL close the modal without saving any data

### Requirement 6: List Projects

**User Story:** As a user, I want to see all my projects in a list, so that I can get an overview of my work.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Application SHALL fetch and display all Projects belonging to the authenticated User, ordered by most recently created first
2. THE Dashboard SHALL display each Project as a Card component showing the title, description (truncated to 100 characters with an ellipsis if longer), and status
3. WHILE no Projects exist for the User, THE Dashboard SHALL display an empty state message indicating no projects have been created
4. WHILE the Application is fetching Projects from the Data_Layer, THE Dashboard SHALL display a loading indicator
5. IF the Application fails to fetch Projects from the Data_Layer, THEN THE Dashboard SHALL display an error message indicating that projects could not be loaded

### Requirement 7: Update Project

**User Story:** As a user, I want to update my existing projects, so that I can keep project information current.

#### Acceptance Criteria

1. WHEN the User activates the edit action on a Project, THE Application SHALL display the Project details in an editable form pre-populated with the Project's current title, description, and status values
2. THE Application SHALL allow the User to modify the title, description, and status of the Project
3. IF the User submits the update form with an empty title, THEN THE Application SHALL display a validation error and prevent submission
4. WHEN the User submits valid updated Project details, THE Application SHALL save the changes to the Data_Layer
5. WHEN the update is saved successfully, THE Application SHALL reflect the updated title, description, and status in the corresponding Project Card on the Dashboard list
6. IF the save to the Data_Layer fails, THEN THE Application SHALL display an error message indicating the update was not saved and preserve the User's entered data in the form

### Requirement 8: Delete Project

**User Story:** As a user, I want to delete projects I no longer need, so that I can keep my dashboard organized.

#### Acceptance Criteria

1. WHEN the User activates the delete action on a Project, THE Application SHALL display a confirmation dialog that identifies the Project by title and provides confirm and cancel options
2. WHEN the User confirms deletion, THE Application SHALL remove the Project from the Data_Layer
3. WHEN the deletion is successful, THE Application SHALL remove the Project from the Dashboard list
4. IF the User cancels the deletion confirmation, THEN THE Application SHALL dismiss the confirmation dialog and leave the Project unchanged
5. IF the deletion from the Data_Layer fails, THEN THE Application SHALL display an error message indicating the Project was not deleted and retain the Project in the Dashboard list

### Requirement 9: Responsive Layout

**User Story:** As a user, I want the application to work well on different screen sizes, so that I can use it on desktop and mobile devices.

#### Acceptance Criteria

1. THE Application SHALL render a responsive layout that fits within the viewport width without horizontal scrolling for viewport widths from 320px to 1920px
2. THE Application SHALL display a header containing the application title and a "Sign Out" button, with both elements remaining visible and accessible at all supported viewport widths
3. WHEN the User activates the "Sign Out" button, THE Application SHALL sign the User out and display the Authenticator interface
4. THE Dashboard SHALL arrange Project Cards in a grid layout with 1 column on viewports below 640px, 2 columns on viewports from 640px to 1023px, and 3 columns on viewports 1024px and above
5. WHILE the viewport width is less than 640px, THE Application SHALL display all interactive elements with a minimum touch-target size of 44x44 pixels

### Requirement 10: UI Component Library

**User Story:** As a developer, I want to use a consistent component library, so that the UI is cohesive and maintainable.

#### Acceptance Criteria

1. THE Application SHALL use Tailwind CSS utility classes as the sole styling mechanism for layout, spacing, typography, and color
2. THE Application SHALL use Shadcn/UI Card components to display each Project's title, description, and status on the Dashboard
3. THE Application SHALL use Shadcn/UI Button components for the "Create Project", "Edit", "Delete", "Sign Out", and form submission actions
4. THE Application SHALL use Shadcn/UI Input components for the Project title and description text entry fields in the Create and Edit forms
5. THE Application SHALL use Shadcn/UI Select components for the Project_Status dropdown selector in the Create and Edit forms

### Requirement 11: Project File Structure

**User Story:** As a developer, I want the project to follow Amplify Gen 2 conventions, so that the codebase is maintainable and deployable.

#### Acceptance Criteria

1. THE Backend_Definition SHALL place authentication resources in `amplify/auth/resource.ts`
2. THE Backend_Definition SHALL place data model resources in `amplify/data/resource.ts`
3. THE Backend_Definition SHALL provide an entry point file at `amplify/backend.ts` that imports and composes all resource definitions (auth and data)
4. THE Application SHALL use TypeScript (`.ts` and `.tsx` extensions) for all frontend component and logic files within the `src/` directory
5. THE Backend_Definition SHALL use TypeScript (`.ts` extension) for all backend resource definitions within the `amplify/` directory
6. THE Application SHALL use Vite as the build tool and development server with a `vite.config.ts` configuration file at the project root
