# AWS Policy Generator - Project Overview

A comprehensive AWS IAM Policy Generator available in both React application and Web Component formats.

## Project Structure

```
├── awspirin/                    # Original React application
├── awspirin-webcomponent/       # Web Component library
├── shared/                      # Common logic and data
│   ├── data/                   # AWS resources and actions data
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Policy generation utilities
└── examples/                   # Usage examples
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

### 2. Web Component Library (`awspirin-webcomponent/`)
Framework-agnostic web component for embedding in any website:
- Lightweight Lit-based implementation
- Customizable via CSS variables
- ARN list support
- Event-driven architecture
- TypeScript support

**Installation**: `npm install @awspirin/policy-generator`

## Shared Components (`shared/`)

### Types (`shared/types/`)
Common TypeScript interfaces used across both implementations:
- `AWSResource`: AWS service definitions
- `AWSAction`: Permission action definitions  
- `PolicyStatement`: IAM policy statement structure
- `IAMPolicy`: Complete IAM policy structure

### Data (`shared/data/`)
AWS service and action definitions:
- `aws-resources.ts`: AWS service metadata
- `aws-actions.ts`: Permission action definitions with dependencies

### Utilities (`shared/utils/`)
Core policy generation logic:
- ARN validation and processing
- Policy statement generation
- Service-specific ARN handling (S3, DynamoDB, Lambda, etc.)

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

### Web Component Additional Features
- ✅ Framework agnostic
- ✅ Minimal bundle size
- ✅ CSS variable theming
- ✅ ARN list pre-population
- ✅ Event-driven API
- ✅ Read-only mode

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Install dependencies for React app
cd awspirin
npm install

# Install dependencies for Web Component
cd ../awspirin-webcomponent
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

#### Web Component
```bash
cd awspirin-webcomponent
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

### Web Component
```html
<!-- Basic usage -->
<aws-policy-generator></aws-policy-generator>

<!-- With ARN list -->
<aws-policy-generator 
  arn-list='["arn:aws:s3:::my-bucket", "arn:aws:lambda:us-east-1:123456789012:function:my-function"]'>
</aws-policy-generator>

<!-- Custom styling -->
<aws-policy-generator 
  style="--aws-primary-color: #0066cc; --aws-secondary-color: #ff6600;">
</aws-policy-generator>
```

### Programmatic Usage
```javascript
import { generateIAMPolicy, isValidArn } from '@awspirin/policy-generator'

// Generate policy
const policy = generateIAMPolicy(resources, actions, actionMap)

// Validate ARN
const isValid = isValidArn('arn:aws:s3:::my-bucket')
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes in the appropriate directory:
   - React app changes: `awspirin/`
   - Web component changes: `awspirin-webcomponent/`
   - Shared logic changes: `shared/`
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Follow the existing code style (ESLint configuration)
- Add tests for new features
- Update documentation for API changes
- Keep shared logic in the `shared/` directory
- Maintain compatibility between React and Web Component versions

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