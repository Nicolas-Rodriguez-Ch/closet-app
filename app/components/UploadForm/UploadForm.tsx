'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
enum ApparelTypeEnum {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  SHOES = 'SHOES',
  COAT = 'COAT',
}

const UploadForm = () => {
  const [formData, setFormData] = useState({
    apparelTitle: '',
    apparelDescription: '',
    apparelType: ApparelTypeEnum.TOP,
  });

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <form onSubmit={handleSubmit}>
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
