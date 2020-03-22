import React from 'react';
import { IonProgressBar } from '@ionic/react';

interface HourglassProps {
  timeLeft: number;
}

const Hourglass: React.FC<HourglassProps> = (props) => {

  let percent = props.timeLeft / 300 * 10;

  return (
    <IonProgressBar value={percent}></IonProgressBar>
  );
};

export default Hourglass;
