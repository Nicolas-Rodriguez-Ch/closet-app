'use client';
import { OutfitItemProps } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

const OutfitItem = ({ item }: OutfitItemProps) => {
  return (
    <div key={item.id}>
      <Link href={`/outfit/${item.id}`}>
        <h1>{item.title}</h1>
        {item.description ? <h2>{item.description}</h2> : null}
        {item.coatID ? (
          <Image
            src={item.coatID.pictureURL}
            alt={item.coatID.title}
            width={100}
            height={100}
          />
        ) : null}
        <>
          <Image
            src={item.topID.pictureURL}
            alt={item.topID.title}
            width={100}
            height={100}
          />
          <Image
            src={item.bottomID.pictureURL}
            alt={item.bottomID.title}
            width={100}
            height={100}
          />
          <Image
            src={item.shoesID.pictureURL}
            alt={item.shoesID.title}
            width={100}
            height={100}
          />
        </>
      </Link>
    </div>
  );
};

export default OutfitItem;
