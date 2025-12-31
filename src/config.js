const API_KEY = process.env.STABLES_API_KEY || 'ErmlWnUSvHbf/f+7uKptTSPvfXYE6XX2CfshOK5Ai5I=';
const TRADING_URL = process.env.STABLES_TRADING_URL || 'https://dev.stablesapi.com/api/v1/trading';

const CLIENT_ID = Number(process.env.STABLES_CLIENT_ID) || 2;
const getToday = () => new Date().toISOString().slice(0, 10);

const defaultPayload = {
  client_id: CLIENT_ID,
  transaction_type: 'EUR-USDT',
  payout_portal: 'tron',
  deposit_date: getToday(),
  settlement_date: getToday(),
  deposit_ccy: 'EUR',
  settled_ccy: 'USDT',
  onchain_tx_id: 'toBeConfirm',
  fee_rate_ppm: 0,
};

module.exports = {
  API_KEY,
  TRADING_URL,
  CLIENT_ID,
  defaultPayload
};


