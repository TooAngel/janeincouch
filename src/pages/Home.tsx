import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import CreateGame from '../components/CreateGame';
import JoinGame from '../components/JoinGame';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Couchallenge</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <img src="/assets/logo.svg" alt="logo" width="100%" />
        <CreateGame />
        <JoinGame />
        <a href="https://github.com/TooAngel/couchallenge"><img src="/assets/github.svg" alt="github" width="50px" /></a>
        <a href="https://discord.gg/dQkFVQm"><img src="/assets/Discord-Logo-Black.svg" alt="discord" width="50px" /></a>
      </IonContent>
    </IonPage>
  );
};

export default Home;
