import { TDistrict, TDivision, TUpazila } from '@/types/geoLocationType';
import axios from 'axios';
import { useEffect, useState } from 'react';

const divisions: TDivision[] = [
  {
    id: '1',
    name: 'Chattagram',
    bn_name: 'চট্টগ্রাম',
  },
  {
    id: '2',
    name: 'Rajshahi',
    bn_name: 'রাজশাহী',
  },
  {
    id: '3',
    name: 'Khulna',
    bn_name: 'খুলনা',
  },
  {
    id: '4',
    name: 'Barisal',
    bn_name: 'বরিশাল',
  },
  {
    id: '5',
    name: 'Sylhet',
    bn_name: 'সিলেট',
  },
  {
    id: '6',
    name: 'Dhaka',
    bn_name: 'ঢাকা',
  },
  {
    id: '7',
    name: 'Rangpur',
    bn_name: 'রংপুর',
  },
  {
    id: '8',
    name: 'Mymensingh',
    bn_name: 'ময়মনসিংহ',
  },
];

const baseGeoApiUrl = 'https://bdapis.vercel.app/geo/v2.0';

type UseGeoLocationProps = {
  selectedDivision: string;
  selectedDistrict: string;
  resetField: (name: 'district' | 'upazila') => void;
};

const useGeoLocation = ({
  selectedDivision,
  selectedDistrict,
  resetField,
}: UseGeoLocationProps) => {
  const [districts, setDistricts] = useState<TDistrict[]>([]);
  const [upazilas, setUpazilas] = useState<TUpazila[]>([]);
  const [isDistrictLoading, setDistrictLoading] = useState(false);
  const [isUpazilaLoading, setUpazilaLoading] = useState(false);

  // When division changes → fetch districts
  useEffect(() => {
    if (!selectedDivision) {
      setDistricts([]);
      setUpazilas([]);
      resetField('district');
      resetField('upazila');
      return;
    }

    setDistrictLoading(true);
    setUpazilas([]);
    resetField('district');
    resetField('upazila');

    axios
      .get(`${baseGeoApiUrl}/districts/${selectedDivision}`)
      .then((res) => setDistricts(res.data.data))
      .catch(() => setDistricts([]))
      .finally(() => setDistrictLoading(false));
  }, [selectedDivision, resetField]);

  // When district changes → fetch upazilas
  useEffect(() => {
    if (!selectedDistrict) {
      setUpazilas([]);
      resetField('upazila');
      return;
    }

    setUpazilaLoading(true);
    resetField('upazila');

    axios
      .get(`${baseGeoApiUrl}/upazilas/${selectedDistrict}`)
      .then((res) => setUpazilas(res.data.data))
      .catch(() => setUpazilas([]))
      .finally(() => setUpazilaLoading(false));
  }, [selectedDistrict, resetField]);

  return {
    divisions,
    districts,
    upazilas,
    isDistrictLoading,
    isUpazilaLoading,
  };
};

export default useGeoLocation;
