import React, { useState } from 'react';
import { IonButton, IonPopover, IonInput } from '@ionic/react';

const JoinGame: React.FC = () => {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [gameID, setGameID] = useState<string>("");

  let link: string = `/game/${gameID}`;

  return (
    <>
      <IonPopover isOpen={showPopover} onDidDismiss={e => setShowPopover(false)} showBackdrop={true}>
        <IonInput value={gameID} placeholder="Enter invite code" onIonChange={e => setGameID(e.detail.value!)}></IonInput>
        <IonButton color="primary" expand="full" size="default" routerLink={link}>Beitreten</IonButton>
      </IonPopover>
      <IonButton color="secondary" expand="full" size="default" onClick={() => setShowPopover(true)}>Einladungscode</IonButton>
    </>
  );
};

export default JoinGame;
