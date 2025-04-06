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

    if (!uploadResult || !uploadResult.data) {
      throw new Error('Invalid upload response format');
    }

    const { secure_url } = uploadResult.data;

    if (!secure_url) {
      throw new Error('Missing secure_url in upload response');
    }

    const body = {
      pictureURL: secure_url,
      title: params.apparelTitle,
      description: params.apparelDescription,
      type: params.apparelType,
    };

    if (!body.description) delete body.description;

    const result = await fetch(`${API_URL}apparel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
