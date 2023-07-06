import React, { useState } from "react";
import Comment from "./comment";
import { getAuth } from "firebase/auth";
import { User } from "firebase/auth";
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
} from "@ionic/react";
import { Timestamp } from "firebase/firestore";

interface Comment {
  id: string;
  content: string;
  createdAt: Timestamp;
  author : string;
}

interface PostProps {
  postId: string;
  content: string;
  author: string;
  timestamp: Timestamp;
  comments: Comment[];
  onAddComment: (postId: string, author: string, content: string) => void;
}
const user: User | null = getAuth().currentUser;
if (!user) {
  // Handle the case where the user is not logged in
  console.log("User is not logged in");
}

const Post: React.FC<PostProps> = ({
  postId,
  content,
  author,
  timestamp,
  comments,
  onAddComment,
}) => {
  const [commentContent, setCommentContent] = useState("");

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = user?.displayName ?? "Anonymous";
    onAddComment(postId, displayName, commentContent);
    setCommentContent("");
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardSubtitle>
          {timestamp && timestamp.toDate().toLocaleString()}
        </IonCardSubtitle>
        <IonCardTitle>{author}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>{content}</p>

        {/* <IonButton expand="block" onClick={onLike}>
          Like {likes}
        </IonButton> */}

        <IonInput
          value={commentContent}
          placeholder="Add a comment"
          onIonChange={(e) => setCommentContent(e.detail.value!)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCommentSubmit(e);
            }
          }}
        />
        <IonButton expand="block" onClick={handleCommentSubmit}>
          Submit
        </IonButton>

        <IonList>
          {comments.map((comment) => (
            <IonItem key={comment.id}>
              <IonLabel>{comment.content}</IonLabel>
              <IonButton
                fill="clear"
                color="danger"
                onClick={() => console.log(comment.id)} //TODO : delete comment
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
