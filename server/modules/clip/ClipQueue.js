var _ = require('lodash');

class ClipQueue{
    static init(){
        ClipQueue.queue = [];
        ClipQueue.killsignals = [];
        ClipQueue.id = 0;
    }

    static addToQueue(clip, killSignal, process){
        var id = ClipQueue.id++;

        var item = {
            id: id,
            clip: clip,
            killSignal: killSignal,
            process: process
        };
        ClipQueue.queue.push(item);

        return item;
    }

    static createKillsignalNumber(){
        var rand, done = false;

        do {
            rand = Math.floor(Math.random() * (10000));
            if(ClipQueue.killsignals.indexOf(rand) < 0) done = true;
        }while(!done);

        ClipQueue.killsignals.push(rand);
        return rand;
    }

    static getItemFromQueue(id){
        return _.find(ClipQueue.queue, {id: id});
    }

    static removeFromQueue(id){
        var item = _.find(ClipQueue.queue, {id: id});
        ClipQueue.queue = _.reject(ClipQueue.queue, {id: item.id});
        ClipQueue.killsignals = _.reject(ClipQueue.killsignals, function(sig){
            return sig = item.killsignal;
        })
    }
}

module.exports = ClipQueue;