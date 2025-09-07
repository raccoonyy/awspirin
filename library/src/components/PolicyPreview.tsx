import { useState, useMemo } from 'react';
import { IAMPolicy } from '../types';

export interface PolicyPreviewProps {
  policy: IAMPolicy;
  format?: 'json' | 'yaml' | 'terraform';
  syntaxHighlight?: boolean;
  copyable?: boolean;
  downloadable?: boolean;
  className?: string;
}

export function PolicyPreview({
  policy,
  format = 'json',
  syntaxHighlight = true,
  copyable = true,
  downloadable = true,
  className = '',
}: PolicyPreviewProps) {
  const [currentFormat, setCurrentFormat] = useState(format);
  const [copied, setCopied] = useState(false);

  const formattedPolicy = useMemo(() => {
    switch (currentFormat) {
      case 'json':
        return JSON.stringify(policy, null, 2);
      case 'yaml':
        return convertToYAML(policy);
      case 'terraform':
        return convertToTerraform(policy);
      default:
        return JSON.stringify(policy, null, 2);
    }
  }, [policy, currentFormat]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedPolicy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formattedPolicy], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `policy.${currentFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPolicySize = () => {
    const sizeBytes = new Blob([formattedPolicy]).size;
    const sizeKB = (sizeBytes / 1024).toFixed(1);
    return `${sizeKB} KB`;
  };

  const getStatementCount = () => policy.Statement.length;

  const hasStatements = policy.Statement.length > 0;

  return (
    <div className={`policy-preview ${className}`}>
      <div className="policy-preview-header">
        <h3>IAM Policy</h3>
        <div className="policy-stats">
          <span className="stat">
            Statements:
            {' '}
            {getStatementCount()}
          </span>
          <span className="stat">
            Size:
            {' '}
            {getPolicySize()}
          </span>
        </div>
      </div>

      <div className="format-selector">
        {['json', 'yaml', 'terraform'].map((fmt) => (
          <button
            key={fmt}
            type="button"
            className={`format-btn ${currentFormat === fmt ? 'active' : ''}`}
            onClick={() => setCurrentFormat(fmt as typeof currentFormat)}
          >
            {fmt.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="policy-content">
        {hasStatements ? (
          <pre className={`policy-code ${syntaxHighlight ? 'highlighted' : ''}`}>
            <code>{formattedPolicy}</code>
          </pre>
        ) : (
          <div className="empty-policy">
            <p>No actions selected</p>
            <p>Select AWS resources and actions to generate a policy</p>
          </div>
        )}
      </div>

      {hasStatements && (
        <div className="policy-actions">
          {copyable && (
            <button
              type="button"
              className={`action-btn copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              disabled={!hasStatements}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          )}

          {downloadable && (
            <button
              type="button"
              className="action-btn download-btn"
              onClick={handleDownload}
              disabled={!hasStatements}
            >
              ⬇️ Download
            </button>
          )}
        </div>
      )}

      {hasStatements && policy.Statement.length > 10 && (
        <div className="policy-warning">
          ⚠️ This policy has many statements. Consider consolidating for better performance.
        </div>
      )}
    </div>
  );
}

function convertToYAML(policy: IAMPolicy): string {
  return `Version: "${policy.Version}"
Statement:
${policy.Statement.map((stmt) => `  - Effect: ${stmt.Effect}
    Action:${Array.isArray(stmt.Action) ? stmt.Action.map((a) => `\n      - "${a}"`).join('') : `\n      - "${stmt.Action}"`}
    Resource:${Array.isArray(stmt.Resource) ? stmt.Resource.map((r) => `\n      - "${r}"`).join('') : `\n      - "${stmt.Resource}"`}${stmt.Condition ? `\n    Condition:\n      ${JSON.stringify(stmt.Condition, null, 6).replace(/^\{|\}$/g, '').replace(/"/g, '')}` : ''}`).join('\n')}`;
}

function convertToTerraform(policy: IAMPolicy): string {
  return `data "aws_iam_policy_document" "policy" {
${policy.Statement.map((stmt) => `  statement {
    effect = "${stmt.Effect}"
    
    actions = [
${(Array.isArray(stmt.Action) ? stmt.Action : [stmt.Action]).map((a) => `      "${a}",`).join('\n')}
    ]
    
    resources = [
${(Array.isArray(stmt.Resource) ? stmt.Resource : [stmt.Resource]).map((r) => `      "${r}",`).join('\n')}
    ]${stmt.Condition ? `
    
    condition {
      # Add your conditions here
    }` : ''}
  }`).join('\n  \n')}
}

resource "aws_iam_policy" "policy" {
  name   = "generated-policy"
  policy = data.aws_iam_policy_document.policy.json
}`;
}
