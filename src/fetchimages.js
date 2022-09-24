const axios = require('axios').default;
const DPages = 'https://pixabay.com/api/';
const key = 123;

const ffol = function (name, page) {
  return axios
    .get(
      `${DPages}?key=30081101-40180903bea68f83c1da8999a&q=${name}&image_type=photo&oreentation=horizontal&safesearch=true&page=${page}&per_page=40`
    )
    .then(response => {
      console.log(response);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      throw new Error(response.status);
    });
};
export default { ffol };
