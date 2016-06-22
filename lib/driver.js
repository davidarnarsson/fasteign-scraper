import log from './log'
import needle from 'needle'

export default function needleDriver(ctx, done) {

  var tryCount = 0, maxTries = 5;

  function tryRequest() {
    log.info('Trying %s, %d/%d (%d)', ctx.url, tryCount + 1, maxTries, Math.random());
    needle.get(ctx.url, function (err, res) {
      if (res && res.statusCode == 200) {
        ctx.body = res.body;
        done(null, ctx);
      } else if (tryCount < maxTries) {
        tryCount++;
        tryRequest();
      } else {
        done(err, null);
      }
    });
  }

  tryRequest();
};