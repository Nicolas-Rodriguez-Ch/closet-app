export interface IApparel {
  id: string;
  title: string;
  pictureURL: string;
  type: 'TOP' | 'BOTTOM' | 'SHOES' | 'COAT';
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
