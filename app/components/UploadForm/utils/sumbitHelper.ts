'use client'

import { API_URL } from '@/public/constants/secrets';
import { ApparelForm } from './types';

export const orchestrateApparelSubmit = async (
  file: File,
  params: ApparelForm
) => {
  try {
    console.log('🚀 ~ API_URL:', API_URL);
    const form = new FormData();
    form.append('file', file);
    

    const pictureURL = await fetch(`${API_URL}upload`, {
      method: 'POST',
      body: form,
    });
    console.log('🚀 ~ pictureURL:', pictureURL);
    console.log('🚀 ~ params:', params);
  } catch (error) {
    console.error(error);
  }
};
