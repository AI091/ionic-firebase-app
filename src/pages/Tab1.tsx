import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import React , {useState , useEffect} from 'react';
import {db} from '../../config/firebase';
import { collection, getDocs  , query} from 'firebase/firestore';

interface Comment {
  id: string;
  content : string;
} 
interface Post {
  id: string;
  content : string;  
  comments : Comment[];
}


const Tab1: React.FC = () => {
  const [postsList , setPostsList] = useState<Post[]>([])
  useEffect(() => {
    async function fetchData() {
      const postsCollection = collection(db, 'posts');
      const postsQuery = query(postsCollection);

      const postDocs = await getDocs(postsQuery);

      const posts = await Promise.all(postDocs.docs.map(async (doc) => {
        const post ={id:doc.id ,  ...doc.data()} as Post;

        const commentsCollection = collection(db, 'posts', doc.id, 'comments');
        const commentsQuery = query(commentsCollection);

        const commentDocs = await getDocs(commentsQuery);

        const comments: Comment[] = commentDocs.docs.map((commentDoc) => {
          return { id: commentDoc.id, ...commentDoc.data() } as Comment;
        });

        post.comments = comments;
        return post;
      }));

      // Update the state with the new post data
      setPostsList(posts);
      console.log(posts);
    }

    fetchData();
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
        <ExploreContainer name="Tab 1 page" />
        {postItems}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
