const { createProvider } = require('sonorpc');
const MySQL = require('sonorpc-mysql');
const Redis = require('ioredis');

const config = require('./config');

// MySQL配置
const mysql = new MySQL(config.mysql);

// Redis配置
const redis = new Redis(config.redis);

const application = {
    mysql,
    redis
};

exports.start = function start() {
    return createProvider({
        name: 'seller',
        port: 3011,
        registry: {
            port: 3006
        },
        extentions: {
            application
        },
        services: [
            require('./services/SellerService'),
        ]
    })
        .start();
};