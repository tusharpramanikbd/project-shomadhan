import { TDistrict, TDivision, TUpazila } from '@/types/geoLocationType';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

const baseGeoApiUrl = 'https://bdapis.vercel.app/geo/v2.0';

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

type UseGeoLocationProps = {
  watch: (name: 'division' | 'district') => string;
  resetField: (name: 'district' | 'upazila') => void;
};

// Fetcher functions
const fetchDistricts = async (divisionId: string) => {
  const res = await axios.get(`${baseGeoApiUrl}/districts/${divisionId}`);
  return res.data.data as TDistrict[];
};

const fetchUpazilas = async (districtId: string) => {
  const res = await axios.get(`${baseGeoApiUrl}/upazilas/${districtId}`);
  return res.data.data as TUpazila[];
};

const useGeoLocation = ({ watch, resetField }: UseGeoLocationProps) => {
  const selectedDivision = watch('division');
  const selectedDistrict = watch('district');

  // Fetching districts (only when division is selected)
  const { data: districts = [], isFetching: isDistrictLoading } = useQuery({
    queryKey: ['districts', selectedDivision],
    queryFn: () => fetchDistricts(selectedDivision!),
    enabled: !!selectedDivision, // prevents fetching when empty
  });

  // Fetching upazilas (only when district is selected)
  const { data: upazilas = [], isFetching: isUpazilaLoading } = useQuery({
    queryKey: ['upazilas', selectedDistrict],
    queryFn: () => fetchUpazilas(selectedDistrict!),
    enabled: !!selectedDistrict,
  });

  // Resetting dependent fields
  useEffect(() => {
    resetField('district');
    resetField('upazila');
  }, [selectedDivision, resetField]);

  useEffect(() => {
    resetField('upazila');
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
