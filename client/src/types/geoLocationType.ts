type TGeoEntity<Name extends string> = {
  id: string;
  name: string;
  bn_name: string;
  type?: Name; // Helpful for distinguishing entity types if needed
};

export type TDivision = TGeoEntity<'division'>;
export type TDistrict = TGeoEntity<'district'>;
export type TUpazila = TGeoEntity<'upazila'>;
