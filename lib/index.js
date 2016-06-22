import Xray from 'x-ray'
import log from './log'
import create from './db'
import mbl from './mbl'
import Scraper from './Scraper'
import driver from './driver'

const args = Object.assign({
  session: null,
  fetchInterval: 1000,
  timeout: 20000
}, require('yargs').argv);

// todo: find a better solution with regards to existing sessions, adapters and initial queues
async function getSession(db, adapter) {
  let session
  if (args.session) {
    session = await db.getSession(args.session);
  } else {
    session = {};
    session.id = await db.createSession(adapter.name);
    
    session.queue = await adapter.requestRootResultPages();
  }

  return session;
}

async function run() {
  var db = await create();
  let x = Xray().driver(driver);
  let site = mbl(x);

  let session = await getSession(db, site);
  
  if (!session) throw new Error("Session " + args.session + " not found!");

  log.info('Starting run, session %d, provider %s', session.id, session.provider);

  let scraper = new Scraper(site, args.fetchInterval, args.timeout);
  let subscription;

  subscription = await scraper.scrape(session.queue);

  subscription.subscribe(page => {
    db.markScraped(session.id, page.type, page.url, page.parentUrl, new Date().toISOString(), page.metadata, page.data);

    page.links.forEach(l => {
      db.createPage(session.id, l.type, l.url, l.parentUrl, null, l.metadata, l.data);
    });
  });
}


run()
  .then(() => log.info('Done.'))
  .catch(e => console.error(e));