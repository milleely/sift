import React from 'react';
import { Sparkles } from 'lucide-react';

export default function WelcomeState() {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-20 px-6">
      <div className="w-12 h-12 bg-primary-light rounded-card flex items-center justify-center mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
      </div>
      <h2 className="text-[13px] font-semibold text-text-primary mb-2">
        Ready to comment
      </h2>
      <p className="text-[12.5px] font-medium text-text-secondary leading-relaxed">
        Click the Sift button on any LinkedIn post to generate comment ideas in
        your voice.
      </p>
    </div>
  );
}
