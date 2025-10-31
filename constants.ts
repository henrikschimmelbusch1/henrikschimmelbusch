
import type { Site } from './types';

const getFaviconUrl = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export const SITES: Site[] = [
  {
    name: 'Gmail',
    url: 'https://mail.google.com',
    favicon: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mail.google.com&size=16',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    favicon: getFaviconUrl('youtube.com'),
  },
  {
    name: 'Church',
    url: 'https://churchofjesuschrist.org',
    favicon: getFaviconUrl('churchofjesuschrist.org'),
  },
  {
    name: 'Drive',
    url: 'https://drive.google.com',
    favicon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg',
  },
  {
    name: 'Sight Reading Factory',
    url: 'https://sightreadingfactory.com',
    favicon: getFaviconUrl('sightreadingfactory.com'),
  },
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    favicon: 'https://cdn.oaistatic.com/assets/favicon-l4nq08hd.svg',
  },
  {
    name: 'Google AI Studio',
    url: 'https://aistudio.google.com',
    favicon: 'https://www.gstatic.com/aistudio/ai_studio_favicon_2_256x256.png',
  },
];