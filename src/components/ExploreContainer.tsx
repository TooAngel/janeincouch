import React from 'react';
import './ExploreContainer.css';
import { IonButton } from '@ionic/react';

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {


  const joinGame = () => {
    console.log('b');
  }

  return (
    <div className="container">
      <strong>Ready to create an app?</strong>
      <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>

      <IonButton routerLink="/createGame">Spiel erstellen</IonButton>
      <IonButton color="secondary" onClick={() => joinGame()}>Spiel beitreten</IonButton>
    </div>
  );
};

export default ExploreContainer;
