import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ApiKeyField({ value, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="bg-surface-card rounded-card shadow-card border border-border-light p-card-pad">
      <h2 className="text-[13px] font-semibold text-text-primary mb-1">
        Claude API Key
      </h2>
      <p className="text-[11px] font-medium text-text-muted mb-3">
        Get your API key from{' '}
        <a
          href="https://console.anthropic.com/settings/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          console.anthropic.com
        </a>
      </p>

      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full px-3 py-2 pr-10 text-[12.5px] font-medium text-text-primary
            bg-surface-bg border border-border rounded-btn
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
            transition-all duration-default"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors duration-default"
        >
          {visible ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
