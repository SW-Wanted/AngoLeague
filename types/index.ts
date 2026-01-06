export enum Modality {
  FUTSAL = "Futsal",
  SALAO = "Salão",
  CAMPO = "Campo",
}

export enum Position {
  GK = "Guarda-Redes",
  DEF = "Defesa",
  MID = "Médio",
  ATT = "Avançado",
}

export enum MatchType {
  OFFICIAL = "Oficial",
  FRIENDLY = "Amistoso",
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  modality?: Modality;
  position?: Position;
  province?: string;
  municipality?: string;
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  locality: string;
  captainId: string;
  members: string[]; // User IDs
  wins: number;
  losses: number;
  draws: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface Match {
  id: string;
  type: MatchType;
  teamA: string; // Team ID or "Provisional A"
  teamB: string; // Team ID or "Provisional B"
  date: string;
  location: string;
  scoreA?: number;
  scoreB?: number;
  status: "SCHEDULED" | "FINISHED" | "CANCELLED";
}

export interface RecruitmentPost {
  id: string;
  teamId: string;
  teamName: string;
  positionNeeded: Position;
  description: string;
  date: string;
}
