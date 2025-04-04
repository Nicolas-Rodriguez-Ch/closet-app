export enum ApparelTypeEnum {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  SHOES = 'SHOES',
  COAT = 'COAT',
}
export interface ApparelForm {
  apparelTitle: string;
  apparelDescription?: string;
  apparelType: ApparelTypeEnum;
}
