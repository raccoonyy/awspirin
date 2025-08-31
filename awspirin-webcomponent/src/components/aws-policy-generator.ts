import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { defaultAWSResources } from '@shared/data/aws-resources'
import { defaultAWSActions } from '@shared/data/aws-actions'
import { generateIAMPolicy } from '@shared/utils/policy-generator'
import type { AWSResource, AWSAction } from '@shared/types'

@customElement('aws-policy-generator')
export class AWSPolicyGenerator extends LitElement {
  @property({ type: String }) theme: 'light' | 'dark' = 'light'
  @property({ type: String }) language: 'ko' | 'en' = 'en'
  @property({ type: Boolean }) readonly = false
  @property({ type: Array, attribute: 'arn-list' }) arnList: string[] = []

  @state() private resources: AWSResource[] = []
  @state() private actions: Record<string, AWSAction[]> = {}


  static styles = css`
    :host {
      display: block;
      font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      --primary-color: var(--aws-primary-color, #232f3e);
      --secondary-color: var(--aws-secondary-color, #ff9900);
      --background-color: var(--aws-background-color, #ffffff);
      --border-color: var(--aws-border-color, #e5e7eb);
      --text-color: var(--aws-text-color, #374151);
      --border-radius: var(--aws-border-radius, 8px);
    }

    .container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
      min-height: 600px;
      background-color: var(--background-color);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      overflow: hidden;
    }

    .panel {
      background: var(--background-color);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
    }

    .panel:last-child {
      border-right: none;
    }

    .panel-header {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      background: #f9fafb;
    }

    .panel-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 0.25rem 0;
    }

    .panel-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .panel-content {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }

    .resource-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .resource-item:hover {
      border-color: var(--secondary-color);
      background: #fef3e2;
    }

    .resource-item.selected {
      border-color: var(--secondary-color);
      background: #fef3e2;
    }

    .resource-icon {
      font-size: 1.5rem;
    }

    .resource-info {
      flex: 1;
    }

    .resource-name {
      font-weight: 500;
      color: var(--text-color);
      margin: 0 0 0.25rem 0;
    }

    .resource-description {
      font-size: 0.75rem;
      color: #6b7280;
      margin: 0;
    }

    .checkbox {
      width: 1rem;
      height: 1rem;
      accent-color: var(--secondary-color);
    }

    .action-section {
      margin-bottom: 1rem;
    }

    .action-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      background: #f3f4f6;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      margin-bottom: 0.5rem;
    }

    .action-category {
      font-weight: 500;
      font-size: 0.875rem;
    }

    .action-item {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-left: 3px solid transparent;
      margin-bottom: 0.25rem;
      cursor: pointer;
    }

    .action-item:hover {
      background: #f9fafb;
      border-left-color: var(--secondary-color);
    }

    .action-item.selected {
      background: #fef3e2;
      border-left-color: var(--secondary-color);
    }

    .action-details {
      flex: 1;
    }

    .action-name {
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--text-color);
      margin: 0 0 0.25rem 0;
    }

    .action-description {
      font-size: 0.75rem;
      color: #6b7280;
      margin: 0 0 0.25rem 0;
    }

    .action-codes {
      font-size: 0.625rem;
      font-family: monospace;
      color: #9ca3af;
      margin: 0;
    }

    .arn-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .policy-preview {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 1rem;
      font-family: monospace;
      font-size: 0.75rem;
      white-space: pre-wrap;
      overflow: auto;
      max-height: 400px;
    }

    .copy-button {
      background: var(--secondary-color);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      cursor: pointer;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .copy-button:hover {
      background: #e68900;
    }

    .copy-button:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
    }

    .badge {
      background: #e5e7eb;
      color: #374151;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .badge.selected {
      background: #dbeafe;
      color: #1e40af;
    }

    @media (max-width: 768px) {
      .container {
        grid-template-columns: 1fr;
        gap: 0;
      }
      
      .panel {
        border-right: none;
        border-bottom: 1px solid var(--border-color);
      }
      
      .panel:last-child {
        border-bottom: none;
      }
    }
  `

  connectedCallback() {
    super.connectedCallback()
    this.initializeData()
  }

  private initializeData() {
    this.resources = [...defaultAWSResources]
    this.actions = { ...defaultAWSActions }
  }

  private get selectedResources(): AWSResource[] {
    return this.resources.filter(r => r.selected)
  }

  private get selectedActions(): AWSAction[] {
    return Object.values(this.actions).flat().filter(a => a.selected)
  }

  private handleResourceToggle(resourceId: string) {
    if (this.readonly) return

    this.resources = this.resources.map(r => 
      r.id === resourceId ? { ...r, selected: !r.selected } : r
    )

    // 리소스가 선택 해제되면 해당 액션들도 해제
    if (!this.resources.find(r => r.id === resourceId)?.selected) {
      this.actions = {
        ...this.actions,
        [resourceId]: this.actions[resourceId]?.map(a => ({ ...a, selected: false })) || []
      }
    }

    this.dispatchEvent(new CustomEvent('resource-change', {
      detail: { resourceId, selected: this.resources.find(r => r.id === resourceId)?.selected }
    }))
  }

  private handleActionToggle(resourceId: string, actionId: string) {
    if (this.readonly) return

    this.actions = {
      ...this.actions,
      [resourceId]: this.actions[resourceId]?.map(a => 
        a.id === actionId ? { ...a, selected: !a.selected } : a
      ) || []
    }

    this.dispatchEvent(new CustomEvent('action-change', {
      detail: { resourceId, actionId, selected: this.actions[resourceId]?.find(a => a.id === actionId)?.selected }
    }))
  }

