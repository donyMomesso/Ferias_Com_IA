export type CommunitySuggestion = {
  grupos: Array<{
    categoria: string;
    sugestao: string;
    motivo: string;
  }>;
  eventos: Array<{
    tipo: string;
    descricao: string;
    dica: string;
  }>;
};

export type CommunityGroupCard = {
  id: string;
  name: string;
  description: string;
  category: string;
  city: string;
  state?: string | null;
  coverImage?: string | null;
  isPrivate: boolean;
  memberCount: number;
  nextEvent?: {
    id: string;
    title: string;
    date: string;
  };
};

export type CommunityEventCard = {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string | null;
  isOnline: boolean;
  price: number;
  coverImage?: string | null;
  rsvpCount: number;
  group: {
    id: string;
    name: string;
    category: string;
    city: string;
  };
};
