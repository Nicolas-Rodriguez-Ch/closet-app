'use client';

import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useState } from 'react';
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imageFile) {
      const result = await orchestrateApparelSubmit(imageFile, formData);
      if (result) {
        toast.success('Apparel item uploaded succesfully!',);
        setFormData({
          apparelTitle: '',
          apparelDescription: '',
          apparelType: ApparelTypeEnum.TOP,
        });
        setImageFile(null);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-3.5 p-3.5 justify-center content-center md:w-1/2'
    >
      <section className='flex flex-col gap-3 p-3'>
        <label htmlFor='imageUpload' className='cursor-pointer'>
          Upload Apparel Image
        </label>
        <input
          type='file'
          id='imageUpload'
          name='imageUpload'
          accept='image/*'
          onChange={handleImageUpload}
          max-size='10485760'
          className='cursor-pointer'
          required
        />
        {imageFile && (
          <div className='mt-3 flex justify-center'>
            <Image
              src={URL.createObjectURL(imageFile)}
              alt='Image preview'
              width={320}
              height={256}
              unoptimized={false}
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}
      </section>
      <section className='flex flex-col gap-3 p-3'>
        <label htmlFor='apparelTitle' className='cursor-pointer'>
          Apparel Item Title
        </label>
        <input
          type='text'
          id='apparelTitle'
          name='apparelTitle'
          placeholder='Title of this Apparel item'
          value={formData.apparelTitle}
          required
          onChange={handleChange}
        />
      </section>
      <section className='flex flex-col gap-3 p-3'>
        <label htmlFor='apparelDescription' className='cursor-pointer'>
          Apparel Description Title
        </label>
        <input
          type='text'
          id='apparelDescription'
          name='apparelDescription'
          placeholder='Optional description for this Apparel Item'
          value={formData.apparelDescription}
          onChange={handleChange}
        />
      </section>
      <section className='flex flex-col gap-3 p-3'>
        <select
          id='apparelType'
          name='apparelType'
          value={formData.apparelType}
          onChange={handleOptionChange}
          required
        >
          {Object.values(ApparelTypeEnum).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </section>
      <button type='submit'>Submit</button>
    </form>
  );
};

export default UploadForm;
