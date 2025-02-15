export type GameStatus =
  | "available"
  | "reserved"
  | "borrowed"
  | "maintenance"
  | "retired";
export interface Game {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  playTime: string | null;
  recommendedAge: string | null;
  complexityRating: number | null;
  status: GameStatus;
  conditionNotes: string | null;
}
