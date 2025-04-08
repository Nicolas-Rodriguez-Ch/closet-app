'use client';
import { fetchAllApparel } from '@/lib/features/apparel/apparelSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import ErrorComponent from '../ErrorComponent/ErrorComponent';
import CarouselComponent from '../CarouselComponent/CarouselComponent';
import { CreateOutfitPayload } from '@/lib/types';
import { createOutfit } from '@/lib/features/outfit/outfitSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const CarouselWrapper = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, status } = useAppSelector((state) => state.apparel);
  const [showCoats, setShowCoats] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    outfitTitle?: string;
    outfitTags?: string;
  }>({});
  const [oufitAdditionalInfo, setOutfitAdditionalInfo] = useState<{
    outfitTitle: string;
    outfitTags: string;
    outfitDescription?: string;
  }>({
    outfitTitle: '',
    outfitTags: '',
    outfitDescription: '',
  });

  const activeIndicesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    dispatch(fetchAllApparel());
  }, [dispatch]);

  useEffect(() => {
    if (!showCoats && 'COAT' in activeIndicesRef.current) {
      const newIndices = { ...activeIndicesRef.current };
      delete newIndices['COAT'];
      activeIndicesRef.current = newIndices;
    }
  }, [showCoats]);

  const toggleCoats = () => {
    setShowCoats((prev) => !prev);
  };

  const handleIndexChange = (category: string, index: number) => {
    activeIndicesRef.current[category] = index;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOutfitAdditionalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setOutfitAdditionalInfo({
      outfitTitle: '',
      outfitTags: '',
      outfitDescription: '',
    });
    setFormErrors({});
  };

  const createOutfitBtn = () => {
    setShowModal(true);
  };

  const handleCreateOutfit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: {
      outfitTitle?: string;
      outfitTags?: string;
    } = {};

    if (!oufitAdditionalInfo.outfitTitle.trim()) {
      errors.outfitTitle = 'Outfit title is required';
    } else if (oufitAdditionalInfo.outfitTitle.length < 3) {
      errors.outfitTitle = 'Title must be at least 3 characters long';
    } else if (oufitAdditionalInfo.outfitTitle.length > 50) {
      errors.outfitTitle = 'Title cannot exceed 50 characters';
    }
    const tags = oufitAdditionalInfo.outfitTags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (tags.length === 0) {
      errors.outfitTags = 'At least one tag is required';
    } else if (tags.some((tag) => tag.length < 2)) {
      errors.outfitTags = 'Each tag must be at least 2 characters long';
    } else if (tags.length > 5) {
      errors.outfitTags = 'Maximum 5 tags allowed';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const renderedCategories = Object.entries(items)
      .filter(([category]) => category !== 'COAT' || showCoats)
      .map(([category]) => category);

    const currentOutfit = Object.fromEntries(
      Object.entries(activeIndicesRef.current).filter(([category]) =>
        renderedCategories.includes(category)
      )
    );

    const body: CreateOutfitPayload = {
      ...(currentOutfit.COAT !== undefined && {
        coatID: items.COAT[currentOutfit.COAT].id,
      }),
      topID: items.TOP[currentOutfit.TOP].id,
      bottomID: items.BOTTOM[currentOutfit.BOTTOM].id,
      shoesID: items.SHOES[currentOutfit.SHOES].id,
      title: oufitAdditionalInfo.outfitTitle,
      tags,
      description: oufitAdditionalInfo.outfitDescription,
    };
    if (!body.description) delete body.description;

    await toast.promise(
      dispatch(createOutfit(body))
        .unwrap()
        .finally(() => {
          setOutfitAdditionalInfo({
            outfitTitle: '',
            outfitTags: '',
            outfitDescription: '',
          });
          setShowModal(false);
          router.push('/outfits');
        }),
      {
        pending: 'Creating your outfit',
        success: 'Outfit created successfully!',
        error: {
          render({ data }: any) {
            return `Error creating outfit: ${data?.error || data}`;
          },
        },
      }
    );
  };

  return (
    <div className='bg-palette-3'>
      {(status === 'idle' || status === 'loading') && <LoadingComponent />}{' '}
      {status === 'failed' && <ErrorComponent />}
      {status === 'succeeded' && (
        <>
          <button
            onClick={toggleCoats}
            className='bg-palette-1 text-white p-2 rounded-full text-sm shadow-md hover:bg-palette-5 transition-colors duration-300 ease-in-out self-start m-2 md:absolute md:top-[initial] md:left-[initial] sm:p-3 sm:text-base'
          >
            {showCoats ? 'Hide Coats' : 'Show Coats'}
          </button>
          <div className='md:grid md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:gap-4'>
            {Object.entries(items)
              .filter(([category]) => category !== 'COAT' || showCoats)
              .map(([category, categoryItems]) => (
                <CarouselComponent
                  key={category}
                  category={category}
                  item={categoryItems}
                  onIndexChange={(index) => {
                    handleIndexChange(category, index);
                  }}
                />
              ))}
          </div>
          <div className='flex justify-center'>
            <button
              onClick={createOutfitBtn}
              className='bg-palette-1 text-white p-4 mb-4 rounded-4xl hover:bg-palette-5 transition-colors font-bold'
            >
              Create this outfit!
            </button>
          </div>
          {showModal ? (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-palette-2/50'>
              <div className='w-11/12 max-w-md p-6 rounded-xl bg-palette-3 backdrop-blur-lg border border-white/30 shadow-2xl relative'>
                <form onSubmit={handleCreateOutfit} className='space-y-5'>
                  <div className='bg-white p-4 rounded-xl shadow-sm'>
                    <label
                      htmlFor='outfitTitle'
                      className='block text-palette-2 font-semibold mb-2'
                    >
                      Add a title for this Outfit
                      <span className='text-palette-5'>*</span>
                    </label>
                    <input
                      type='text'
                      required
                      name='outfitTitle'
                      id='outfitTitle'
                      value={oufitAdditionalInfo.outfitTitle}
                      placeholder='Comfortable outerwear'
                      onChange={handleChange}
                      className='w-full p-2 rounded-md bg-white/50 border border-palette-4/50 focus:outline-none focus:ring-2 focus:ring-palette-5/50 text-palette-2 placeholder-palette-2/50 transition-all duration-200'
                    />
                    {formErrors.outfitTitle && (
                      <p className='text-red-500 text-sm mt-1'>
                        {formErrors.outfitTitle}
                      </p>
                    )}
                  </div>
                  <div className='bg-white p-4 rounded-xl shadow-sm'>
                    <label
                      htmlFor='outfitTags'
                      className='block text-palette-2 font-semibold mb-2'
                    >
                      Tags for this outfit, separate them with comma
                      <span className='text-palette-5'>*</span>
                    </label>
                    <input
                      type='text'
                      required
                      name='outfitTags'
                      id='outfitTags'
                      value={oufitAdditionalInfo.outfitTags}
                      placeholder='outdoors, comfortable, casual'
                      onChange={handleChange}
                      className='w-full p-2 rounded-md bg-white/50 border border-palette-4/50 focus:outline-none focus:ring-2 focus:ring-palette-5/50 text-palette-2 placeholder-palette-2/50 transition-all duration-200'
                    />
                    {formErrors.outfitTags && (
                      <p className='text-red-500 text-sm mt-1'>
                        {formErrors.outfitTags}
                      </p>
                    )}
                  </div>
                  <div className='bg-white p-4 rounded-xl shadow-sm'>
                    <label
                      htmlFor='outfitDescription'
                      className='block text-palette-2 font-semibold mb-2'
                    >
                      Add a description for this Outfit
                    </label>
                    <input
                      type='text'
                      name='outfitDescription'
                      id='outfitDescription'
                      value={oufitAdditionalInfo.outfitDescription}
                      placeholder='This is a comfortable outfit for sunny days.'
                      onChange={handleChange}
                      className='w-full p-2 rounded-md bg-white/50 border border-palette-4/50 focus:outline-none focus:ring-2 focus:ring-palette-5/50 text-palette-2 placeholder-palette-2/50 transition-all duration-200'
                    />
                  </div>
                  <div className='flex justify-between mt-6'>
                    <button
                      type='button'
                      onClick={closeModal}
                      className='px-4 py-2 rounded-full bg-palette-4/50 text-palette-2 hover:bg-palette-4 transition-colors'
                    >
                      Close
                    </button>
                    <button
                      type='submit'
                      className='px-4 py-2 rounded-full bg-palette-1 text-white hover:bg-palette-5 transition-colors'
                    >
                      Create outfit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default CarouselWrapper;
