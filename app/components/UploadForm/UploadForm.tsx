'use client';

import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useState, useRef } from 'react';
import { ApparelForm, ApparelTypeEnum } from './utils/types';
import { orchestrateApparelSubmit } from './utils/sumbitHelper';
import { toast } from 'react-toastify';

const UploadForm = () => {
  const [formData, setFormData] = useState<ApparelForm>({
    apparelTitle: '',
    apparelDescription: '',
    apparelType: ApparelTypeEnum.TOP,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    setIsSubmitting(true);

    try {
      if (imageFile) {
        const result = await orchestrateApparelSubmit(imageFile, formData);

        if (result?.success === false) {
          toast.error(`Upload failed: ${result.error || 'Unknown error'}`);
          setIsSubmitting(false);
          return;
        }
        toast.success('Apparel item uploaded successfully!');
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
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (imageFile) {
    imagePreviewUrl = URL.createObjectURL(imageFile);
    currentObjectUrl.current = imagePreviewUrl;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-3.5 p-3.5 justify-center content-center md:w-1/2'
      aria-label='Apparel upload form'
    >
      <section className='flex flex-col gap-3 p-3'>
        <label htmlFor='imageUpload' className='cursor-pointer'>
          Upload Apparel Image <span className='text-red-500'>*</span>
        </label>
        <input
          type='file'
          id='imageUpload'
          name='imageUpload'
          accept='image/*'
          onChange={handleImageUpload}
          className={`cursor-pointer ${
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
          <p id='imageUpload-error' className='text-red-500 text-sm mt-1'>
            {validationErrors.imageFile}
          </p>
        )}
        {imageFile && imagePreviewUrl && (
          <div className='mt-3 flex justify-center relative w-full aspect-[5/4] overflow-hidden'>
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
      <section className='flex flex-col gap-3 p-3'>
        <label htmlFor='apparelTitle' className='cursor-pointer'>
          Apparel Item Title <span className='text-red-500'>*</span>
        </label>
        <input
          type='text'
          id='apparelTitle'
          name='apparelTitle'
          placeholder='Title of this Apparel item'
          value={formData.apparelTitle}
          onChange={handleChange}
          className={`p-2 border rounded ${
            validationErrors.apparelTitle ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-required='true'
          aria-invalid={!!validationErrors.apparelTitle}
          aria-describedby={
            validationErrors.apparelTitle ? 'apparelTitle-error' : undefined
          }
          disabled={isSubmitting}
        />
        {validationErrors.apparelTitle && (
          <p id='apparelTitle-error' className='text-red-500 text-sm mt-1'>
            {validationErrors.apparelTitle}
          </p>
        )}
      </section>
      <section className='flex flex-col gap-3 p-3'>
        <label htmlFor='apparelDescription' className='cursor-pointer'>
          Apparel Description
        </label>
        <input
          type='text'
          id='apparelDescription'
          name='apparelDescription'
          placeholder='Optional description for this Apparel Item'
          value={formData.apparelDescription}
          onChange={handleChange}
          className='p-2 border border-gray-300 rounded'
          disabled={isSubmitting}
        />
      </section>
      <section className='flex flex-col gap-3 p-3'>
        <label htmlFor='apparelType' className='cursor-pointer'>
          Apparel Type <span className='text-red-500'>*</span>
        </label>
        <select
          id='apparelType'
          name='apparelType'
          value={formData.apparelType}
          onChange={handleOptionChange}
          className='p-2 border border-gray-300 rounded'
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
      <button
        type='submit'
        disabled={isSubmitting}
        className={`p-3 rounded-md text-white font-medium transition-colors ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
};

export default UploadForm;
