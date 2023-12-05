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
// Implement the Cache for localStorage
var LocalStorageCache = /** @class */ (function () {
    function LocalStorageCache() {
    }
    LocalStorageCache.prototype.get = function (key) {
        var item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    };
    LocalStorageCache.prototype.set = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };
    LocalStorageCache.prototype.remove = function (key) {
        localStorage.removeItem(key);
    };
    return LocalStorageCache;
}());
// Implement Cache for MongoDB
var mongodb_1 = require("mongodb");
var MongoDBCache = /** @class */ (function () {
    function MongoDBCache() {
        this.connectToDatabase();
    }
    MongoDBCache.prototype.connectToDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new mongodb_1.MongoClient('mongodb://localhost:27017');
                        return [4 /*yield*/, client.connect()];
                    case 1:
                        _a.sent();
                        this.db = client.db('myDatabase');
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoDBCache.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = this.db.collection('cache');
                        return [4 /*yield*/, collection.findOne({ key: key })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result ? result.value : null];
                }
            });
        });
    };
    MongoDBCache.prototype.set = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = this.db.collection('cache');
                        return [4 /*yield*/, collection.updateOne({ key: key }, { $set: { key: key, value: value } }, { upsert: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoDBCache.prototype.remove = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = this.db.collection('cache');
                        return [4 /*yield*/, collection.deleteOne({ key: key })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MongoDBCache;
}());
// Implement Cache for PostgreSQL
var pgPromise = require("pg-promise");
var PostgreSQLCache = /** @class */ (function () {
    function PostgreSQLCache() {
        this.connectToDatabase();
    }
    PostgreSQLCache.prototype.connectToDatabase = function () {
        var pgp = pgPromise();
        this.db = pgp('postgres://username:password@localhost:5432/mydatabase');
    };
    PostgreSQLCache.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db.oneOrNone('SELECT value FROM cache WHERE key = $1', key)];
            });
        });
    };
    PostgreSQLCache.prototype.set = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.none('INSERT INTO cache(key, value) VALUES($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value', [key, value])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLCache.prototype.remove = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.none('DELETE FROM cache WHERE key = $1', key)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PostgreSQLCache;
}());
// Usage Example
var localStorageCache = new LocalStorageCache();
var mongoDBCache = new MongoDBCache();
var postgresSQLCache = new PostgreSQLCache();
// Use the caches
localStorageCache.set('localKey', { data: 'example' });
console.log(localStorageCache.get('localKey'));
mongoDBCache.set('mongoKey', { data: 'example' });
console.log(mongoDBCache.get('mongoKey'));
postgresSQLCache.set('postgresKey', { data: 'example' });
console.log(postgresSQLCache.get('postgresKey'));
