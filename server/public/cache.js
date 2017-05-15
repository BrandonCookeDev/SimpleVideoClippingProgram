'use strict';

let log    = require('winston');
let format = require('util').format;
let NodeCache = require('node-cache');

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
            })
        }
    }

    static destroy(){
        Cache.cache.flushAll();
        Cache.cache.close();
    }

    static addToClipCache(video){
        return new Promise(function(resolve, reject){
            Cache.getClipCache()
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
                        clipsArr.push(video);
                        Cache.cache.set(keys.allClips, clipsArr, function(err, success){
                            if(err){
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

    static getClipCache(){
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

    static cacheClipInfo(video){
        return new Promise(function(resolve, reject){
            var uid = format(keys.clipInfo, video.tournament, video.round, video.player1.smashtag, video.player2.smashtag);
            Cache.set(uid, video, function(err, success){
                if(err){
                    log.error(err.stack);
                    reject(err);
                }
                else
                    resolve(success);
            })
        })
    }

    static getClipInfo(tournament, round, p1tag, p2tag){
        return new Promise(function(resolve, reject){
            var uid = format(keys.clipInfo, tournament, round, p1tag, p2tag);
            Cache.get(uid, function(err, value){
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