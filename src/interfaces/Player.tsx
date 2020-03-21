import { Team } from './Team'
import { Role } from './State'

export interface Player {
  id: string;
  team: Team;
  role: Role;
  score: number;
}
