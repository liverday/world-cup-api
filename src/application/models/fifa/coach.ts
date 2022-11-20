import Localized from './locale';

export default interface Coach {
  IdCoach: string;
  IdCountry: string;
  PictureUrl: string;
  Name: Localized[];
  Alias: Localized[];
  Role: number;
  SpecialStatus: any;
}
