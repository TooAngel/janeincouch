import React from 'react';
import { IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { pizzaOutline, fastFoodOutline } from 'ionicons/icons'
import './Scores.css';

import { Player } from '../interfaces/Player'
import { Team } from '../interfaces/Team'

interface ScoresProps {
  players: Player[];
}

const Scores: React.FC<ScoresProps> = (props) => {

  let scores: number[] = [0, 0];
  for (let player of props.players) {
    let teamScore = scores[player.team];
    scores[player.team] = teamScore + player.score;
  }

  let teamRedClass = "teamscore text-align-right";
  let teamBlueClass = "teamscore text-align-left";

  if (scores[Team.red] > scores[Team.blue]) {
    teamRedClass = "teamscore text-align-left winning";
    teamBlueClass = "teamscore text-align-right losing";
  } else {
    teamRedClass = "teamscore text-align-left losing";
    teamBlueClass = "teamscore text-align-right winning";
  }

  return (
    <IonGrid>
      <IonRow>
        <IonCol key="teamredicon" size="2">
          <IonIcon className="teamicon text-align-left" color="dark" icon={pizzaOutline} />
        </IonCol>
        <IonCol key="teamred" size="4">
          <div className={teamRedClass}>
            {scores[Team.red]}
          </div>
        </IonCol>
        <IonCol key="teamblue" size="4">
          <div className={teamBlueClass}>
            {scores[Team.blue]}
          </div>
        </IonCol>
        <IonCol key="teamblueicon" size="2">
          <IonIcon className="teamicon text-align-right" color="dark" icon={fastFoodOutline} />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default Scores;
