const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleIncomingMessage } = require('./src/messageHandler');
const { info, error } = require('./src/logger');

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  info('Scan this QR code to login!');
});

client.on('ready', () => {
  info('Client is ready!');
});

client.on('message', (message) => {
  handleIncomingMessage(message).catch((err) => {
    error('Unhandled message processing error', err);
  });
});

client.initialize();
