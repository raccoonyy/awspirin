# @awspirin/awspirin-lib

[![npm version](https://badge.fury.io/js/@awspirin.svg)](https://www.npmjs.com/package/@awspirin-lib/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AWS IAM Policy Generator Component Library - Drop-in React components for AWS policy generation with ARN dropdown support and responsive design.

## 🚀 Live Demo

**[View Live Example →](https://raccoonyy.github.io/awspirin)**
**[Other Examples →](https://raccoonyy.github.io/awspirin-lib)**

Try out all the features including ARN dropdown, dependency resolution, responsive layouts, and multi-language support in your browser.

## Features

🚀 **Easy Integration** - Drop-in React components that work out of the box
📱 **Responsive Design** - Automatically adapts to screen size (horizontal on desktop, vertical on mobile)
🎯 **ARN Dropdown Support** - Pass ARN lists for intelligent dropdown selection
🔍 **Smart Filtering** - ARNs automatically filtered by service and resource type
⚡ **Dependency Resolution** - Automatic inclusion of required permissions
🎨 **Customizable Themes** - Light/dark modes with custom styling support
🌐 **Internationalization** - Multi-language support (EN, KO, JA, ZH)
📊 **YAML Dependencies** - Maintainable dependency definitions
🔧 **TypeScript First** - Full type safety and excellent developer experience

## Installation

```bash
npm install @awspirin/awspirin-lib
```

## Quick Start

### Basic Usage (with ARN Dropdown)

```tsx
import React from 'react';
import { PolicyGenerator, ARNItem } from '@awspirin/awspirin-lib';

function App() {
  // Your ARN list - when provided, automatically enables dropdown mode
  const myARNs: ARNItem[] = [
    {
      arn: 'arn:aws:s3:::my-bucket/*',
      service: 's3',
      displayName: 'My Bucket',
      description: 'Main storage bucket',
    },
    {
      arn: 'arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0',
      service: 'ec2',
      displayName: 'Web Server',
    },
    // ... more ARNs
  ];

  return (
    <PolicyGenerator
      arnList={myARNs}           // Enables smart ARN dropdown
      arnInputMode="auto"        // Auto-detects mode based on ARN availability
      layout="responsive"        // Responsive layout (horizontal on wide, vertical on narrow)
      theme="light"
      onChange={(policy) => console.log(policy)}
      onARNSelect={(resourceId, arn) => console.log('Selected:', arn)}
    />
  );
}
```

### Without ARN List (Traditional Input Mode)

```tsx
import { PolicyGenerator } from '@awspirin/awspirin-lib';

// When no arnList is provided, falls back to traditional ARN input
<PolicyGenerator
  theme="dark"
  layout="responsive"
  onChange={(policy) => console.log(policy)}
/>
```

## ARN Dropdown Features

The library provides intelligent ARN management:

- **Auto Mode**: Automatically shows dropdown when ARNs are available, input field otherwise
- **Service Filtering**: Only shows ARNs matching the selected AWS service
- **Resource Type Filtering**: Further filters by resource type when available
- **Fallback**: Gracefully falls back to input mode when no matching ARNs found

### ARN Input Modes

```tsx
<PolicyGenerator
  arnList={myARNs}
  arnInputMode="auto"        // Default: smart detection
  // arnInputMode="dropdown"    // Always show dropdown (requires arnList)
  // arnInputMode="input"       // Always show input field
  // arnInputMode="both"        // Show both options
/>
```

## Responsive Layout

The component automatically adapts to different screen sizes:

```tsx
<PolicyGenerator
  layout="responsive"        // Default: responsive
  breakpoint={768}          // Custom breakpoint (default: 768px)
  // layout="horizontal"     // Always horizontal
  // layout="vertical"       // Always vertical
/>
```

- **Wide screens (>768px)**: Resource, Action, and Policy sections arranged horizontally
- **Narrow screens (<768px)**: Sections stacked vertically for mobile-friendly experience

## Custom Layout

For advanced use cases, use individual components:

```tsx
import {
  ResourceSelector,
  ActionSelector,
  PolicyPreview,
  usePolicyGenerator,
  sampleResources
} from '@awspirin/awspirin-lib';

function CustomPolicyBuilder() {
  const {
    resources,
    selectedResources,
    policy,
    selectResource,
    setActions,
    setARN,
    getFilteredARNs
  } = usePolicyGenerator(sampleResources);

  return (
    <div className="my-custom-layout">
      <ResourceSelector
        resources={resources}
        selected={selectedResources}
        onSelect={selectResource}
        onDeselect={deselectResource}
      />
      
      {/* Your custom UI elements */}
      
      <PolicyPreview
        policy={policy}
        format="json"
        copyable
        downloadable
      />
    </div>
  );
}
```

## Headless Usage

Use the core logic without React components:

```tsx
import { PolicyCore } from '@awspirin/awspirin-lib/core';

const policyGen = new PolicyCore();

// Set ARN list for dropdown functionality
policyGen.setARNList([
  { arn: 'arn:aws:s3:::my-bucket/*', service: 's3', displayName: 'My Bucket' }
]);

// Add resources and configure
policyGen.addResource(s3Resource);
policyGen.setActions('s3', ['s3:GetObject', 's3:PutObject']);
policyGen.setARN('s3', 'arn:aws:s3:::my-bucket/*');

// Get filtered ARNs for a service
const s3ARNs = policyGen.getFilteredARNs('s3');

// Generate policy
const policy = policyGen.generatePolicy();
```

## YAML Dependencies

Action dependencies are managed through maintainable YAML files:

```yaml
# s3-dependencies.yaml
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
```

## API Reference

### PolicyGenerator Props

```tsx
interface PolicyGeneratorProps {
  // ARN Configuration
  arnList?: ARNItem[];                    // List of available ARNs for dropdown
  arnInputMode?: 'input' | 'dropdown' | 'both' | 'auto';
  
  // Layout Configuration
  layout?: 'horizontal' | 'vertical' | 'responsive';
  breakpoint?: number;                    // Custom responsive breakpoint
  
  // Theme and Localization
  theme?: 'light' | 'dark' | Theme;
  locale?: 'en' | 'ko' | 'ja' | 'zh';
  
  // Data and Behavior
  services?: AWSResource[];               // Custom service definitions
  defaultSelections?: Selection[];        // Pre-selected items
  maxStatements?: number;                 // Policy size limit
  allowWildcards?: boolean;
  
  // Event Handlers
  onChange?: (policy: IAMPolicy) => void;
  onCopy?: (policy: string) => void;
  onARNSelect?: (resourceId: string, arn: string) => void;
  
  // Styling
  className?: string;
  styles?: StyleOverrides;
  components?: ComponentOverrides;
}
```

### ARNItem Interface

```tsx
interface ARNItem {
  arn: string;                    // The AWS ARN
  service: string;                // AWS service (s3, ec2, lambda, etc.)
  resourceType?: string;          // Resource type for additional filtering
  displayName?: string;           // Human-readable name
  description?: string;           // Optional description
  tags?: Record<string, string>;  // Metadata tags
}
```

## Examples

Check out the [examples](https://raccoonyy.github.io/awspirin-lib/) directory for complete examples:

- [Basic Usage](https://raccoonyy.github.io/awspirin-lib/basic-example.html) - Simple PolicyGenerator with ARN dropdown
- [Headless Usage](https://raccoonyy.github.io/awspirin-lib/headless-demo.html) - Core logic without React
- [Multi-language Usage][https://raccoonyy.github.io/awspirin-lib/i18n-demo.html] - Supported Languages are: English, Chinese, Japanese, Korean

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the library
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [AWSpirin Team](https://github.com/raccoonyy/awspirin-lib)

## Support

- 🐛 [Issue Tracker](https://github.com/raccoonyy/awspirin-lib/issues)

---

Built with ❤️ by the AWSpirin team to make AWS IAM policy management easier for everyone.