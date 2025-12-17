import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type TabParamList = {
  index: undefined;
  'report-list': undefined;
  map: undefined;
  profile: undefined;
};

// export type ReportParamList = {
//   add: undefined;
//   success: undefined;
//   [id: string]: { id: string };
// };

export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<TabParamList, T>;