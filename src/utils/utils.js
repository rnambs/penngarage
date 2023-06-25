import axios from 'axios';

export const config = {
  bucketName: 'penngaragebucket',
  // dirName: 'media', /* optional */
  region: 'us-east-2',
  accessKeyId: 'AKIAZNTSTW7SLQBVD54Q',
  secretAccessKey: 'g7HSMVNMCBNzpvAurMHPSHBfxcGgLhFU4VaaUKmG',
  // s3Url: 'https:/your-custom-s3-url.com/', /* optional */
};

export const ROOT_URL = 'http://localhost:3000';
// update the URL to be what Heroku gives us
export const JSON_SERVER_URL = '';
export const NAVBAR_HEIGHT = '60px';
export const SEARCH_PAGE_ITEMS_PER_PAGE = 15;
export const HOME_ITEM_PER_PAGE = 3;
export const BOOKMARK_ITEM_PER_PAGE = 9;

export const setAxiosAuthHeaders = () => {
  axios.defaults.headers.common.Authorization = sessionStorage.getItem('token');
};
