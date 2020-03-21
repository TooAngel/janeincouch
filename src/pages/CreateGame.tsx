import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import './Home.css';
import GameName from '../components/GameName';
import Wait from '../components/Wait';

const CreateGame: React.FC = () => {
  const [gameName, setGameName] = useState<string>();
  const [created, setCreated] = useState<boolean>();

  let main;
  if (created) {
    main = <Wait />;
  } else {
    main = <GameName gameName={gameName} setGameName={setGameName} setCreated={setCreated}/>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>CreateGame Blank {created}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Couchallenge</IonTitle>
          </IonToolbar>
        </IonHeader>
        { main }
      </IonContent>
    </IonPage>
  );
};

export default CreateGame;
