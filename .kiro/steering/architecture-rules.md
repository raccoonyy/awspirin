---
inclusion: always
---

# Architecture Rules

## Core Principles
- **DRY (Don't Repeat Yourself)**: Avoid code duplication across components
- **SOLID Principles**: Follow single responsibility, open/closed, and dependency inversion principles
- **Component Reuse**: Prioritize reusing existing components over creating new ones
- **Avoid Over-engineering**: Keep solutions simple and focused on requirements

## Project Architecture
- **Frontend-only application**: No backend services or APIs
- **Client-side state management**: Use React hooks for local state
- **Component-based architecture**: Modular, reusable React components
- **TypeScript interfaces**: Strong typing for data models and props

## Development Guidelines
- Reference existing UI implementations in `ui-reference/` folder for design patterns
- Use shadcn/ui components as the primary UI library
- Implement responsive design with CSS Grid layout
- Follow controlled component patterns with React state
- Use Korean language for user interface text

## File Organization
- Components in `components/` directory with kebab-case naming
- TypeScript interfaces defined close to usage
- Relative imports using `@/` path alias
- Component files should export default and match filename

## Code Style
- Use descriptive variable and function names
- Implement proper error handling for user interactions
- Add TypeScript types for all props and state
- Keep components focused on single responsibilities
- Use React 18+ patterns and hooks

## AWS Policy Generator Specific Rules
- Generate IAM policies in real-time based on user selections
- Automatically handle action dependencies when building policies
- Provide visual feedback for policy validation
- Support hierarchical action selection (read/write/admin categories)
- Include comprehensive AWS service descriptions in Korean