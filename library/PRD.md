# AWS IAM Policy Generator Component Library - Product Requirements Document

## 1. Executive Summary

### Product Vision
Create a reusable JavaScript/TypeScript component library that enables developers to embed AWS IAM policy generation capabilities into their applications with minimal effort.

### Target Users
- **Primary**: JavaScript/React developers building AWS management tools
- **Secondary**: DevOps tool creators, AWS consultants, and cloud platform builders

### Core Value Proposition
Transform the AWSpirin policy generator into a modular, embeddable component library that provides:
- Drop-in React components for AWS policy generation
- Headless API for custom UI implementations
- Zero-configuration setup with sensible defaults
- Full customization capabilities

## 2. Product Overview

### 2.1 Library Name
`@awspirin/awspirin-lib` - AWS IAM Policy Generator Components

### 2.2 Key Features
1. **Complete Policy Generator Widget** - Single component with full UI
2. **Modular Components** - Individual components for custom layouts
3. **Headless Core** - Logic-only module for custom UIs
4. **Theme Support** - Light/dark modes with customizable styling
5. **Internationalization** - Built-in multi-language support
6. **TypeScript First** - Full type safety and IntelliSense

## 3. Technical Architecture

### 3.1 Package Structure
```
@awspirin/awspirin-lib
├── core/                 # Headless logic layer
├── components/          # React UI components
├── hooks/              # React hooks for policy logic
├── types/              # TypeScript definitions
├── utils/              # Helper functions
├── data/               # Service and dependency data
│   ├── services/       # Service definitions
│   └── dependencies/   # YAML dependency definitions
├── locales/            # i18n resources
└── themes/             # Default themes
```

### 3.2 Component Hierarchy
```
<PolicyGenerator>                    # Complete widget
  ├── <ResourceSelector />           # Service selection
  ├── <ActionSelector />             # Permission selection
  │   ├── <ARNInput />              # ARN specification
  │   └── <ActionList />            # Action checkboxes
  └── <PolicyPreview />              # JSON output
      └── <CopyButton />             # Clipboard integration
```

### 3.3 Core Modules
```typescript
// Headless core API
class PolicyCore {
  addResource(resource: AWSResource): void
  removeResource(resourceId: string): void
  setActions(resourceId: string, actions: string[]): void
  setARN(resourceId: string, arn: string): void
  setARNList(arns: ARNItem[]): void
  getFilteredARNs(service: string, resourceType?: string): ARNItem[]
  generatePolicy(): IAMPolicy
  resolveDependencies(actions: string[]): string[]
  validateARN(service: string, arn: string): ValidationResult
}
```

## 4. Component Specifications

### 4.1 Complete Widget Component
```typescript
interface PolicyGeneratorProps {
  // Configuration
  services?: AWSService[]           // Services to display
  defaultSelections?: Selection[]   // Pre-selected items
  arnList?: ARNItem[]               // Optional: List of available ARNs for dropdown selection
  
  // Appearance
  theme?: 'light' | 'dark' | Theme  // Visual theme
  layout?: 'horizontal' | 'vertical' | 'responsive' // Layout mode (default: 'responsive')
  // 'responsive': Auto-switches between horizontal (wide) and vertical (narrow)
  breakpoint?: number  // Custom breakpoint for responsive layout (default: 768px)
  locale?: 'en' | 'ko' | 'ja' | 'zh' // Language
  
  // Behavior
  onChange?: (policy: IAMPolicy) => void
  onCopy?: (policy: string) => void
  onARNSelect?: (resourceId: string, arn: string) => void // ARN selection callback
  maxStatements?: number
  allowWildcards?: boolean
  arnInputMode?: 'input' | 'dropdown' | 'both' | 'auto' // Default ARN input mode (default: 'auto')
  // 'auto': Automatically determines mode based on arnList presence
  
  // Customization
  className?: string
  styles?: StyleOverrides
  components?: ComponentOverrides
}
```

### 4.2 Modular Components

