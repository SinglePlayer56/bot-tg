const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');

const token = '6203563624:AAGPM4dWORuBazdm-tcF_MGKKxmnsW0UaWc';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен её отгадать.');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber.toString();
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветсвите'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Играть в игру "Угадай цифру"'}
    ]);

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/175/10e/17510e63-2d89-41ec-a18c-1e3351dd42b1/8.webp');
            return bot.sendMessage(chatId, 'Добро пожаловать!');
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз.');
    });

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты угадал/а цифру ${chats[chatId]}!`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `Ты выбрал цифру ${data}, а я загадал ${chats[chatId]}..`, againOptions);
        }
    })
}

start();
