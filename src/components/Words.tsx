import React from 'react';
import { IonGrid, IonCol, IonRow } from '@ionic/react';
import { Word } from '../interfaces/Word'

interface WordsProps {
  words: Word[];
}

const Words: React.FC<WordsProps> = (props) => {

  let active: any;
  for (let word of props.words) {
    if (word.active) {
      active = (
          <IonCol size="12">{word.word}</IonCol>
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
