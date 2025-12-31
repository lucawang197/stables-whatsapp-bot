const fetch = require('node-fetch');
const { API_KEY, TRADING_URL, defaultPayload } = require('./config');
const { info, error, debug } = require('./logger');

const buildPayload = ({ depositAmount, settledAmount, quotedExRate }) => ({
  ...defaultPayload,
  deposit_amount: depositAmount,
  settled_amount: settledAmount,
  quoted_ex_rate: quotedExRate.toString(),
});

const postTradingOrder = async ({ depositAmount, settledAmount, quotedExRate }) => {
  const payload = buildPayload({ depositAmount, settledAmount, quotedExRate });
  debug('Sending payload to trading API', payload);

  const response = await fetch(TRADING_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify(payload)
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = await response.text();
  }

  if (!response.ok) {
    error('Trading API responded with error', response.status, data);
    const err = new Error(`Trading API failed with status ${response.status}`);
    err.status = response.status;
    err.response = data;
    throw err;
  }

  info('Trading API success', response.status);
  return { status: response.status, data };
};

module.exports = {
  postTradingOrder
};


