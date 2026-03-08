import React from 'react';

const TONES = [
  { value: 'witty', label: 'Witty' },
  { value: 'insightful', label: 'Insightful' },
  { value: 'supportive', label: 'Supportive' },
  { value: 'direct', label: 'Direct' },
  { value: 'casual', label: 'Casual' },
];

export default function ToneSelect({ tone, onToneChange }) {
  return (
    <div className="bg-surface-card rounded-card shadow-card border border-border-light p-card-pad">
      <h2 className="text-[13px] font-semibold text-text-primary mb-3">
        Tone Preference
      </h2>

      <label className="block">
        <span className="text-[11px] font-medium text-text-muted uppercase tracking-[1px]">
          Default tone
        </span>
        <select
          value={tone}
          onChange={(e) => onToneChange(e.target.value)}
          className="mt-1 w-full px-3 py-2 text-[12.5px] font-medium text-text-primary
            bg-surface-bg border border-border rounded-btn
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
            transition-all duration-default"
        >
          {TONES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
