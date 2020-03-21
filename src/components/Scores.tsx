import React, { useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';

import { Player } from '../interfaces/Player'
import { Role } from '../interfaces/State'

interface ScoresProps {
  players: Player[];
}

const Scores: React.FC<ScoresProps> = (props) => {

  let scores: number[] = [];
  for (let player of props.players) {
    let teamScore = scores[player.team];
    if (Number.isNaN(teamScore)) {
      teamScore = 0;
    }
    scores[player.team] = teamScore + player.score;
  }

  let scoreCols = []
  for (let team in scores) {
    scoreCols.push(<IonCol key={team}>{scores[team]}</IonCol>);
  }

  return (
    <IonGrid>
      <IonRow>
        {scoreCols}
      </IonRow>
    </IonGrid>
  );
};

export default Scores;
