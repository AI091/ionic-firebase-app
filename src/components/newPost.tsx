import { IonButton, IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/react';
import './NewPostForm.css';
import React, { useState } from 'react';

interface NewPostFormProps {
  onSubmit: (title: string, content: string) => void;
}

const NewPostForm: React.FC<NewPostFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit(title, content);
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="new-post-form">
      <IonItem>
        <IonLabel position="floating">Title</IonLabel>
        <IonInput
          value={title}
          onIonChange={(e) => setTitle(e.detail.value!)}
          type="text"
          clearInput
        />
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Content</IonLabel>
        <IonTextarea
          value={content}
          onIonChange={(e) => setContent(e.detail.value!)}
          rows={6}
          clearOnEdit
        />
      </IonItem>
      <IonButton expand="block" onClick={handleSubmit}>
        Submit
      </IonButton>
    </div>
  );
};

export default NewPostForm;