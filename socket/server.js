const WebSocket = require('ws');

const wsServer = new WebSocket.Server({ port: 9000 });

wsServer.on('connection', onConnect);

const config = require('./config/config.json')
function onConnect(wsClient) {

    console.log('Новый пользователь');
    let prePart = 0;
    let checker = true;
    let part = 0;
    setInterval(async () => {

        // let part=prePart;
        prePart = part;
        await run().then((res) => {
            console.log(`res`, res);
            if (!checker) {
                part = res
                if (prePart != part) {
                    wsClient.send('Обнови лидерборд чел');
                }
            }
            if (checker) {
                prePart = res
                checker = false;
            }

        });
        console.log(`part`, part);
    }, 5000)
    wsClient.send('Привет');
    wsClient.on('message', function (message) {
        /* обработчик сообщений от клиента */
    })
    wsClient.on('close', function () {
        // отправка уведомления в консоль
        console.log('Пользователь отключился');
    })
}

const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');

const url = `mongodb://${config.mongodb.host}:${config.mongodb.port}`;

const mongoClient = new MongoClient(url);

async function run() {
    try {
        await mongoClient.connect();
        const db = mongoClient.db(config.mongodb.dbname);
        const count = await db.collection('submission').estimatedDocumentCount({});

        console.log('count ', count);

        await mongoClient.close()
        return count;
    } catch (err) {
        console.log(err);
    }
}
run();