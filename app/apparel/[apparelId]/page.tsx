'use client';
import ErrorComponent from '@/app/components/ErrorComponent/ErrorComponent';
import LoadingComponent from '@/app/components/LoadingComponent/LoadingComponent';
import {
  deleteApparel,
  fetchAllApparel,
} from '@/lib/features/apparel/apparelSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

const ApparelItemPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const apparelId = params.apparelId;
  const router = useRouter();

  const { items, status } = useAppSelector((state) => state.apparel);
  const apparelItem = Object.values(
    useAppSelector((state) => state.apparel.items)
  )
    .flat()
    .find((item) => item.id === apparelId);

  const handleDeleteApparel = async (id: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this apparel item? This action can't be undone.`
    );
    if (confirmDelete) {
      await toast.promise(
        dispatch(deleteApparel(id))
          .unwrap()
          .finally(() => {
            router.push('/');
          }),
        {
          pending: 'Deleting this apparel, please wait.',
          success:
            'Apparel deleted successfully, redirecting you to home page.',
          error: {
            render({ data }: any) {
              return `Error deleting apparel: ${data?.error || data}`;
            },
          },
        }
      );
    }
  };

  useEffect(() => {
    if (
      status === 'idle' ||
      (status === 'succeeded' &&
        !Object.values(items).some((category) => category.length > 0))
    ) {
      dispatch(fetchAllApparel());
    }
  }, [dispatch, status, items]);

  return (
    <>
      {(status === 'idle' || status === 'loading') && <LoadingComponent />}
      {status === 'failed' && <ErrorComponent />}
      {status === 'succeeded' && !apparelItem && (
        <div className='flex flex-col items-center justify-center min-h-screen bg-palette-3 p-4'>
          <div className='text-center max-w-md space-y-6'>
            <h1 className='text-2xl font-bold text-palette-2'>
              Apparel Item Not Found
            </h1>
            <p className='text-palette-2'>
              The apparel item you are looking for does not exist or has been
              removed.
            </p>
            <button className='bg-palette-1 text-white p-3 rounded-lg hover:bg-palette-5 transition-colors'>
              <Link href='/apparel'>Return to Apparel</Link>
            </button>
          </div>
        </div>
      )}
      {status === 'succeeded' && apparelItem && (
        <div className='bg-palette-3 min-h-screen py-6 px-4 flex md:pt-9 justify-center'>
          <div className='w-full md:h-3/4 max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row'>
            <div className='block md:hidden p-6'>
              <h1 className='text-3xl font-bold text-palette-2 mb-4'>
                {apparelItem.title}
              </h1>
              {apparelItem.description && (
                <p className='text-palette-5 mb-6 italic'>
                  {apparelItem.description}
                </p>
              )}
            </div>
            <div className='md:w-2/3 relative h-[500px] bg-palette-4/10'>
              <Image
                src={apparelItem.pictureURL}
                alt={apparelItem.title}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='object-contain object-center p-6'
              />
            </div>
            <div className='md:w-1/3 p-8 flex flex-col justify-between md:justify-normal'>
              <div className='hidden md:block'>
                <h1 className='text-3xl font-bold text-palette-2 mb-4'>
                  {apparelItem.title}
                </h1>
                {apparelItem.description && (
                  <p className='text-palette-5 mb-6 italic'>
                    {apparelItem.description}
                  </p>
                )}
                <div className='rounded-lg p-4 mb-6'>
                  <span className='block text-palette-2 font-semibold mb-2'>
                    Type
                  </span>
                  <span className='text-palette-5'>{apparelItem.type}</span>
                </div>
              </div>
              <div className='flex flex-col space-y-4'>
                <button
                  onClick={() => handleDeleteApparel(apparelItem.id)}
                  className='w-full px-4 py-3 bg-palette-4 hover:bg-palette-2 rounded-lg text-white transition-colors'
                >
                  Delete Apparel Item
                </button>
                <button
                  onClick={() => router.push('/')}
                  className='w-full px-4 py-3 bg-palette-5 text-white rounded-lg hover:bg-palette-2 transition-colors'
                >
                  Back to home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApparelItemPage;
