'use strict';

const log    = require('winston');
const format = require('util').format;
const _      = require('lodash');
const NodeCache = require('node-cache');

let keys = {
    allClips: 'clips::all',
    clipInfo: 'clip::%s::%s::%s::%s'
};

class Cache{
    static init(){
        if(!Cache.cache){
            Cache.cache = new NodeCache({
                stdTTL: 15000,
                checkperiod: 2000
            });

            /** INIT ALL CLIPS AS AN EMPTY ARRAY **/
            Cache.cache.get(keys.allClips, function(err, value) {
                if (!value) {
                    Cache.cache.set(keys.allClips, [], function(err, success){
                        if(err){
                            log.error(err);
                            process.exit(1)
                        }
                        else if(success)
                            return success;
                    })
                }
            })
        }
    }

    static destroy(){
        Cache.cache.flushAll();
        Cache.cache.close();
    }

    static addToClipCache(video){
        return new Promise(function(resolve, reject){
            Cache.getTotalClipCache()
                .then(function(clipsArr){
                    if(!clipsArr){
                        var newClipsArr = [];
                        newClipsArr.push(video);
                        Cache.cache.set(keys.allClips, newClipsArr, function(err,success){
                            if(err){
                                log.error(err.stack);
                                reject(err);
                            }
                            else
                                resolve(success);
                        });
                    }
                    else{
                        var existing =
                            _.find(clipsArr, function(vid){
                                return (vid.file.tournamentName == video.file.tournamentName &&
                                vid.file.round == video.file.round &&
                                vid.file.player1.smashtag == video.file.player1.smashtag &&
                                vid.file.player2.smashtag == video.file.player2.smashtag)
                            });

                        if(existing){
                            clipsArr = _.reject(clipsArr, function(vid){
                                return (vid.file.tournamentName == video.file.tournamentName &&
                                vid.file.round == video.file.round &&
                                vid.file.player1.smashtag == video.file.player1.smashtag &&
                                vid.file.player2.smashtag == video.file.player2.smashtag)
                            });
                        }

                        clipsArr.push(video);
                        Cache.cache.set(keys.allClips, clipsArr, function (err, success) {
                            if (err) {
                                log.error(err.stack);
                                reject(err);
                            }
                            else
                                resolve(success);
                        })
                    }
                })
        })
    }

    static getTotalClipCache(){
        return new Promise(function(resolve, reject){
            Cache.cache.get(keys.allClips, function(err, value){
                if(err){
                    log.error(err.stack);
                    reject(err);
                }
                else
                    resolve(value);
            })
        })
    }

    static removeClipFromTotal(video){
        return new Promise(function(resolve, reject){
            Cache.getTotalClipCache()
                .then(function(total){
                    total = _.reject(total, function(vid){
                        return (vid.file.tournamentName == video.file.tournamentName &&
                        vid.file.round == video.file.round &&
                        vid.file.player1.smashtag == video.file.player1.smashtag &&
                        vid.file.player2.smashtag == video.file.player2.smashtag)
                    });

                    Cache.cache.set(keys.allClips, total, function(err, success){
                        if(!err && success) resolve(success);
                        else reject(err);
                    })
                })
                .catch(function(err){
                    if(err){
                        log.error(err);
                        return reject(err);
                    }
                    return reject();
                })
        })
    }

    static deleteClipFromCache(video, tournament, round, p1tag, p2tag){
        return new Promise(function(resolve, reject){
            var uid = format(keys.clipInfo, tournament, round, p1tag, p2tag);
            Cache.cache.del(uid, function(err, count){
                if(err){
                    log.error(err);
                    return reject(err);
                }

                Cache.removeClipFromTotal(video)
                    .then(function(success){
                        resolve(success);
                    })
                    .catch(function(err){
                        if(err){
                            log.error(err);
                            return reject(err);
                        }
                        return reject();
                    })
            });
        })
    }

    static cacheClipInfo(video, tournament, round, p1tag, p2tag){
        return new Promise(function(resolve, reject){
            Cache.addToClipCache(video);
            var uid = format(keys.clipInfo, tournament, round, p1tag, p2tag);
            Cache.cache.set(uid, video, function(err, success){
                if(err){
                    log.error(err.stack);
                    return reject(err);
                }
                return resolve(success);
            })
        })
    }

    static getClipInfo(tournament, round, p1tag, p2tag){
        return new Promise(function(resolve, reject){
            var uid = format(keys.clipInfo, tournament, round, p1tag, p2tag);
            Cache.cache.get(uid, function(err, value){
                if(err) {
                    log.error(err.stack);
                    reject(err);
                }
                else
                    resolve(value);
            })
        })
    }
}

/** DEFINE THE CACHE OBJECT AS A SINGLETON **/
let singleton = {};

const CACHE_KEY = Symbol.for('ECX.SPLASH.CACHE');

let globalSymbols = Object.getOwnPropertySymbols(global);
let hasCache      = (globalSymbols.indexOf(CACHE_KEY) > -1);

if(!hasCache){
    Cache.init();
    global[CACHE_KEY] = Cache
}

Object.defineProperty(singleton, "instance", {
    get: function(){
        return global[CACHE_KEY];
    }
});

Object.freeze(singleton);

module.exports = singleton;