#### ResourceSelector
```typescript
interface ResourceSelectorProps {
  resources: AWSResource[]
  selected: string[]
  onSelect: (resourceId: string) => void
  onDeselect: (resourceId: string) => void
  searchable?: boolean
  groupBy?: 'category' | 'alphabet' | 'none'
}
```

#### ActionSelector
```typescript
interface ActionSelectorProps {
  resource: AWSResource
  selectedActions: string[]
  arn?: string
  arnList?: ARNItem[]  // Optional: List of available ARNs for dropdown
  onActionToggle: (action: string) => void
  onARNChange: (arn: string) => void
  onARNSelect?: (arn: string) => void  // Callback for dropdown selection
  arnInputMode?: 'input' | 'dropdown' | 'both' | 'auto'  // Control ARN input mode (default: 'auto')
  // 'auto': Shows dropdown if arnList provided, otherwise shows input
  // 'input': Always shows text input
  // 'dropdown': Always shows dropdown (requires arnList)
  // 'both': Shows both input and dropdown options
  showDependencies?: boolean
  categories?: ActionCategory[]
}
```

#### PolicyPreview
```typescript
interface PolicyPreviewProps {
  policy: IAMPolicy
  format?: 'json' | 'yaml' | 'terraform'
  syntaxHighlight?: boolean
  copyable?: boolean
  downloadable?: boolean
  validator?: PolicyValidator
}
```

## 5. Hook Specifications

### 5.1 Core Hooks
```typescript
// Main policy generation hook
function usePolicyGenerator(config?: PolicyConfig): {
  resources: AWSResource[]
  selectedResources: string[]
  actions: Map<string, string[]>
  arns: Map<string, string>
  policy: IAMPolicy
  
  selectResource: (id: string) => void
  deselectResource: (id: string) => void
  setActions: (resourceId: string, actions: string[]) => void
  setARN: (resourceId: string, arn: string) => void
  reset: () => void
}

// Individual feature hooks
function useResourceSelector(): ResourceSelectorAPI
function useActionSelector(resourceId: string): ActionSelectorAPI
function usePolicyPreview(policy: IAMPolicy): PolicyPreviewAPI
function useARNValidator(service: string): ARNValidatorAPI
function useARNList(service?: string): {
  arns: ARNItem[]
  filteredArns: ARNItem[]
  filterByService: (service: string) => ARNItem[]
  filterByResourceType: (resourceType: string) => ARNItem[]
}
```

## 6. Data Models

### 6.1 Dependency Management
Action dependencies are managed through YAML configuration files for better maintainability and readability.

#### YAML Structure Example
```yaml
# data/dependencies/s3-dependencies.yaml
service: s3
dependencies:
  s3:GetObject:
    requires:
      - s3:ListBucket
    description: "Getting object requires listing bucket permissions"
  
  s3:PutObject:
    requires:
      - s3:ListBucket
      - s3:GetBucketLocation
    description: "Putting object requires bucket access"
  
  s3:DeleteObject:
    requires:
      - s3:ListBucket
    soft_requires:  # Optional dependencies
      - s3:GetObject
    description: "Delete may need read access first"
```

### 6.2 Core Types
```typescript
interface AWSResource {
  id: string
  name: string
  service: string
  icon?: string
  description?: string
  arnPattern?: string
  actions: AWSAction[]
}

interface AWSAction {
  id: string
  name: string
  description?: string
  category: 'read' | 'write' | 'admin'
  dependencies?: string[]
  requiresARN?: boolean
}

interface IAMPolicy {
  Version: string
  Statement: PolicyStatement[]
}

interface PolicyStatement {
  Effect: 'Allow' | 'Deny'
  Action: string[]
  Resource: string | string[]
  Condition?: Record<string, any>
}

interface ARNItem {
  arn: string
  service: string
  resourceType?: string
  displayName?: string
  description?: string
  tags?: Record<string, string>
}
```

## 7. Features & Capabilities