  private handleArnChange(resourceId: string, arn: string) {
    if (this.readonly) return

    this.resources = this.resources.map(r => 
      r.id === resourceId ? { ...r, arn } : r
    )

    this.dispatchEvent(new CustomEvent('arn-change', {
      detail: { resourceId, arn }
    }))
  }

  private generatePolicy(): string | null {
    const policy = generateIAMPolicy(this.selectedResources, this.selectedActions, this.actions)
    return policy ? JSON.stringify(policy, null, 2) : null
  }

  private async copyPolicy() {
    const policy = this.generatePolicy()
    if (policy) {
      await navigator.clipboard.writeText(policy)
      this.dispatchEvent(new CustomEvent('policy-copied', { detail: { policy } }))
    }
  }

  render() {
    const policy = this.generatePolicy()
    const selectedResourceCount = this.selectedResources.length
    const selectedActionCount = this.selectedActions.length

    return html`
      <div class="container">
        <!-- Resources Panel -->
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">
              AWS Resources
              ${selectedResourceCount > 0 ? html`<span class="badge selected">${selectedResourceCount}</span>` : ''}
            </h2>
            <p class="panel-subtitle">Select AWS services to configure</p>
          </div>
          <div class="panel-content">
            ${this.resources.map(resource => html`
              <div 
                class="resource-item ${resource.selected ? 'selected' : ''}"
                @click=${() => this.handleResourceToggle(resource.id)}
              >
                <div class="resource-icon">${resource.icon}</div>
                <div class="resource-info">
                  <h3 class="resource-name">${resource.name}</h3>
                  <p class="resource-description">${resource.description}</p>
                </div>
                <input 
                  type="checkbox" 
                  class="checkbox"
                  .checked=${resource.selected}
                  @click=${(e: Event) => e.stopPropagation()}
                  @change=${() => this.handleResourceToggle(resource.id)}
                >
              </div>
            `)}
          </div>
        </div>

        <!-- Actions Panel -->
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">
              Permissions
              ${selectedActionCount > 0 ? html`<span class="badge selected">${selectedActionCount}</span>` : ''}
            </h2>
            <p class="panel-subtitle">Configure permissions for selected resources</p>
          </div>
          <div class="panel-content">
            ${this.selectedResources.length === 0 ? html`
              <div class="empty-state">
                <p>Select AWS resources to configure permissions</p>
              </div>
            ` : html`
              ${this.selectedResources.map(resource => this.renderResourceActions(resource))}
            `}
          </div>
        </div>

        <!-- Policy Preview Panel -->
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">Policy Preview</h2>
            <p class="panel-subtitle">Generated IAM policy JSON</p>
          </div>
          <div class="panel-content">
            ${policy ? html`
              <button 
                class="copy-button"
                @click=${this.copyPolicy}
              >
                Copy Policy
              </button>
              <div class="policy-preview">${policy}</div>
            ` : html`
              <div class="empty-state">
                <p>Select resources and actions to generate policy</p>
              </div>
            `}
          </div>
        </div>
      </div>
    `
  }

  private renderResourceActions(resource: AWSResource) {
    const resourceActions = this.actions[resource.id] || []
    const categories = ['read', 'write', 'admin'] as const

    return html`
      <div class="action-section">
        <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${resource.icon} ${resource.name}</h3>
        
        <!-- ARN Input -->
        ${this.arnList.length > 0 ? html`
          <select 
            class="arn-input"
            @change=${(e: Event) => {
              const target = e.target as HTMLSelectElement
              this.handleArnChange(resource.id, target.value)
            }}
          >
            <option value="">Select ARN from list</option>
            ${this.arnList.map(arn => html`
              <option value="${arn}" .selected=${resource.arn === arn}>${arn}</option>
            `)}
          </select>
        ` : html`
          <input 
            type="text"
            class="arn-input"
            placeholder="Enter ARN (optional)"
            .value=${resource.arn || ''}
            @input=${(e: Event) => {
              const target = e.target as HTMLInputElement
              this.handleArnChange(resource.id, target.value)
            }}
          >
        `}

        ${categories.map(category => {
          const categoryActions = resourceActions.filter(a => a.category === category)
          if (categoryActions.length === 0) return ''

          return html`
            <div class="action-header">
              <span class="action-category">${category.toUpperCase()}</span>
              <span class="badge">${categoryActions.filter(a => a.selected).length}/${categoryActions.length}</span>
            </div>
            ${categoryActions.map(action => html`
              <div 
                class="action-item ${action.selected ? 'selected' : ''}"
                @click=${() => this.handleActionToggle(resource.id, action.id)}
              >
                <input 
                  type="checkbox" 
                  class="checkbox"
                  .checked=${action.selected}
                  @click=${(e: Event) => e.stopPropagation()}
                  @change=${() => this.handleActionToggle(resource.id, action.id)}
                >
                <div class="action-details">
                  <h4 class="action-name">${action.name}</h4>
                  <p class="action-description">${action.description}</p>
                  <p class="action-codes">
                    ${action.actions.join(', ')}
                    ${action.dependencies ? html` + ${action.dependencies.join(', ')}` : ''}
                  </p>
                </div>
              </div>
            `)}
          `
        })}
      </div>
    `
  }
}