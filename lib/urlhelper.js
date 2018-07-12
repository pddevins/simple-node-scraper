const cheerio = require('cheerio');

module.exports = {
    cleanUrl: (link, baseUrl) => {
        // TODO : Allow approved extensions like php, html, etc
        const matchExtensions = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;
        // TODO : Make a better layer for exclusions
        if(link.match(matchExtensions) || link.includes('#')) {
            return false;
        }
        const prepUrl = new URL(link, baseUrl).href;
                
        if(!prepUrl || !prepUrl.startsWith(baseUrl)) {
            return false;
        }

        return prepUrl;

    },

    getLinks: (html) => {
        return cheerio("a", html).map( (i, el) => {
            return cheerio(el).attr('href');
        }).get();
    }
}