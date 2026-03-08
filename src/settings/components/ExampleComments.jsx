import React from 'react';

export default function ExampleComments({ value, onChange }) {
  return (
    <div className="bg-surface-card rounded-card shadow-card border border-border-light p-card-pad">
      <h2 className="text-[13px] font-semibold text-text-primary mb-1">
        Example Comments
      </h2>
      <p className="text-[11px] font-medium text-text-muted mb-3">
        Paste 3-5 LinkedIn comments you've written. One per line. These help
        Sift match your voice.
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"This resonates with my experience scaling a sales team from 3 to 20. The hardest part isn't hiring, it's letting go of doing the deals yourself.\nCurious how you handle the transition from founder-led sales to a repeatable process? That's where most teams I've seen stumble.\nWe tried something similar last year and the key insight was starting with one ICP instead of three. Focus won."}
        rows={6}
        className="w-full px-3 py-2 text-[12.5px] font-medium text-text-primary
          bg-surface-bg border border-border rounded-btn resize-none
          focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
          transition-all duration-default"
      />
    </div>
  );
}
