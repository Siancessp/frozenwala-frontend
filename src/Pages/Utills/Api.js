import axios from 'axios';

export const BASE_URL = 'https://app.frozenwala.com/base/';

const get = async endPoints => {
  const accessToken = localStorage.getItem('access_token');

  return axios.get(BASE_URL + endPoints, {
    headers: {
        Authorization: `Bearer ${accessToken}`, // Use the passed token
      },
  });
};

const postFormdata = async (endPoints, formData) => {
  const accessToken = localStorage.getItem('access_token');

  return axios.post(BASE_URL + endPoints, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`, // Use the passed token
      },
  });
};

const post = async (endPoints, body) => {
  const accessToken = localStorage.getItem('access_token');

  return axios.post(BASE_URL + endPoints, body, {
    headers: {
        Authorization: `Bearer ${accessToken}`, // Use the passed token
      },
  });
};

const remove = async (endPoints) => {
  const accessToken = localStorage.getItem('access_token');

  return axios.delete(BASE_URL + endPoints, {
    headers: {
        Authorization: `Bearer ${accessToken}`, // Use the passed token
      },
  });
};

export default {get, post, postFormdata, remove};
