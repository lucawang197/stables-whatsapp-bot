const { parseSettlementMessage } = require('./parser');
const { postTradingOrder } = require('./tradingApi');
const { info, error } = require('./logger');

const handleIncomingMessage = async (message) => {
  const content = message.body || '';
  info('Detected settlement message', content);

  const parsed = parseSettlementMessage(content);

  if (!parsed) {
    return;
  }

  info('Detected settlement message', parsed);

  try {
    await message.reply('已收到结算指令，正在处理...');

    const result = await postTradingOrder({
      depositAmount: parsed.depositAmount,
      settledAmount: parsed.settledAmount,
      quotedExRate: parsed.quotedExRate
    });

    await message.reply(`交易已提交，API 状态码：${result.status}`);
  } catch (err) {
    error('Failed to submit trading order', err.response || err.message || err);
    await message.reply('提交交易时出现问题，请稍后重试。');
  }
};

module.exports = {
  handleIncomingMessage
};


