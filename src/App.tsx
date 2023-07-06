import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

import { auth } from '../config/firebase';
import { useAuth } from 'firebase-react-tools';
import {app} from '../config/firebase';
import HomePage from './pages/HomePage';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

setupIonicReact();


const App: React.FC = () => {  
  const [user, setUser] = useState<User|null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth , (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  
  
  
  
  return (
  
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/login">
            {!user?<LoginPage  /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/signup">
          {!user ? <SignUpPage /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/">
            {user ? <HomePage /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/home">
            {user ? <HomePage /> : <Redirect to="/login" />}
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>Tab 1</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Tab 2</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Tab 3</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);}

export default App;