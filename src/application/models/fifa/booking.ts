export default interface Booking {
  Card: number;
  Period: number;
  IdEvent: string | null;
  EventNumber: string | null;
  IdPlayer: string;
  IdCoach: string;
  IdTeam: string;
  Minute: string;
  Reason: string;
}
