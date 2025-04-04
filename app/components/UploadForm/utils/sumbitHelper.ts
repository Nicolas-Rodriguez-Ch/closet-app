'use client';

import { API_URL } from '@/public/constants/secrets';
import { ApparelForm } from './types';

export const orchestrateApparelSubmit = async (
  file: File,
  params: ApparelForm
): Promise<any> => {
  try {
    const form = new FormData();
    form.append('file', file);

    const uploadResult = await fetch(`${API_URL}upload`, {
      method: 'POST',
      body: form,
    }).then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    });

    const { secure_url } = uploadResult.data;
    if (secure_url) {
      const body = {
        pictureURL: secure_url,
        title: params.apparelTitle,
        description: params.apparelDescription,
        type: params.apparelType,
      };
      if (!body.description) delete body.description;
      const result = await fetch(`${API_URL}apparel`, {
        method: 'POST',
        body: JSON.stringify(body),
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      });
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};
