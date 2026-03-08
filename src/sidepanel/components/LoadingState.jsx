import React from 'react';

export default function LoadingState({ postData }) {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-16 px-6">
      <div className="w-8 h-8 rounded-full border-2 border-primary-light border-t-primary animate-spin mb-4" />
      <p className="text-[13px] font-semibold text-text-primary mb-1">
        Generating comments...
      </p>
      {postData?.authorName && (
        <p className="text-[11px] font-medium text-text-muted">
          for {postData.authorName}'s post
        </p>
      )}
    </div>
  );
}
