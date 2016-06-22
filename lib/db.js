import sqlite from 'sqlite3'
import path from 'path'
import fs from 'fs'
import log from './log'

function firstOrDefault(arr, $default = null) {
  return arr && arr.length ? arr[0] : $default;
}

/**
 * Creates an instance of ScrapeDatabase, and initializes it with 
 * a schema, if missing. For in-memory databases, you can pass ":memory:" as dbPath.
 */
async function create(dbPath = path.join(process.cwd(), 'data.db')) {
  log.info('Connecting to scrape db "%s"', dbPath); 
  return new Promise((resolve, reject) => {
    const isNew = fs.existsSync(dbPath);

    const db = new sqlite.Database(dbPath, (err) => {
      if (err) return reject(err);

      const instance = new ScrapeDatabase(db);

      instance.createSchema()
        .then(_ => {
          log.info('Database connection established.');
          resolve(instance)
        });
    });
  });
}

class ScrapeDatabase {
  constructor(connection) {
    this.conn = connection;
  }

  /**
   * @private 
   * 
   * Runs arbitrary statements against the database.
   */
  run_(stmt, ...params) {
    return new Promise((resolve, reject) => {
      this.conn.run(stmt, params, function (err) {
        if (err) return reject(err);

        resolve(this.lastID);
      });
    });
  }

  select_(stmt, ...params) {
     return new Promise((resolve, reject) => {
      this.conn.all(stmt, params, function (err, rows) {
        if (err) return reject(err);

        resolve(rows);
      });
    });
  }

  async createSchema() {
    try {
      await this.run_('CREATE TABLE IF NOT EXISTS Session(provider TEXT, started TEXT, finished TEXT)');
      await this.run_('CREATE TABLE IF NOT EXISTS Page(sessionId INT NOT NULL, type TEXT, url NOT NULL, parentUrl INT, scrapeDate TEXT, metadata TEXT, data TEXT)');
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async createSession(provider) {
    log.debug('Session: %s', provider);
    return this.run_('INSERT INTO Session VALUES (?,?,?)', provider, new Date().toISOString(), null);
  }

  async createPage(sessionId, type, url, parentUrl = null, scrapeDate = null, metaData = null, data = null) {
    let metaStr = metaData ? JSON.stringify(metaData) : null;
    let dataStr = data ? JSON.stringify(data) : null;

    log.debug('Page: %d, %s, %s', sessionId, url, parentUrl); 
    return this.run_('INSERT INTO Page VALUES (?,?,?,?,?,?,?)', sessionId, type, url, parentUrl, scrapeDate, metaStr, dataStr);
  }
  
  async exists(sessionId, type, url) {
    let result = await this.select_('SELECT COUNT(*) as cnt FROM Page WHERE sessionId = ? AND type = ? AND url = ?', sessionId, type, url);
    log.debug(result);

    return firstOrDefault(result).cnt > 0;
  }

  async markScraped(sessionId, type, url, parentUrl = null, scrapeDate = null, metaData = null, data = null) {
    let exists = await this.exists(sessionId, type, url);
    
    if (!exists) {
      return this.createPage(sessionId, type, url, parentUrl, scrapeDate, metaData, data)
    } else {
      return this.updatePage(sessionId, type, url, scrapeDate, metaData, data);
    }
  }

  async updatePage(sessionId, type, url, scrapeDate, metaData, data) {
    let metaStr = metaData ? JSON.stringify(metaData) : null;
    let dataStr = data ? JSON.stringify(data) : null;
    
    log.debug('Update Page: %s, %s, %s', url, scrapeDate, metaStr);
    return this.run_('UPDATE Page SET scrapeDate = ?, metaData  = ?, data = ? WHERE sessionId = ? and type = ? AND url = ?', scrapeDate, metaStr, dataStr, sessionId, type, url);
  }

  async updateSession(sessionId, finishDate) {
    log.debug('Update Session: %d, %s', sessionId, finishDate); 
    return this.run_('UPDATE Session SET finished = ? WHERE ROWID = ?', finishDate, sessionId);
  }

  async getSession(sessionId) {
    log.debug('Get session: %d', sessionId);
    let rows = await this.select_('SELECT rowid as id, * FROM Session WHERE ROWID = ?', sessionId);

    let session = firstOrDefault(rows);

    if (session) {
      session.queue = await this.select_('SELECT * from Page where sessionId = ? and scrapeDate is null', sessionId); 
    }

    return session;
  }
}

export default create;