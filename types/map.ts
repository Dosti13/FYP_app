export type AlertType = 'theft' | 'robbery' | 'suspicious';
export type AlertStatus = 'resolved' | 'active';

export interface MapControlsProps {
  onLocationPress: () => Promise<void>;
  onFilterPress: () => void;
  onRefreshPress: () => void;
  activeFilters: AlertType[];
}

export interface CustomMarkerProps {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  alertType: AlertType;
  timestamp: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  photos?: string[];
  status: AlertStatus;
  commentsCount: number;
  onPress: (id: string) => void;
}