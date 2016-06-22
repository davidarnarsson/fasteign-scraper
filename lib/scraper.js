import log from './log'
import Rx from 'rxjs'

export default class Scraper {
  constructor(site, fetchInterval = 1000, timeout = 20000) {
    this.timeout = timeout;
    this.site = site;  
    this.fetchInterval = fetchInterval;  
  } 

  async scrape(queue) {
    let subject = new Rx.Subject(); 
    let interval = Rx.Observable.interval(this.fetchInterval); 

    var source = subject
      .flatMap(x => this.site.request(x))
      .timeout(this.timeout)
      .share();

    log.info('Hydrating link queue...');
    let subscription = interval.subscribe((v) => {
      log.debug("INTERVAL %d", v)
      // if the queue has anything, we take the first element and 
      // scrape it.   
      if (queue.length) {
        var val = queue.shift(); 
        log.debug("Pushing url %s onto process queue", val.url); 
        subject.next(val); 
      } 
    });    
    
    source.subscribe(
        response => {
          log.debug("RESPONSE: %s", response.url)
          // if there are more links to follow in this response
          // we add them to the back of the queue and press on.
          if (response.links && response.links.length) {
            log.debug("LINKS: %d", response.links.length)
            response.links.forEach(link => queue.push(link)); 
          } 
        }
      , (err) => console.error(err)
      , () => console.log("COMPLETE"));


    return source; 
  }

  async scrapeFromStart() {
    log.info('Starting scrape from start...'); 
    let root = await this.site.requestRootResultPage();
    log.debug("ROOT", root);
    return await this.scrape([root])
  } 
}