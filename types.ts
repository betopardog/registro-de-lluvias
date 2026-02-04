
export interface RainfallRecord {
  id: string;
  date: string;
  amount: number; // in mm
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  notes?: string;
  imageUrl?: string; // Almacenará la imagen en base64
}

export interface WeatherInsight {
  analysis: string;
  recommendation: string;
  sources: { title: string; uri: string }[];
}

export type ViewType = 'dashboard' | 'history' | 'ai-chat';

export interface AuthState {
  isAdmin: boolean;
}
