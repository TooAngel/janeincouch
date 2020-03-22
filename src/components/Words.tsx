import React from 'react';
import { IonGrid, IonCol, IonRow, IonCard, IonCardContent } from '@ionic/react';
import './Words.css'

interface WordsProps {
  word: string;
}

const Words: React.FC<WordsProps> = (props) => {

  let active = (
    <IonCol size="12">
      <IonCard color="warning">
        <IonCardContent class="activeWord">
          {props.word}
        </IonCardContent>
      </IonCard>
    </IonCol>
  );

  return (
    <IonGrid>
      <IonRow>
        {active}
      </IonRow>
    </IonGrid>
  );
};

export default Words;