### 7.1 Core Features
- **Service Selection**: Choose from 50+ AWS services
- **Action Management**: Select individual or bulk actions
- **ARN Specification**: Input and validate resource ARNs
  - Manual ARN input with validation (default when no ARN list provided)
  - Dropdown selection from provided ARN list (when arnList is provided)
  - Automatic mode detection based on arnList availability
  - Automatic filtering by service/resource type in dropdown mode
  - Support for input, dropdown, both, or auto modes
  - Fallback to input field when dropdown has no matching ARNs
- **Dependency Resolution**: Automatic inclusion of required permissions
- **Policy Generation**: Real-time JSON policy creation
- **Validation**: ARN format and policy structure validation

### 7.2 Advanced Features
- **Custom Services**: Add proprietary AWS services
- **Policy Optimization**: Minimize policy size
- **Condition Builder**: Visual condition editor
- **Policy Comparison**: Diff between policies
- **Template System**: Save and load policy templates
- **Export Formats**: JSON, YAML, Terraform, CloudFormation

### 7.3 Developer Experience
- **Zero Config**: Works out of the box
- **Tree Shaking**: Import only needed components
- **SSR Compatible**: Works with Next.js, Gatsby, etc.
- **Framework Agnostic**: Core works without React
- **Extensive Docs**: Component playground and examples
- **TypeScript**: Full type definitions
- **Responsive Design**: Automatic layout adaptation
  - Horizontal layout on wide screens (>768px by default)
  - Vertical layout on narrow screens (<768px)
  - Customizable breakpoint for different requirements
  - Smooth transitions between layouts

## 8. Integration Patterns

### 8.1 Basic Integration

#### Without ARN List (Default Input Mode)
```typescript
import { PolicyGenerator } from '@awspirin/awspirin-lib';

function App() {
  return (
    <PolicyGenerator
      onChange={(policy) => console.log(policy)}
      theme="dark"
      locale="en"
    />
  );
}
```

#### With ARN List (Automatic Dropdown Mode)
```typescript
import { PolicyGenerator } from '@awspirin/awspirin-lib';

function App() {
  const myARNs = [
    { arn: 'arn:aws:s3:::my-bucket/*', service: 's3', displayName: 'My Bucket' },
    { arn: 'arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0', service: 'ec2', displayName: 'My Instance' },
    { arn: 'arn:aws:lambda:us-west-2:123456789012:function:myFunction', service: 'lambda', displayName: 'My Function' }
  ];

  return (
    <PolicyGenerator
      arnList={myARNs}  // Automatically enables dropdown mode
      onChange={(policy) => console.log(policy)}
      theme="dark"
      locale="en"
    />
  );
}
```

### 8.2 Custom Layout
```typescript
import { 
  ResourceSelector, 
  ActionSelector, 
  PolicyPreview,
  usePolicyGenerator 
} from '@awspirin/awspirin-lib';

function CustomPolicyBuilder() {
  const { resources, policy, selectResource } = usePolicyGenerator();
  
  return (
    <div className="custom-layout">
      <ResourceSelector 
        resources={resources}
        onSelect={selectResource}
      />
      {/* Custom components */}
      <PolicyPreview policy={policy} />
    </div>
  );
}
```

### 8.3 Headless Usage
```typescript
import { PolicyCore } from '@awspirin/awspirin-lib/core';

const policyGen = new PolicyCore();
policyGen.addResource('s3');
policyGen.setActions('s3', ['s3:GetObject', 's3:PutObject']);
policyGen.setARN('s3', 'arn:aws:s3:::my-bucket/*');
const policy = policyGen.generatePolicy();
```

## 9. Styling & Theming

### 9.1 Theme Structure
```typescript
interface Theme {
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    border: string
    // Category colors
    read: string
    write: string
    admin: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      sm: string
      base: string
      lg: string
    }
  }
  borderRadius: string
  shadows: {
    sm: string
    md: string
    lg: string
  }
}
```

