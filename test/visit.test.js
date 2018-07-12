const visit = require('../visit')
const nock = require('nock');
const fs = require('fs-then-native');
const oddball = fs.readFileSync('./test/data/index.html', 'utf8');
const oddballchild = fs.readFileSync('./test/data/childpage.html', 'utf8');

describe('visit', () => {

    it('should error if invalid url', async (done) => {
        try {
            const badVisit = await visit("foobar");
        } catch(e) {
            expect(e).toBe('Invalid Url');
        }

        done();
    });

    it('should fetch a page if url is good', async (done) => {
        nock('https://www.oddball.io')
        .get('/')
        .reply(200, 'fetched', {'last-modified': 'Tue, 10 Jul 2018 02:16:12 GMT'});
                
        const goodVisit = await visit("https://www.oddball.io/");
        expect(goodVisit[0].lastmod).toBe('Tue, 10 Jul 2018 02:16:12 GMT');
        done();
            
    });

    it('should include child links', async (done) => {
        nock('https://www.oddball.io', { allowUnmocked: false })
        .get('/')
        .reply(200, oddball, {'last-modified': 'Tue, 10 Jul 2018 02:16:12 GMT'});
    
        nock("https://www.oddball.io", { allowUnmocked: false })
        .persist()
        .filteringPath((path) => {
            if(path != '/') {
                return '/fake';
            }
        })
        .get("/fake")
        .reply(200, oddballchild, {'last-modified': 'Tue, 10 Jul 2018 02:16:12 GMT'});
        
        try {
            const links = await visit("https://www.oddball.io/");
            expect(links.length).toBe(11);
        } catch(e) {
            console.log("error", e);
        }

        done();
    });
});