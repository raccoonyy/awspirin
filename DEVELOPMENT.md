# Development Guide

## Project Overview

This project contains both a React application and a Web Component library for AWS IAM Policy generation, sharing common logic through a shared directory.

## Architecture

### Shared Logic (`shared/`)
- **Types**: Common TypeScript interfaces
- **Data**: AWS service and action definitions
- **Utils**: Policy generation and ARN processing logic

### React Application (`awspirin/`)
- Full-featured web application
- shadcn/ui components
- Internationalization (Korean/English)
- Analytics integration
- Next.js framework

### Web Component (`awspirin-webcomponent/`)
- Framework-agnostic Lit-based component
- Minimal dependencies
- CSS variable theming
- Event-driven API

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **React Application**
```bash
cd awspirin
npm install
```

2. **Web Component**
```bash
cd awspirin-webcomponent
npm install
```

### Development Commands

#### React Application
```bash
cd awspirin
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run export       # Export static files
```

#### Web Component
```bash
cd awspirin-webcomponent
npm run dev          # Start development server with examples
npm run build        # Build library for distribution
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run preview      # Preview built library
```

## Development Workflow

### Adding New AWS Services

1. **Update Shared Data**
   - Add service to `shared/data/aws-resources.ts`
   - Add actions to `shared/data/aws-actions.ts`
   - Update ARN processing in `shared/utils/policy-generator.ts` if needed

2. **Update React App**
   - Add translations in `awspirin/lib/i18n/`
   - Test in development mode

3. **Update Web Component**
   - Test with new service data
   - Update examples if needed

### Adding New Features

1. **Shared Logic First**
   - Add utilities to `shared/utils/`
   - Add types to `shared/types/`
   - Write tests for shared logic

2. **Implement in Both Versions**
   - React: Update components in `awspirin/components/`
   - Web Component: Update `awspirin-webcomponent/src/components/`

3. **Update Documentation**
   - Update README files
   - Add usage examples
   - Update API documentation

## Testing

### Unit Tests (Web Component)
```bash
cd awspirin-webcomponent
npm test
```

Tests are located in `awspirin-webcomponent/src/test/` and cover:
- Policy generation logic
- ARN validation and processing
- Component behavior

### Manual Testing

1. **React App Testing**
   - Run `npm run dev` in `awspirin/`
   - Test all features in browser
   - Check mobile responsiveness
   - Test internationalization

2. **Web Component Testing**
   - Run `npm run dev` in `awspirin-webcomponent/`
   - Open `src/dev.html` in browser
   - Test different configurations
   - Check event handling

## Code Style

### ESLint Configuration
Both projects use ESLint with TypeScript support:
- Airbnb style guide compliance
- TypeScript-specific rules
- Consistent formatting

### Naming Conventions
- **Files**: kebab-case (`aws-policy-generator.ts`)
- **Components**: PascalCase (`AWSPolicyGenerator`)
- **Variables**: camelCase (`selectedResources`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_AWS_RESOURCES`)

### Import Organization
```typescript
// External libraries
import { LitElement, html, css } from 'lit'

// Shared utilities
import { generateIAMPolicy } from '@shared/utils/policy-generator'

// Local components
import { ResourceSelector } from './resource-selector'
```

## Build Process

### React Application Build
- Next.js handles bundling and optimization
- Static export for GitHub Pages deployment
- Automatic code splitting and optimization

### Web Component Build
- Vite for fast development and building
- Rollup for library bundling
- TypeScript compilation with declaration files
- Terser for minification

## Deployment

### React Application
- Deployed to GitHub Pages via GitHub Actions
- Static export with proper routing
- SEO optimization included

### Web Component Library
- Published to npm as `@awspirin/policy-generator`
- ESM format for modern bundlers
- TypeScript declarations included
- Minimal external dependencies

## Debugging

### Common Issues

1. **Import Path Issues**
   - Check `tsconfig.json` path mappings
   - Ensure shared directory is properly referenced

2. **Build Failures**
   - Clear `node_modules` and reinstall
   - Check TypeScript errors
   - Verify all imports are correct

3. **Component Not Rendering**
   - Check web component registration
   - Verify CSS variables are set
   - Check browser console for errors

### Debug Tools

1. **React Developer Tools**
   - Install browser extension
   - Inspect component state and props

2. **Lit Developer Tools**
   - Use browser dev tools
   - Check custom element properties

3. **Network Tab**
   - Verify resource loading
   - Check for CORS issues

## Performance Considerations

### Bundle Size Optimization
- Tree-shaking for unused code
- Dynamic imports for large features
- Minimal external dependencies

### Runtime Performance
- Efficient state management
- Debounced input handling
- Virtual scrolling for large lists (if needed)

### Memory Management
- Proper event listener cleanup
- Avoid memory leaks in long-running apps

## Contributing Guidelines

1. **Code Quality**
   - Write tests for new features
   - Follow existing code style
   - Add TypeScript types for all new code

2. **Documentation**
   - Update README files
   - Add JSDoc comments for public APIs
   - Include usage examples

3. **Compatibility**
   - Maintain backward compatibility
   - Test in multiple browsers
   - Consider mobile devices

4. **Review Process**
   - Create feature branches
   - Submit pull requests
   - Address review feedback

## Troubleshooting

### Development Server Issues
```bash
# Clear cache and restart
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build Issues
```bash
# Clean build
npm run clean  # if available
npm run build
```

### Test Issues
```bash
# Update test snapshots
npm test -- --update-snapshots
```

For more specific issues, check the individual README files in each project directory.