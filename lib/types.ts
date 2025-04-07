import { ApparelTypeEnum } from '@/services/types';

export interface IApparel {
  id: string;
  title: string;
  pictureURL: string;
  type: ApparelTypeEnum;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApparelState {
  items: {
    TOP: IApparel[];
    BOTTOM: IApparel[];
    SHOES: IApparel[];
    COAT: IApparel[];
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
export interface IOutfit {
  id: string;
  title: string;
  description?: string;
  pictureURL?: string;
  topID: string;
  bottomID: string;
  shoesID: string;
  coatID?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  top?: IApparel;
  bottom?: IApparel;
  shoes?: IApparel;
  coat?: IApparel;
}

export interface CreateOutfitPayload {
  title: string;
  topID: string;
  bottomID: string;
  shoesID: string;
  coatID?: string;
  pictureURL?: string;
  tags: string[];
  description?: string;
}

export interface OutfitState {
  items: IOutfit[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface CarouselComponentProps {
  category: string;
  item: IApparel[];
  // In types.ts
  onIndexChange?: (index: number, category?: string) => void;
}
export interface ApparelSlideProps {
  imgSrc: string;
  title: string;
}
