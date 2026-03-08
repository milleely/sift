import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const STYLE_CONFIG = {
  take: { label: 'Take', bg: 'bg-primary-light', text: 'text-primary' },
  question: { label: 'Question', bg: 'bg-badge-purple-light', text: 'text-badge-purple' },
  experience: { label: 'Experience', bg: 'bg-badge-teal-light', text: 'text-badge-teal' },
};

export default function CommentCard({ style, comment }) {
  const [copied, setCopied] = useState(false);
  const config = STYLE_CONFIG[style] || STYLE_CONFIG.take;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(comment);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-surface-card rounded-card shadow-card border border-border-light p-card-pad">
      {/* Style badge */}
      <span
        className={`inline-block text-[10.5px] font-medium px-2 py-[3px] rounded-badge ${config.bg} ${config.text} mb-2`}
      >
        {config.label}
      </span>

      {/* Comment text */}
      <p className="text-[12.5px] font-medium text-text-secondary leading-relaxed mb-3">
        {comment}
      </p>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-btn transition-all duration-default
          bg-primary text-white hover:bg-primary-hover"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}
