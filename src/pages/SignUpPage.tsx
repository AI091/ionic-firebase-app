import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';
import { useState } from 'react';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [displayName, setDisplayName] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
        alert("Passwords don't match");
        return;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(auth , email, password);
      if (user) {
        await updateProfile(user,{ displayName: displayName });
      }
      

    } catch (error) {
      console.error('SignUp error:', error);
    }
  };

  return (
    <div>
      <IonItem>
        <IonLabel position="floating">Display Name</IonLabel>
        <IonInput
          value={displayName}
          onIonChange={(e) => setDisplayName(e.detail.value!)}
          type="text"
        />
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Email</IonLabel>
        <IonInput
          value={email}
          onIonChange={(e) => setEmail(e.detail.value!)}
          type="email"
        />
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Password</IonLabel>
        <IonInput
          value={password}
          onIonChange={(e) => setPassword(e.detail.value!)}
          type="password"
        />
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Confirm Password</IonLabel>
        <IonInput
          value={confirmPassword}
          onIonChange={(e) => setConfirmPassword(e.detail.value!)}
          type="password"
        />
      </IonItem>
      <IonButton expand="block" onClick={handleSignUp}>
        Sign Up
      </IonButton>
    </div>
  );
};

export default SignUpPage;