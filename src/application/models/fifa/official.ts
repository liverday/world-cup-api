import Localized from './locale';

export default interface Official {
  IdCountry: string;
  OfficialId: string;
  Name: Localized[];
  OfficialType: number;
  TypeLocalized: Localized[];
}

export type OfficialResponse = {
  name: string;
  country: string;
  role: string;
};
