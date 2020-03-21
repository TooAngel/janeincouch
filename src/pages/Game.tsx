import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';

import './Game.css';

import { Player } from '../interfaces/Player'
import { Team } from '../interfaces/Team'
import { Word } from '../interfaces/Word'
import { Role } from '../interfaces/State'

import Actions from '../components/Actions';
import Players from '../components/Players';
import Scores from '../components/Scores';
import Words from '../components/Words';

interface GameProps extends RouteComponentProps<{
  id: string;
}> {}

let ps: Player[] = [];
ps.push({id: "a", team: Team.red, role: Role.explaining, score: 0});
ps.push({id: "b", team: Team.red, role: Role.guessing, score: 0});
ps.push({id: "c", team: Team.red, role: Role.guessing, score: 0});
ps.push({id: "d", team: Team.blue, role: Role.watching, score: 0});
ps.push({id: "e", team: Team.blue, role: Role.watching, score: 0});
ps.push({id: "f", team: Team.blue, role: Role.watching, score: 0});



let ws: Word[] = [];
// p1
ws.push({playerID: "a", word: "hund", active: true})
ws.push({playerID: "a", word: "katze"})
ws.push({playerID: "a", word: "mause"})

// p2
ws.push({playerID: "b", word: "auto"})
ws.push({playerID: "b", word: "mopped"})
ws.push({playerID: "b", word: "rad"})

// p2
ws.push({playerID: "c", word: "tisch"})
ws.push({playerID: "c", word: "stuhl"})
ws.push({playerID: "c", word: "lampe"})

// p4
ws.push({playerID: "d", word: "baum"})
ws.push({playerID: "d", word: "blume"})
ws.push({playerID: "d", word: "strauch"})

// p5
ws.push({playerID: "e", word: "fenster"})
ws.push({playerID: "e", word: "tuer"})
ws.push({playerID: "e", word: "decke"})

// p6
ws.push({playerID: "f", word: "mond"})
ws.push({playerID: "f", word: "sonne"})
ws.push({playerID: "f", word: "sterne"})

const Game: React.FC<GameProps> = ({match}) => {
  const [currentPlayerID] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>(ps);
  const [words, setWords] = useState<Word[]>(ws);

  const myPlayer = (player: Player) => {
    console.log(player);
    players[currentPlayerID] = player;
    setPlayers(players);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>GameID {match.params.id}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Players players={players} />
        <Words words={words} />
        <Scores players={players} />
        <Actions player={players[currentPlayerID]} setPlayer={myPlayer} />
      </IonContent>
    </IonPage>
  );
};

export default Game;
