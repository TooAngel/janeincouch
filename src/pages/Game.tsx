import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';

import './Game.css';

import Players from '../components/Players';
import { Player, Team } from '../interfaces/State'

interface GameProps extends RouteComponentProps<{
  id: string;
}> {}

let ps: Player[] = [];
ps.push({id: "1", team: Team.red});
ps.push({id: "2", team: Team.red});
ps.push({id: "3", team: Team.red});
ps.push({id: "4", team: Team.blue});
ps.push({id: "5", team: Team.blue});
ps.push({id: "6", team: Team.blue});

const Game: React.FC<GameProps> = ({match}) => {
  const [players, setPlayers] = useState<Player[]>(ps);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>GameID {match.params.id}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <Players players={players}/>
      </IonContent>
    </IonPage>
  );
};

export default Game;
