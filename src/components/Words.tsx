import React from 'react';
import { IonGrid, IonCol, IonRow, IonCard, IonCardContent } from '@ionic/react';
import { Word } from '../interfaces/Word'
import './Words.css'

interface WordsProps {
  words: Word[];
}

const Words: React.FC<WordsProps> = (props) => {

  let active: any;
  for (let word of props.words) {
    if (word.active) {
      active = (
        <IonCol size="12">
          <IonCard color="warning">
            <IonCardContent class="activeWord">
              {word.word}
            </IonCardContent>
          </IonCard>
        </IonCol>
      );
    }
  }

  return (
    <IonGrid>
      <IonRow>
        {active}
      </IonRow>
    </IonGrid>
  );
};

export default Words;
