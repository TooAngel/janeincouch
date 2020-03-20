import React from 'react';
import './ExploreContainer.css';
import { IonButton, IonInput } from '@ionic/react';

interface GameNamePageProps {
  gameName: string | undefined;
  setGameName(arg0: string): void;
  setCreated(arg0: boolean): void;
};

const GameName: React.FC<GameNamePageProps> = (props) => {

  return (
    <div className="container">
      <IonInput value={props.gameName} placeholder="Spielname" onIonChange={e => props.setGameName(e.detail.value!)}></IonInput>
      <IonButton onClick={() => props.setCreated(true)}>Spiel erstellen</IonButton>
    </div>
  );
};

export default GameName;
