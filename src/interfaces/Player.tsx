import { Team } from './Team';
import { Role } from './State';
import { DataConnection } from 'peerjs';

export interface Player {
  id: string;
  team: Team;
  role: Role;
  leader: boolean;
  score: number;
  peerId: string;
  srcObject: MediaStream | null;
  connection: DataConnection | null;
}
