'use strict';

let wreck	= require('wreck');
let cheerio = require('cheerio');

class OauthScraper {

	constructor(url){
		this.url = url;
	}

	async scrape(){
		let response = wreck.get(this.url);

	}

}