import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth , email, password);
      console.log("Login successful");
      
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div>
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
      <IonButton expand="block" onClick={handleLogin}>
        Login
      </IonButton>
    </div>
  );
};

export default LoginPage;