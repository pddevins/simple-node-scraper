const got = require('got');
const urlHelper = require('./lib/urlhelper');

// Fetch the url, extract title, links, and meta date
const getUrl = (url, baseUrl, alreadyChecked, collector) => {
    return new Promise( async (resolve, reject) => {
        try {
            const response = await got(url);
            collector.push({
                url,
                lastmod: (response.headers["last-modified"]) ? response.headers["last-modified"] : ''
            });

            const children = urlHelper.getLinks(response.body).filter((link) => {
                const cleanUrl = urlHelper.cleanUrl(link, baseUrl);
                return ( cleanUrl && !alreadyChecked.includes(cleanUrl) );
            }).map((link) => {
                const cleanLink = urlHelper.cleanUrl(link, baseUrl);
                alreadyChecked.push(cleanLink);
                return getUrl(cleanLink, baseUrl, alreadyChecked, collector);
            });
            await Promise.all([...children]);
            resolve(collector);
            return;  
        } catch (error) {
            reject(error);
            return;
        }
    });
}

module.exports = async (input) => {

    return new Promise(  async (resolve, reject) => {
        if( !input.match(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gmi)) {
            reject('Invalid Url', input);
            return;
        }

        const baseUrl = input;

        try {
            let collector = [];
            let alreadyChecked = [baseUrl];
            const fetch = await getUrl(input, baseUrl, alreadyChecked, collector);
            resolve(fetch);
            return;
        } catch (e) {
            reject(e);
            return;
        }

    });
}