### 9.2 CSS-in-JS Support
- Styled Components compatibility
- Emotion support
- CSS Modules support
- Tailwind CSS integration
- Plain CSS override capability

## 10. Internationalization

### 10.1 Supported Languages
- English (en)
- Korean (ko)
- Japanese (ja)
- Chinese Simplified (zh-CN)
- Chinese Traditional (zh-TW)
- Spanish (es)
- French (fr)
- German (de)

### 10.2 i18n API
```typescript
interface I18nConfig {
  locale: string
  fallbackLocale?: string
  messages?: Record<string, Messages>
  dateFormat?: string
  numberFormat?: string
}
```

## 11. Performance Requirements

### 11.1 Bundle Size
- Core: < 50KB gzipped
- Full UI: < 150KB gzipped
- Individual components: < 20KB each

### 11.2 Runtime Performance
- Initial render: < 100ms
- Policy generation: < 50ms
- Search/filter: < 16ms (60fps)
- Memory usage: < 10MB
- Layout transition: < 200ms
- YAML parsing: < 20ms per file

## 12. Browser Support

### 12.1 Minimum Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Node.js 14+ (for SSR)

### 12.2 Progressive Enhancement
- Works without JavaScript (SSR)
- Graceful degradation for older browsers
- Mobile responsive
- Touch-friendly

## 13. Testing Strategy

### 13.1 Test Coverage
- Unit tests: 90%+ coverage
- Integration tests: All user flows
- Visual regression: Storybook + Chromatic
- Performance tests: Bundle size and runtime
- Accessibility tests: WCAG 2.1 AA compliance

### 13.2 Test Tools
- Jest for unit tests
- React Testing Library for components
- Playwright for E2E tests
- Storybook for component development
- Bundlesize for bundle monitoring

## 14. Documentation

### 14.1 Documentation Types
- **API Reference**: Auto-generated from TypeScript
- **Component Guide**: Interactive Storybook
- **Integration Examples**: Real-world use cases
- **Migration Guide**: From standalone to library
- **Best Practices**: Security and performance tips

### 14.2 Code Examples
- Basic usage
- Advanced customization
- Framework integrations (Next.js, CRA, Vite)
- Custom themes
- Custom services/actions
- Headless implementation

## 15. Distribution

### 15.1 Package Formats
- CommonJS (for Node.js)
- ES Modules (for bundlers)
- UMD (for CDN usage)
- TypeScript definitions

### 15.2 Publishing
- NPM registry
- GitHub packages
- CDN (unpkg, jsdelivr)
- Source maps included

## 16. Versioning & Release

### 16.1 Semantic Versioning
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

### 16.2 Release Cycle
- Monthly minor releases
- Weekly patch releases
- Quarterly major releases
- LTS versions every year

## 17. Success Metrics

### 17.1 Adoption Metrics
- NPM downloads
- GitHub stars
- Active installations
- Community contributions

### 17.2 Quality Metrics
- Bundle size trends
- Performance benchmarks
- Bug report rate
- Time to resolution

### 17.3 Developer Satisfaction
- Documentation clarity
- API usability
- Integration ease
- Support responsiveness

## 18. Future Enhancements

### 18.1 Phase 2 Features
- Policy simulation
- Cost estimation
- Compliance checking
- Role assumption support
- Cross-account policies

### 18.2 Phase 3 Features
- AI-powered suggestions
- Policy optimization ML
- Security score
- Audit trail
- Team collaboration

## 19. License & Distribution

### 19.1 License
MIT License for maximum adoption

### 19.2 Support Model
- Community support (GitHub)
- Priority support (paid)
- Enterprise support (SLA)

## 20. Migration Path

### 20.1 From Standalone
Provide automated migration tool to convert existing AWSpirin deployment to library usage

### 20.2 Breaking Changes
Minimize breaking changes, provide codemods for major versions

---

This PRD defines a comprehensive JavaScript component library that transforms AWSpirin's AWS IAM policy generation capabilities into a reusable, developer-friendly package that can be embedded in any JavaScript application.