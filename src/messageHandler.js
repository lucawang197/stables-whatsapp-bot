// messageHandler.js
const { parseSettlementMessage } = require('./parser');
const { postTradingOrder } = require('./tradingApi');
const { info, error } = require('./logger');
const fetch = require('node-fetch');

// 加载 .env 文件（开发/测试时用）
require('dotenv').config();

/**
 * 获取带手续费的汇率（使用环境变量配置费率）
 * @param {string} from - 源币种，默认 'USDT'
 * @param {string} to - 目标币种，默认 'EUR'
 * @returns {Promise<string>} 格式化后的汇率字符串（保留4位小数）
 */
async function getRateWithFee(from = 'USDT', to = 'EUR') {
  // 从环境变量读取，没有则用默认值 1.003（即 +0.3%）
  const multiplier = parseFloat(process.env.RATE_MULTIPLIER) || 1.003;
  const apiKey = process.env.TIIK_API_KEY;

  if (!apiKey) {
    throw new Error('缺少 TIIK_API_KEY 环境变量');
  }

  const url = `https://staging-api.tiiik.money/api/public/exchange/openfx/rate?from=${from}&to=${to}`;

  try {
    const res = await fetch(url, {
      headers: { 'x-api-key': apiKey }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`汇率API返回错误: ${res.status} ${text}`);
    }

    const data = await res.json();

    if (typeof data.rawRate !== 'number') {
      throw new Error(`API响应缺少有效 rawRate 字段，实际返回: ${JSON.stringify(data)}`);
    }

    const rawRate = data.rawRate;
    const rateWithFee = rawRate * multiplier; 

    // 保留 4 位小数
    return rateWithFee.toFixed(4);
  } catch (err) {
    error('获取汇率失败', err.message || err);
    throw err;
  }
}

/**
 * 主消息处理入口
 * @param {Object} message - WhatsApp 消息对象
 */
const handleIncomingMessage = async (message) => {
  const content = (message.body || '').trim();
  info('Received message:', content);

  // 处理“查汇率”指令
  if (content === '汇率' || content === '查汇率' || content === 'rate') {
    try {
      const rate = await getRateWithFee('USDT', 'EUR');
      const replyText = `当前汇率：1 USDT = ${rate} EUR`;
      
      // await message.reply(replyText);
      info('Would reply with:', replyText);
    } catch (err) {
      error('Failed to reply exchange rate', err.message);
      // await message.reply('抱歉，汇率服务暂时不可用，请稍后再试。');
    }
    return;
  }

  // 处理“结算”指令
  const parsed = parseSettlementMessage(content);
  if (!parsed) return;

  info('Parsed settlement data', parsed);
  try {
    await postTradingOrder({
      depositAmount: parsed.depositAmount,
      settledAmount: parsed.settledAmount,
      quotedExRate: parsed.quotedExRate
    });
  } catch (err) {
    error('Failed to process settlement', err.message);
  }
};

module.exports = { handleIncomingMessage };