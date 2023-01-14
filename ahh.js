require('dotenv').config()
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const TelegramBot = require('node-telegram-bot-api');
const {Storage} = require('megajs');
var fs = require('fs');
const pathh = require('path')

const { TOKEN, SERVER_URL } = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI

const app = express()
app.use(bodyParser.json())

const init = async () => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
    console.log(res.data)
}
const mega = new Storage({
    email: 'khajashaik1000@gmail.com',
    password: 'khajashaik1000@gmail.com'
});
mega.on('ready', () => {
    console.log('Successfully logged into MEGA');
});

function go() {
    const telegramBot = new TelegramBot(process.env.TOKEN, {polling: true});
    var counter = 0;
    var Vcounter = 0;
    
    telegramBot.on('message', (msg) => {
        const chatId = msg.chat.id;
        let messageSent = false;

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
            return;
        }
        else if(msg.photo) {
            const fileId = msg.photo[2].file_id
            counter++;
            var fileName = 'file_'+counter+'.png';
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
            return;
        }
        else if(msg.video) {
            Vcounter++
            const fileName = msg.video.file_name || "file_video_"+Vcounter+".mp4"
            const fileId = msg.video.file_id
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
            return;
        }
        else {
            if(!messageSent){
                telegramBot.sendMessage(chatId, 'Please send a document to be uploaded to MEGA');
                messageSent = true;
            }
        }
    })
}

app.listen(process.env.PORT || 5000, async () => {
    console.log('🚀 app running on port', process.env.PORT || 5000)
    go()
})