"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis = require("redis");
var memjs = require("memjs");
var mongodb_1 = require("mongodb");
var pg_1 = require("pg");
var Cache = /** @class */ (function () {
    function Cache() {
        this.redisClient = redis.createClient({ url: 'redis://localhost:6379' });
        this.memcachedClient = memjs.Client.create('localhost:11211');
        this.mongoClient = new mongodb_1.MongoClient('mongodb://localhost:27017');
        this.pgPool = new pg_1.Pool({ host: 'localhost', port: 5432, database: 'mydb', user: 'myuser', password: 'mypassword' });
        this.inbuiltCache = new Map();
        this.mongoClient.connect().catch(function (err) { return console.error('Error connecting to MongoDB:', err); });
        this.pgPool.on('error', function (err) { return console.error('Error with PostgreSQL pool:', err); });
    }
    Cache.prototype.set = function (key, value, cacheSystem) {
        return __awaiter(this, void 0, void 0, function () {
            var stringValue, db;
            return __generator(this, function (_a) {
                stringValue = JSON.stringify(value);
                if (cacheSystem === 'redis') {
                    this.redisClient.set(key, stringValue, function (err) { if (err)
                        console.error('Error setting value in Redis:', err); });
                }
                else if (cacheSystem === 'memcached') {
                    this.memcachedClient.set(key, stringValue, {}, function (err) { if (err)
                        console.error('Error setting value in Memcached:', err); });
                }
                else if (cacheSystem === 'mongodb') {
                    db = this.mongoClient.db('mydb');
                    db.collection('cache').updateOne({ _id: key }, { $set: { value: stringValue } }, { upsert: true });
                }
                else if (cacheSystem === 'postgresql') {
                    this.pgPool.query('INSERT INTO cache(key, value) VALUES($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', [key, stringValue]);
                }
                else if (cacheSystem === 'inbuilt') {
                    this.inbuiltCache.set(key, value);
                }
                return [2 /*return*/];
            });
        });
    };
    Cache.prototype.get = function (key, cacheSystem) {
        return __awaiter(this, void 0, void 0, function () {
            var db, doc, res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(cacheSystem === 'redis')) return [3 /*break*/, 1];
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                _this.redisClient.get(key, function (err, reply) {
                                    if (err) {
                                        console.error('Error getting value from Redis:', err);
                                        reject(err);
                                    }
                                    else {
                                        resolve(JSON.parse(reply));
                                    }
                                });
                            })];
                    case 1:
                        if (!(cacheSystem === 'memcached')) return [3 /*break*/, 2];
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                _this.memcachedClient.get(key, function (err, value) {
                                    if (err) {
                                        console.error('Error getting value from Memcached:', err);
                                        reject(err);
                                    }
                                    else {
                                        resolve(JSON.parse(value.toString()));
                                    }
                                });
                            })];
                    case 2:
                        if (!(cacheSystem === 'mongodb')) return [3 /*break*/, 4];
                        db = this.mongoClient.db('mydb');
                        return [4 /*yield*/, db.collection('cache').findOne({ _id: key })];
                    case 3:
                        doc = _a.sent();
                        return [2 /*return*/, doc ? JSON.parse(doc.value) : null];
                    case 4:
                        if (!(cacheSystem === 'postgresql')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.pgPool.query('SELECT value FROM cache WHERE key = $1', [key])];
                    case 5:
                        res = _a.sent();
                        return [2 /*return*/, res.rows[0] ? JSON.parse(res.rows[0].value) : null];
                    case 6:
                        if (cacheSystem === 'inbuilt') {
                            return [2 /*return*/, this.inbuiltCache.get(key)];
                        }
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Cache.prototype.close = function () {
        this.redisClient.quit();
        this.memcachedClient.close();
        this.mongoClient.close();
        this.pgPool.end();
    };
    return Cache;
}());
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var cache, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                cache = new Cache();
                // Test Redis
                return [4 /*yield*/, cache.set('myKey', { a: 1 }, 'redis')];
            case 1:
                // Test Redis
                _l.sent();
                _b = (_a = console).log;
                return [4 /*yield*/, cache.get('myKey', 'redis')];
            case 2:
                _b.apply(_a, [_l.sent()]); // { a: 1 }
                // Test Memcached
                return [4 /*yield*/, cache.set('myKey', { b: 2 }, 'memcached')];
            case 3:
                // Test Memcached
                _l.sent();
                _d = (_c = console).log;
                return [4 /*yield*/, cache.get('myKey', 'memcached')];
            case 4:
                _d.apply(_c, [_l.sent()]); // { b: 2 }
                // Test MongoDB
                return [4 /*yield*/, cache.set('myKey', { c: 3 }, 'mongodb')];
            case 5:
                // Test MongoDB
                _l.sent();
                _f = (_e = console).log;
                return [4 /*yield*/, cache.get('myKey', 'mongodb')];
            case 6:
                _f.apply(_e, [_l.sent()]); // { c: 3 }
                // Test PostgreSQL
                return [4 /*yield*/, cache.set('myKey', { d: 4 }, 'postgresql')];
            case 7:
                // Test PostgreSQL
                _l.sent();
                _h = (_g = console).log;
                return [4 /*yield*/, cache.get('myKey', 'postgresql')];
            case 8:
                _h.apply(_g, [_l.sent()]); // { d: 4 }
                // Test inbuilt cache
                return [4 /*yield*/, cache.set('myKey', { e: 5 }, 'inbuilt')];
            case 9:
                // Test inbuilt cache
                _l.sent();
                _k = (_j = console).log;
                return [4 /*yield*/, cache.get('myKey', 'inbuilt')];
            case 10:
                _k.apply(_j, [_l.sent()]); // { e: 5 }
                cache.close();
                return [2 /*return*/];
        }
    });
}); })();
