import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs, query , addDoc } from "firebase/firestore";
import post from "../components/post";
import Post from "../components/post";
import { Timestamp } from "firebase/firestore";

interface Comment {
    id: string;
    content: string;
    createdAt: Timestamp;
    author : string;
  }

interface Post {
  id: string;
  content: string;
  comments: Comment[];
  author_name: string;
  timestamp: Timestamp;
}


const HomePage: React.FC = () => {
  const [postsList, setPostsList] = useState<Post[]>([]);
  useEffect(() => {
    async function fetchData() {
      const postsCollection = collection(db, "posts");
      const postsQuery = query(postsCollection);

      const postDocs = await getDocs(postsQuery);

      const posts = await Promise.all(
        postDocs.docs.map(async (doc) => {
          const post = { id: doc.id, ...doc.data() } as Post;
          const commentsCollection = collection(
            db,
            "posts",
            doc.id,
            "comments"
          );
          const commentsQuery = query(commentsCollection);
          const commentDocs = await getDocs(commentsQuery);
          const comments: Comment[] = commentDocs.docs.map((commentDoc) => {
            return { id: commentDoc.id, ...commentDoc.data() } as Comment;
          });

          post.comments = comments;
          return post;
        })
      );

      setPostsList(posts);
        //   console.log(posts);
    }

    fetchData();
  }, []);
  const handleAddComment = async (postId: string, author: string, content: string) => {
    const commentsCollection = collection(db, "posts", postId, "comments");
    await addDoc(commentsCollection, { author_name: author, content: content });
    console.log("Comment added");
  };

  const postItems =  postsList.map((post) => (
    <IonItem key={post.id}>
    <Post 
    content={post.content}
    comments={post.comments}
    postId={post.id}
    author={post.author_name}
    timestamp={post.timestamp}
    onAddComment={handleAddComment}

    />

    </IonItem>
  ))
  console.log(postItems); 


    



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home Page </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
            {!postItems && <IonItem> No posts found </IonItem>}
            {postItems}
        </IonList>
        
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
