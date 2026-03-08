import React from 'react';

export default function ProfileForm({ name, onNameChange, role, onRoleChange }) {
  return (
    <div className="bg-surface-card rounded-card shadow-card border border-border-light p-card-pad">
      <h2 className="text-[13px] font-semibold text-text-primary mb-3">
        Your Profile
      </h2>

      <label className="block mb-3">
        <span className="text-[11px] font-medium text-text-muted uppercase tracking-[1px]">
          Name
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Your name"
          className="mt-1 w-full px-3 py-2 text-[12.5px] font-medium text-text-primary
            bg-surface-bg border border-border rounded-btn
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
            transition-all duration-default"
        />
      </label>

      <label className="block">
        <span className="text-[11px] font-medium text-text-muted uppercase tracking-[1px]">
          Role / Background
        </span>
        <textarea
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          placeholder="e.g. Product manager at a B2B SaaS startup, 8 years in tech"
          rows={2}
          className="mt-1 w-full px-3 py-2 text-[12.5px] font-medium text-text-primary
            bg-surface-bg border border-border rounded-btn resize-none
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
            transition-all duration-default"
        />
      </label>
    </div>
  );
}
