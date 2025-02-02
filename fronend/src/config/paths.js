// src/config/paths.js
export const BASE_PATH = '/GameMixer';
export const IMAGE_PATH = `${process.env.PUBLIC_URL}/images`;

export const paths = {
  getImagePath: (path) => `${IMAGE_PATH}/${path}`,
  getRoutePath: (path) => `${BASE_PATH}${path}`
};

export default paths;