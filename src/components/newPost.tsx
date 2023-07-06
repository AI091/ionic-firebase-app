import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
} from "@ionic/react";
// import './NewPostForm.css';
import React, { useState } from "react";

interface NewPostFormProps {
  getCurrentUserName: () => string;
  onSubmit: (title: string, content: string) => void;
}

const NewPostForm: React.FC<NewPostFormProps> = ({
  getCurrentUserName,
  onSubmit,
}) => {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = () => {
    if (content.trim()) {
      setAuthor(getCurrentUserName());
      onSubmit(author, content);
    }
  };

  return (
    <div className="new-post-form">

      <IonItem>
        <IonLabel position="floating">New post</IonLabel>
        <IonTextarea
          value={"Write a new post here..."}
          onIonChange={(e) => setContent(e.detail.value!)}
          rows={6}
          clearOnEdit
        />
      </IonItem>
      <IonButton expand="block" onClick={handleSubmit}>
        Submit Post 
      </IonButton>
    </div>
  );
};

export default NewPostForm;
