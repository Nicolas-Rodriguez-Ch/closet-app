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
        <div className='flex min-h-screen flex-col items-center justify-center bg-palette-3 px-4 py-6 sm:px-6'>
          <div className='max-w-md space-y-6 rounded-[1.5rem] border border-white/70 bg-white/80 p-6 text-center shadow-[0_18px_45px_rgba(79,64,54,0.12)] backdrop-blur-sm sm:p-8'>
            <h1 className='text-2xl font-bold text-palette-2'>
              Apparel Item Not Found
            </h1>
            <p className='text-palette-2'>
              The apparel item you are looking for does not exist or has been
              removed.
            </p>
            <button className='rounded-full bg-palette-1 px-4 py-3 text-white transition-colors hover:bg-palette-5'>
              <Link href='/apparel'>Return to Apparel</Link>
            </button>
          </div>
        </div>
      )}
      {status === 'succeeded' && apparelItem && (
        <div className='min-h-screen bg-palette-3 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10'>
          <article className='mx-auto w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/85 shadow-[0_24px_60px_rgba(79,64,54,0.14)] backdrop-blur-sm lg:grid lg:grid-cols-[1.3fr_0.7fr]'>
            <div className='border-b border-palette-4/30 bg-palette-4/10 p-5 sm:p-6 lg:hidden'>
              <h1 className='text-3xl font-bold text-palette-2'>
                {apparelItem.title}
              </h1>
              {apparelItem.description && (
                <p className='mt-3 text-palette-5 italic'>
                  {apparelItem.description}
                </p>
              )}
            </div>

            <div className='relative min-h-[22rem] bg-gradient-to-br from-white via-palette-3 to-palette-4/15 p-4 sm:min-h-[32rem] sm:p-6 lg:min-h-[44rem]'>
              <Image
                src={apparelItem.pictureURL}
                alt={apparelItem.title}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw'
                className='object-contain object-center p-3 sm:p-6'
              />
            </div>

            <div className='flex flex-col justify-between gap-6 p-5 sm:p-6 lg:p-8'>
              <div className='hidden lg:block'>
                <h1 className='text-3xl font-bold text-palette-2'>
                  {apparelItem.title}
                </h1>
                {apparelItem.description && (
                  <p className='mt-3 text-palette-5 italic'>
                    {apparelItem.description}
                  </p>
                )}
              </div>

              <div className='rounded-[1.25rem] border border-palette-4/30 bg-palette-4/10 p-4 sm:p-5'>
                <span className='block text-xs font-semibold uppercase tracking-[0.22em] text-palette-5'>
                  Type
                </span>
                <span className='mt-2 block text-lg font-semibold text-palette-2'>
                  {apparelItem.type}
                </span>
              </div>

              <div className='flex flex-col gap-4 sm:flex-row'>
                <button
                  onClick={() => handleDeleteApparel(apparelItem.id)}
                  className='w-full rounded-full bg-palette-4 px-4 py-3 text-white transition-colors hover:bg-palette-2'
                >
                  Delete Apparel Item
                </button>
                <button
                  onClick={() => router.push('/')}
                  className='w-full rounded-full bg-palette-5 px-4 py-3 text-white transition-colors hover:bg-palette-2'
                >
                  Back to home
                </button>
              </div>
            </div>
          </article>
        </div>
      )}
    </>
  );
};

export default ApparelItemPage;
