import React, { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonInput,
  IonList,
  IonLabel,
  IonItem,
  IonText,
} from '@ionic/react';
import { getAuth, User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { collection, query, orderBy, onSnapshot  , deleteDoc , doc} from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Comment {
  id: string;
  content: string;
  createdAt: Timestamp;
  author_name: string;
}

interface PostProps {
  postId: string;
  content: string;
  author: string;
  timestamp: Timestamp;
  onAddComment: (postId: string, author: string, content: string) => void;
  onDeletePost: (postId: string) => void;
  likes: number;
  onLikePost: (postId: string , likes :number) => void;
}

const user: User | null = getAuth().currentUser;
if (!user) {
  // Handle the case where the user is not logged in
  console.log('User is not logged in');
}

const Post: React.FC<PostProps> = ({ postId, content, author, timestamp, onAddComment , onDeletePost , likes , onLikePost}) => {
//   console.log('postId', postId);
    const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // console.log("trying to get comments for post", postId);
    const commentsCollection = collection(db, 'posts', postId, 'comments');
    const orderedComments = query(commentsCollection);
    const unsubscribeComments = onSnapshot(orderedComments, (querySnapshot) => {
    const commentsData: Comment[] = [];

      querySnapshot.docs.forEach((doc) => {
        console.log('doc', doc.data());
        const comment = {
          id: doc.id,
          content: doc.data().content,
          createdAt: doc.data().createdAt,
          author_name: doc.data().author_name,
        } as Comment;

        commentsData.push(comment);
        console.log('comment', comment);
      });

      setComments(commentsData);
    });

    // Clean up the subscription on component unmount
    return () => {
      unsubscribeComments();
    };
  }, []);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = user?.displayName ?? 'Anonymous';
    onAddComment(postId, displayName, commentContent);
    setCommentContent('');
  };
  const deleteComment = async (commentId: string) => {
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      await deleteDoc(commentRef);
      console.log('Comment deleted:', commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

    const deletePost =  () => {
        onDeletePost(postId);
    }

  return (
    <IonCard>
      <IonCardHeader>
      <IonButton color="danger" onClick={deletePost }>
        Delete Post
      </IonButton>
        <IonCardSubtitle>{timestamp && timestamp.toDate().toLocaleString()}</IonCardSubtitle>
        <IonCardTitle>{author}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>{content}</p>
        <IonLabel>Likes: {likes}</IonLabel>
        <IonButton color="primary" onClick={()=>onLikePost(postId , likes)}>
        Like
      </IonButton>
        <IonInput
          value={commentContent}
          placeholder="Add a comment"
          onIonChange={(e) => setCommentContent(e.detail.value!)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommentSubmit(e);
            }
          }}
        />
        <IonButton expand="block" onClick={handleCommentSubmit}>
          Submit comment
        </IonButton>

        <IonList>
          {comments.map((comment) => (
            <IonItem key={comment.id}>
              <IonLabel>{comment.author_name}</IonLabel>
              <IonText>{comment.content}</IonText>
              <IonButton
                fill="clear"
                color="danger"
                onClick={() => deleteComment(comment.id)} //TODO : delete comment
              >
                Delete
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default Post;