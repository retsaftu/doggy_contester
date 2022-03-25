var config = require("./config/config.json")
var back_url = config["lb-endpoints"]["doggy-contester-backend"].host + ":" + config["lb-endpoints"]["doggy-contester-backend"].port;

const PROXY_CONFIG = [
    {
        context: [
            "/api/**"
        ],
        target: "http://" + back_url,
        pathRewrite: { "^/api": "http://" + back_url + "/" }
    }
];
module.exports = PROXY_CONFIG;
