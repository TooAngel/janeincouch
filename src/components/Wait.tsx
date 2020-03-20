import React from 'react';
import './ExploreContainer.css';

interface GameNamePageProps {
  gameName: string | undefined;
  setGameName(arg0: string): void;
  setCreated(arg0: boolean): void;
};

const GameName: React.FC = () => {

  return (
    <div className="container">
      Wait
    </div>
  );
};

export default GameName;
