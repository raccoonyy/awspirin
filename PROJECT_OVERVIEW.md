# AWS Policy Generator - Project Overview

A comprehensive AWS IAM Policy Generator available in both React application and Web Component formats.

## Project Structure

```
├── awspirin/                    # Main Next.js web application
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Main tool page
│   │   └── library/           # Library documentation page
│   ├── components/            # React components
│   └── lib/                   # Utilities and helpers
│
└── library/                     # Independent React component library
    ├── src/                    # Library source code
    ├── examples/               # Usage examples
    └── dist/                   # Built library files
```

## Components

### 1. React Application (`awspirin/`)
The original full-featured React application with:
- Complete UI with shadcn/ui components
- Internationalization support (Korean/English)
- Analytics integration
- Advanced ARN processing
- Responsive design

**Usage**: Visit the deployed application or run locally with `npm run dev`

### 2. React Component Library (`library/`)
Independent React component library for embedding in any React application:
- Standalone implementation with no external dependencies on shared code
- Full TypeScript support with comprehensive type definitions
- Customizable themes and styling
- ARN validation and processing
- Event-driven architecture
- Automatic dependency resolution for AWS actions

**Installation**: `npm install awspirin-lib`

## Key Features

### Both Implementations
- ✅ Visual AWS resource selection
- ✅ Hierarchical permission categories (read/write/admin)
- ✅ Automatic dependency resolution
- ✅ Real-time policy preview
- ✅ ARN input and validation
- ✅ Service-specific ARN processing
- ✅ Copy to clipboard functionality

### React App Additional Features
- ✅ Multi-language support (Korean/English)
- ✅ Analytics tracking
- ✅ Advanced UI components
- ✅ Responsive mobile design
- ✅ SEO optimization

### Library Additional Features
- ✅ Standalone package with zero shared dependencies
- ✅ Comprehensive TypeScript types
- ✅ Theme customization
- ✅ ARN list pre-population
- ✅ Event-driven API
- ✅ Tree-shakeable exports

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Install dependencies for React app
cd awspirin
npm install

# Install dependencies for Library
cd ../library
npm install
```

### Development Commands

#### React Application
```bash
cd awspirin
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

#### Library
```bash
cd library
npm run dev          # Start development server
npm run build        # Build library
npm run test         # Run tests
npm run lint         # Run ESLint
```

## Usage Examples

### React Application
```jsx
import AWSPolicyGenerator from './awspirin/app/page'

function App() {
  return <AWSPolicyGenerator />
}
```

### Library
```jsx
import { PolicyGenerator } from 'awspirin-lib'

// Basic usage
<PolicyGenerator />

// With configuration
<PolicyGenerator
  defaultResources={['s3', 'lambda']}
  onPolicyChange={(policy) => console.log(policy)}
  theme="light"
/>
```

### Programmatic Usage
```javascript
import { generateIAMPolicy, isValidArn } from 'awspirin-lib'

// Generate policy
const policy = generateIAMPolicy(resources, actions)

// Validate ARN
const isValid = isValidArn('arn:aws:s3:::my-bucket')
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes in the appropriate directory:
   - React app changes: `awspirin/`
   - Library changes: `library/`
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Follow the existing code style (ESLint configuration)
- Add tests for new features
- Update documentation for API changes
- Each project maintains its own independent implementation
- Follow consistent patterns between projects where applicable

## License

MIT License - see LICENSE file for details.

## Support

- 📖 [Documentation](https://github.com/awspirin/policy-generator/wiki)
- 🐛 [Issue Tracker](https://github.com/awspirin/policy-generator/issues)
- 💬 [Discussions](https://github.com/awspirin/policy-generator/discussions)

## Roadmap

- [ ] Additional AWS services support
- [ ] Policy validation and suggestions
- [ ] Import/export functionality
- [ ] Policy templates
- [ ] Advanced ARN pattern matching
- [ ] Multi-language support for web component
- [ ] Visual policy diff tool