const TelegramBot = require('node-telegram-bot-api');
const {Storage} = require('megajs');
var fs = require('fs');

// Replace YOUR_TELEGRAM_BOT_TOKEN with the token you obtained from the @BotFather
const telegramBot = new TelegramBot('5973648198:AAF0NiHjZj8Hyrz74nw5eI_CaYV7Euuefgg', {polling: true});

// Replace YOUR_EMAIL and YOUR_PASSWORD with your MEGA email and password
const mega = new Storage({
  email: 'khajashaik1000@gmail.com',
  password: 'khajashaik1000@gmail.com'
});

mega.on('ready', () => {
  console.log('Successfully logged into MEGA');
});

telegramBot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(msg);
    // if(msg.document) {
        const fileId = msg.document.file_id
        const fileName = msg.document.file_name

        telegramBot.downloadFile(fileId, 'downloads').then(async path => {
            try {
                const fileStream = fs.createReadStream(path)
                const uploadStream = mega.upload({
                    name: fileName,
                    size: msg.document.file_size
                })
                fileStream.pipe(uploadStream)
                await fileStream.complete
                console.log(`Seccessfully uploaded file : ${fileName}`)
                telegramBot.sendMessage(chatId, `Seccessfully uploaded file : ${fileName}`)
                return;
            }
            catch(err) {
                telegramBot.sendMessage(chatId, 'An error occured while uploading the file to MEGA')
                console.log(err);
            }
            // mega.upload(path, {}, (err, file) => {
            //     if(err) {
            //         console.error(err);
            //         telegramBot.sendMessage(chatId, 'An error occured while uploading the file to MEGA')
            //         return;
            //     }
            //     console.log(`Successfully uploaded file : ${fileName}`)
            //     telegramBot.sendMessage(chatId, `Seccessfully uploaded file : ${fileName}`)
            // })
        })
    // }
    // else {
    //     telegramBot.sendMessage(chatId, 'Please send a document to be uploaded to MEGA')
    // }
})

// telegramBot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   if (msg.document) {
//       const fileId = msg.document.file_id;
//       const fileName = msg.document.file_name;
      
//         console.log("the message is ", fileId, fileName);

//         telegramBot.downloadFile(fileId, 'downloads').then((path) => {
//         mega.storage.upload(path, {}, (err, file) => {
//             if (err) {
//             console.error(err);
//             telegramBot.sendMessage(chatId, 'An error occurred while uploading the file to MEGA');
//             return;
//             }
//             console.log(`Successfully uploaded file: ${fileName}`);
//             telegramBot.sendMessage(chatId, `Successfully uploaded file: ${fileName}`);
//         });
//         });
//     } else {
//         // A message without a document was received
//         telegramBot.sendMessage(chatId, 'Please send a document to be uploaded to MEGA');
//     }
// });