const TelegramBot = require('node-telegram-bot-api');
const {Storage} = require('megajs');
var fs = require('fs');
const pathh = require('path')
require('dotenv').config()

const telegramBot = new TelegramBot('5742465224:AAEVLyhl79DrC5gOXPUBnutS0yqUPWH7Ogk', {polling: true});
var counter = 1;
var Vcounter = 1;

const mega = new Storage({
  email: 'khajashaik1000@gmail.com',
  password: 'khajashaik1000@gmail.com'
});

mega.on('ready', () => {
  console.log('Successfully logged into MEGA');
});

telegramBot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if(msg.document) {
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
                console.log(`Successfully uploaded file : ${fileName}`)
                telegramBot.sendMessage(chatId, `Successfully uploaded file : ${fileName}`)
            }
            catch(err) {
                telegramBot.sendMessage(chatId, 'An error occured while uploading the file to MEGA')
                console.log(err);
            }
            setTimeout(()=> {
                fs.unlinkSync(pathh.join(__dirname,path), function (err) {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log("File removed:", path);
                    }
                });  
            },2000)
        })
    }
    else if(msg.photo) {
        const fileId = msg.photo[2].file_id
        var fileName = 'file_'+counter+'.png';
        counter++;
        telegramBot.downloadFile(fileId, 'downloads').then(async path => {
            try {
                const fileStream = fs.createReadStream(path)
                const uploadStream = mega.upload({
                    name: fileName,
                    size: msg.photo[2].file_size
                })
                fileStream.pipe(uploadStream)
                await fileStream.complete
                console.log(`Successfully uploaded file : ${fileName}`)
                telegramBot.sendMessage(chatId, `Successfully uploaded file : ${fileName}`)
            }
            catch(err) {
                telegramBot.sendMessage(chatId, 'An error occured while uploading the file to MEGA')
                console.log(err);
            }
            setTimeout(()=> {
                fs.unlinkSync(pathh.join(__dirname,"\\",path), function (err) {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log("File removed:", path);
                    }
                });  
            },2000)  
        })
    }
    else if(msg.video) {
        const fileName = msg.video.file_name || "file_video_"+Vcounter+".mp4"
        const fileId = msg.video.file_id
        Vcounter++
        telegramBot.downloadFile(fileId, 'downloads').then(async path => {
            try {
                const fileStream = fs.createReadStream(path)
                const uploadStream = mega.upload({
                    name: fileName,
                    size: msg.video.file_size
                })
                fileStream.pipe(uploadStream)
                await fileStream.complete
                console.log(`Successfully uploaded file : ${fileName}`)
                telegramBot.sendMessage(chatId, `Seccessfully uploaded file : ${fileName}`)
            }
            catch(err) {
                telegramBot.sendMessage(chatId, 'An error occured while uploading the file to MEGA')
                console.log(err);
            }
            setTimeout(()=> {
                fs.unlinkSync(pathh.join(__dirname,"\\",path), function (err) {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log("File removed:", path);
                    }
                });  
            },2000)
        })
    }
    else {
        telegramBot.sendMessage(chatId, 'Please send a document to be uploaded to MEGA')
    }
})
