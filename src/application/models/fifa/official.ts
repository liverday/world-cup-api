import Localized from './locale';

export default interface Official {
  IdCountry: string;
  OfficialId: string;
  Name: Localized[];
  OfficialType: number;
  TypeLocalized: [];
}
