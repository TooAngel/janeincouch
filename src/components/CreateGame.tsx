import React from 'react';
import { IonButton } from '@ionic/react';

function getRandomID(): string {
  // non ambiguous characters only
  const chars: string = 'abcdefghkmnopqrstuvwxyz'

  let id: string = ""
  for (var b = 0; b < 3; b++) {
    for (var c = 0; c < 3; c++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (b < 2) {
      id += "-"
    }
  }

  return id
}

const CreateGame: React.FC = () => {

  let id: string = getRandomID()
  let link: string = `/game/${id}/leader`;

  return (
    <IonButton color="primary" expand="full" size="default" routerLink={link}>Neues Spiel</IonButton>
  );
};

export default CreateGame;
