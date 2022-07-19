import fetchMock from 'fetch-mock';

export const resetMocks = () => {
  fetchMock.restore();
};

/**
 * Add a new endpoint mock response
 *
 * @param {any} [url='*'] the fetch-mock endpoint matcher
 * @param {number} [status=200] The http response code to return
 * @param {object} [response={}] The body content to return
 * @param {number} [delay] Optional ms delay to add to the call - if not specified uses a random value from 1000-2500
 */
export const addMock = (url = '*', status = 200, response = {}, delay = null) => {
  const msdelay = !!delay ? delay : Math.floor((Math.random() * 1500) + 1000);
  fetchMock.config.overwriteRoutes = true;
  console.info('addMock', url, status, response);
  if (status === 204) {
    fetchMock.mock(url, { status }, { delay: msdelay });
  } else {
    fetchMock.mock(url, { status, body: response }, { delay: msdelay });
  }
};
