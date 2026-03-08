import React from 'react';
import CommentCard from './CommentCard';

export default function CommentList({ comments, postData }) {
  return (
    <div>
      {/* Post context */}
      {postData?.authorName && (
        <div className="mb-3">
          <p className="text-[11px] font-medium text-text-muted uppercase tracking-[1px] mb-1">
            Commenting on
          </p>
          <p className="text-[13px] font-semibold text-text-primary">
            {postData.authorName}
          </p>
          {postData.authorHeadline && (
            <p className="text-[11px] font-medium text-text-muted mt-0.5">
              {postData.authorHeadline}
            </p>
          )}
        </div>
      )}

      {/* Comment cards */}
      <div className="flex flex-col gap-card-gap">
        {comments.map((c, i) => (
          <CommentCard key={i} style={c.style} comment={c.comment} />
        ))}
      </div>
    </div>
  );
}
