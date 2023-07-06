import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
  } from "@ionic/react";
  import React, { useState, useEffect } from "react";
  import { db } from "../../config/firebase";
  import {
    collection,
    getDocs,
    query,
    addDoc,
    onSnapshot,
    orderBy,
    Timestamp,
    doc,
    deleteDoc,
  } from "firebase/firestore";
  import Post from "../components/post";
  import NewPostForm from "../components/newPost";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  
  interface PostInterface {
    id: string;
    content: string;
    author_name?: string;
    timestamp: Timestamp;
  }
  
  const HomePage: React.FC = () => {
    const [postsList, setPostsList] = useState<PostInterface[]>([]);
  
    useEffect(() => {
      const postsCollection = collection(db, "posts");
      const orderedPosts = query(postsCollection, orderBy("createdAt", "desc"));
  
      const unsubscribePosts = onSnapshot(orderedPosts, (querySnapshot) => {
        const postsData: PostInterface[] = [];
  
        querySnapshot.docs.forEach((doc) => {
            console.log(doc.data());
          const post = {
            id: doc.id,
            content: doc.data().content,
            timestamp: doc.data().timestamp,
          } as PostInterface;
  
          postsData.push(post);
        });
  
        setPostsList(postsData);
      });
  
      // Clean up the subscription on component unmount
      return () => {
        unsubscribePosts();
      };
    }, []);
  
    const handleAddComment = async (
      postId: string,
      author: string,
      content: string
    ) => {
      const commentsCollection = collection(db, "posts", postId, "comments");
      await addDoc(commentsCollection, { author_name: author, content: content });
      console.log("Comment added");
    };
  
    const handleCreatePost = async (author_name: string, content: string) => {
      const post = {
        author_name,
        content,
        createdAt: Timestamp.now(),
        likes: 0,
      };
      const postsCollection = collection(db, "posts");
      try {
        await addDoc(postsCollection, post);
        console.log("Post added");
      } catch (error) {
        console.log(error);
      }
    };
  
    const getCurrentUserName = () => {
      const auth = getAuth();
  
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          const displayName = user.displayName;
          console.log("Current user name:", displayName);
        } else {
          // No user is signed in
          console.log("No user is signed in.");
        }
      });
      return auth.currentUser?.displayName ?? "Anonymous";
    };
    for (const post of postsList) {
      console.log(post.id);
    }
    const handleDeletePost = async (postId: string) => {
        try {
          const postRef = doc(db, 'posts', postId);
          await deleteDoc(postRef);
          console.log('Post deleted:', postId);
        } catch (error) {
          console.error('Error deleting post:', error);
        }
      };
  
    const postItems = postsList.map((post) => (
        
      <IonItem key={post.id}>
        <Post
          postId={post.id}
          content={post.content}
          author={post.author_name ?? "Anonymous"}
          timestamp={post.timestamp}
          onAddComment={handleAddComment}
          onDeletePost={handleDeletePost}
        />
      </IonItem>
    ));
  
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
              <IonTitle size="large">Home Page</IonTitle>
            </IonToolbar>
          </IonHeader>
          <NewPostForm onSubmit={handleCreatePost} getCurrentUserName={getCurrentUserName} />
          <IonList>
            {!postItems && <IonItem> No posts found </IonItem>}
            {postItems}
          </IonList>
          <IonButton routerLink="/add-post">Add Post</IonButton>
        </IonContent>
      </IonPage>
    );
  };
  
  export default HomePage;