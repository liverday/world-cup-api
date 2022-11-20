export default interface Goal {
  Type: number;
  IdPlayer: number;
  Minute: string;
  IdAssistPlayer: number | null;
  Period: string;
  IdGoal: string | null;
  IdTeam: string;
}
