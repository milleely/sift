import React from 'react';
import { usePostData } from './hooks/usePostData';
import { useSiftMessages } from './hooks/useSiftMessages';
import WelcomeState from './components/WelcomeState';
import LoadingState from './components/LoadingState';
import CommentList from './components/CommentList';

export default function App() {
  const { postData } = usePostData();
  const { comments, error, isLoading } = useSiftMessages();

  return (
    <div className="min-h-screen bg-surface-bg p-header-pad">
      {/* Header */}
      <div className="mb-section-gap">
        <h1 className="text-base font-bold text-text-primary tracking-heading">
          Sift
        </h1>
      </div>

      {/* States */}
      {!postData && !isLoading && !comments && <WelcomeState />}

      {isLoading && <LoadingState postData={postData} />}

      {error && !isLoading && (
        <div className="bg-white rounded-card shadow-card p-card-pad border border-border-light">
          <p className="text-sm text-status-warning font-medium">{error}</p>
        </div>
      )}

      {comments && !isLoading && (
        <CommentList comments={comments} postData={postData} />
      )}
    </div>
  );
}
