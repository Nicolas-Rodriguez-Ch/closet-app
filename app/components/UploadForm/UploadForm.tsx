'use client';

import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useState, useRef } from 'react';
import { ApparelForm, ApparelTypeEnum } from '../../../services/types';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { uploadApparel } from '@/lib/features/apparel/apparelSlice';

const UploadForm = () => {
  const dispatch = useAppDispatch();
  const uploadStatus = useAppSelector((state) => state.apparel.status);
  const isSubmitting = uploadStatus === 'loading';
  const router = useRouter();
  const [formData, setFormData] = useState<ApparelForm>({
    apparelTitle: '',
    apparelDescription: '',
    apparelType: ApparelTypeEnum.TOP,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const currentObjectUrl = useRef<string | null>(null);
  let imagePreviewUrl: string | null = null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      apparelType: value as ApparelTypeEnum,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (currentObjectUrl.current) {
      URL.revokeObjectURL(currentObjectUrl.current);
      currentObjectUrl.current = null;
    }

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        e.target.value = '';
        return;
      }

      setImageFile(file);

      if (validationErrors.imageFile) {
        setValidationErrors((prev) => {
          const updated = { ...prev };
          delete updated.imageFile;
          return updated;
        });
      }
    } else {
      setImageFile(null);
    }
  };

  const isFormValid = (): boolean => {
    const errors: Record<string, string> = {};

    if (!imageFile) {
      errors.imageFile = 'Please select an image';
    }
    if (!formData.apparelTitle.trim()) {
      errors.apparelTitle = 'Title is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid() || isSubmitting) {
      return;
    }

    try {
      if (imageFile) {
        await toast.promise(
          dispatch(
            uploadApparel({
              file: imageFile,
              formData: formData,
            })
          ).unwrap(),
          {
            pending: 'Uploading your Apparel Item',
            success: 'Apparel Item uploaded successfully!',
            error: {
              render({ data }: any) {
                return `Error uploading apparel item: ${data?.error || data}`;
              },
            },
          }
        );
        setFormData({
          apparelTitle: '',
          apparelDescription: '',
          apparelType: ApparelTypeEnum.TOP,
        });

        if (currentObjectUrl.current) {
          URL.revokeObjectURL(currentObjectUrl.current);
          currentObjectUrl.current = null;
        }
        setImageFile(null);
        const fileInput = document.getElementById(
          'imageUpload'
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        router.push('/');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  if (imageFile) {
    imagePreviewUrl = URL.createObjectURL(imageFile);
    currentObjectUrl.current = imagePreviewUrl;
  }

  return (
    <div className='w-full bg-palette-3 min-h-screen py-6 px-4'>
      <div className='py-1 px-6 mb-2 text-center rounded-lg mx-auto max-w-md md:max-w-4xl lg:max-w-6xl'>
        <h1 className='text-2xl md:text-3xl font-bold text-palette-2 mb-3'>
          Add to Your Wardrobe
        </h1>
        <p className='text-palette-5 text-sm md:text-base'>
          Upload your clothing items to build your digital collection
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-3.5 justify-center content-center w-full max-w-md mx-auto md:max-w-4xl lg:max-w-6xl'
        aria-label='Apparel upload form'
      >
        <div className='w-full md:grid md:grid-cols-2 md:gap-6 lg:gap-8'>
          <section className='flex flex-col bg-white bg-opacity-70 rounded-3xl p-5 mb-4 md:mb-0'>
            <label
              htmlFor='imageUpload'
              className='cursor-pointer font-bold text-palette-2 mb-3 block text-lg'
            >
              Upload Apparel Image <span className='text-palette-5'>*</span>
            </label>
            <input
              type='file'
              id='imageUpload'
              name='imageUpload'
              accept='image/*'
              onChange={handleImageUpload}
              className={`cursor-pointer w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-palette-1 file:text-palette-3 hover:file:bg-palette-2 ${
                validationErrors.imageFile ? 'border-red-500' : ''
              }`}
              aria-required='true'
              aria-invalid={!!validationErrors.imageFile}
              aria-describedby={
                validationErrors.imageFile ? 'imageUpload-error' : undefined
              }
              disabled={isSubmitting}
            />
            {validationErrors.imageFile && (
              <p
                id='imageUpload-error'
                className='text-palette-5 text-sm font-bold mt-1'
              >
                {validationErrors.imageFile}
              </p>
            )}
            {imageFile && imagePreviewUrl && (
              <div className='mt-4 relative w-full aspect-[5/4] max-h-60 md:max-h-80 overflow-hidden rounded-lg'>
                <Image
                  src={imagePreviewUrl}
                  alt='Image preview'
                  fill
                  unoptimized
                  className='object-contain'
                />
              </div>
            )}
          </section>
          <div className='flex flex-col gap-4'>
            <section className='flex flex-col gap-3 p-5 bg-white bg-opacity-70 rounded-3xl'>
              <label
                htmlFor='apparelTitle'
                className='cursor-pointer font-bold text-lg text-palette-2 mb-3'
              >
                Apparel Item Title <span className='text-palette-5'>*</span>
              </label>
              <input
                type='text'
                id='apparelTitle'
                name='apparelTitle'
                placeholder='Title of this Apparel item'
                value={formData.apparelTitle}
                onChange={handleChange}
                className={`p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-4 text-palette-2 ${
                  validationErrors.apparelTitle
                    ? 'border-palette-5'
                    : 'border-palette-1'
                }`}
                aria-required='true'
                aria-invalid={!!validationErrors.apparelTitle}
                aria-describedby={
                  validationErrors.apparelTitle
                    ? 'apparelTitle-error'
                    : undefined
                }
                disabled={isSubmitting}
              />
              {validationErrors.apparelTitle && (
                <p
                  id='apparelTitle-error'
                  className='text-palette-5 text-sm font-bold mt-1'
                >
                  {validationErrors.apparelTitle}
                </p>
              )}
            </section>
            <section className='flex flex-col gap-3 p-5 bg-white bg-opacity-70 rounded-3xl'>
              <label
                htmlFor='apparelDescription'
                className='cursor-pointer font-bold text-lg text-palette-2 mb-3'
              >
                Apparel Description
              </label>
              <input
                type='text'
                id='apparelDescription'
                name='apparelDescription'
                placeholder='Optional description for this Apparel Item'
                value={formData.apparelDescription}
                onChange={handleChange}
                className='p-2 border border-palette-1 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-4 text-palette-2'
                disabled={isSubmitting}
              />
            </section>
            <section className='flex flex-col gap-3 p-5 bg-white bg-opacity-70 rounded-3xl'>
              <label
                htmlFor='apparelType'
                className='cursor-pointer font-bold text-lg text-palette-2 mb-3'
              >
                Apparel Type <span className='text-palette-5'>*</span>
              </label>
              <select
                id='apparelType'
                name='apparelType'
                value={formData.apparelType}
                onChange={handleOptionChange}
                className='p-2 border border-palette-1 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-4 bg-white text-palette-2'
                aria-required='true'
                disabled={isSubmitting}
              >
                {Object.values(ApparelTypeEnum).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </section>
          </div>
        </div>
        <button
          type='submit'
          disabled={isSubmitting}
          className={`p-4 mt-6 rounded-md text-white font-medium transition-colors w-full md:max-w-xs md:mx-auto ${
            isSubmitting
              ? 'bg-palette-1 opacity-60 cursor-not-allowed'
              : 'bg-palette-5 hover:bg-palette-2'
          }`}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Uploading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
