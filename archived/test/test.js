'use strict';

let chai = require('chai');
chai.use(require('chai-as-promised'));
let expect = chai.expect;
let assert = chai.assert;


let Cache = require('../server/modules/cache/cache');
Cache.init();
Cache = Cache.instance();

let cacheKey = 'testing::cache::key';
let cacheObj = {
    
}

describe('cookie cutter', function(){
    
    before(done => {
        
    })
    
    after(done => {
        
    })
    
    it('should cache correctly', done => {
        let val = JSON.stringify(cacheObj);
        Cache.set
    })
    
    it('should get from cache correctly', done => {
        
    })
    
    
    
})