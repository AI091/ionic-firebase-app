import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab1.css";
import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

interface Comment {
  id: string;
  content: string;
}
interface Post {
  id: string;
  content: string;
  comments: Comment[];
}

const Tab1: React.FC = () => {
  const [postsList, setPostsList] = useState<Post[]>([]);
  const [showAddPost, setShowAddPost] = useState(false);


  useEffect(() => {
    const postsCollection = collection(db, "posts");
    const postsQuery = query(postsCollection);

    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const posts = querySnapshot.docs.map((doc) => {
        const post = { id: doc.id, ...doc.data() } as Post;
        const commentsCollection = collection(db, "posts", doc.id, "comments");
        const commentsQuery = query(commentsCollection);

        onSnapshot(commentsQuery, (commentsQuerySnapshot) => {
          const comments: Comment[] = commentsQuerySnapshot.docs.map(
            (commentDoc) => {
              return { id: commentDoc.id, ...commentDoc.data() } as Comment;
            }
          );

          post.comments = comments;
          setPostsList((prevPosts) => {
            const index = prevPosts.findIndex(
              (prevPost) => prevPost.id === post.id
            );
            if (index > -1) {
              prevPosts[index] = post;
              return [...prevPosts];
            } else {
              return [...prevPosts, post];
            }
          });
        });

        return post;
      });
    });

    return () => unsubscribe();
  }, []);

  const postItems = postsList.map((post) => (
    <div key={post.id}>
      <p>{post.content}</p>

      <h5>Comments</h5>
      {post.comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  ));

  const handleAddPost = () => {
    setShowAddPost(true);
  }; 
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        {postItems}
        <button onClick = {(handleAddPost)} >
        Add Post 
        </button>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
