const { debug } = require('./logger');

const settlementPattern = /Done,\s*we will settle USDT\s+([0-9,]+(?:\.\d+)?)[^)]*\(\s*([0-9,]+(?:\.\d+)?)[/]\s*([0-9.,]+)\s*\)/i;

const normalizeNumber = (raw) => parseFloat(raw.replace(/,/g, ''));

const parseWithPattern = (text) => {
  const match = settlementPattern.exec(text);
  if (!match) return null;

  const settledAmount = normalizeNumber(match[1]);
  const depositAmount = normalizeNumber(match[2]);
  const quotedExRate = match[3].replace(/,/g, '');

  if ([settledAmount, depositAmount].some((n) => Number.isNaN(n)) || !quotedExRate) {
    return null;
  }

  return { settledAmount, depositAmount, quotedExRate };
};

const parseWithFallback = (text) => {
  const numberMatches = text.match(/[0-9][0-9,]*(?:\.\d+)?/g);
  if (!numberMatches || numberMatches.length < 3) return null;

  const settledAmount = normalizeNumber(numberMatches[0]);
  const depositAmount = normalizeNumber(numberMatches[1]);
  const quotedExRate = numberMatches[2].replace(/,/g, '');

  if ([settledAmount, depositAmount].some((n) => Number.isNaN(n)) || !quotedExRate) {
    return null;
  }

  return { settledAmount, depositAmount, quotedExRate };
};

const parseSettlementMessage = (text) => {
  if (!text) return null;

  const result = parseWithPattern(text) || parseWithFallback(text);
  if (!result) {
    debug('Message did not match settlement pattern', text);
  }
  return result;
};

module.exports = {
  parseSettlementMessage
};


