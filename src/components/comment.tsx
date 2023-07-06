import React from 'react';

interface CommentProps {
  author: string;
  content: string;
  timestamp: string;
}

const Comment: React.FC<CommentProps> = ({ author, content, timestamp }) => {
  const formattedDate = new Date(timestamp).toLocaleString();

  return (
    <div className="comment">
      <div className="comment-info">
        <span className="comment-author">{author}</span>
        <span className="comment-timestamp">{formattedDate}</span>
      </div>
      <div className="comment-content">{content}</div>
    </div>
  );
};

export default Comment;