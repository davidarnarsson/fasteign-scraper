import accounting from 'accounting'
import sanitizeHtml from 'sanitize-html'
import needle from 'needle'
import log from './log';

const formData = 'searchpnr=101%2C103%2C104%2C105%2C107%2C108%2C109%2C110%2C111%2C112%2C113%2C114%2C116%2C170%2C200%2C201%2C203%2C210%2C225%2C220%2C221%2C270%2C271%2C276%2C300%2C301%2C310%2C311%2C320%2C340%2C345%2C350%2C355%2C356%2C360%2C370%2C371%2C380%2C400%2C401%2C410%2C415%2C420%2C425%2C430%2C450%2C451%2C460%2C465%2C470%2C471%2C500%2C510%2C512%2C520%2C524%2C530%2C531%2C540%2C541%2C545%2C550%2C551%2C560%2C565%2C566%2C570%2C580%2C600%2C601%2C603%2C610%2C611%2C620%2C621%2C625%2C630%2C640%2C641%2C645%2C650%2C660%2C670%2C671%2C675%2C680%2C681%2C685%2C690%2C700%2C701%2C710%2C715%2C720%2C730%2C735%2C740%2C750%2C755%2C760%2C765%2C780%2C781%2C785%2C800%2C801%2C810%2C815%2C816%2C820%2C825%2C840%2C845%2C850%2C851%2C860%2C861%2C870%2C871%2C880%2C900%2C190%2C230%2C233%2C235%2C240%2C245%2C250%2C260&chk_postnr_101=101&chk_postnr_103=103&chk_postnr_104=104&chk_postnr_105=105&chk_postnr_107=107&chk_postnr_108=108&chk_postnr_109=109&chk_postnr_110=110&chk_postnr_111=111&chk_postnr_112=112&chk_postnr_113=113&chk_postnr_114=114&chk_postnr_116=116&chk_postnr_170=170&chk_postnr_200=200&chk_postnr_201=201&chk_postnr_203=203&chk_postnr_210=210&chk_postnr_225=225&chk_postnr_220=220&chk_postnr_221=221&chk_postnr_270=270&chk_postnr_271=271&chk_postnr_276=276&chk_postnr_300=300&chk_postnr_301=301&chk_postnr_310=310&chk_postnr_311=311&chk_postnr_320=320&chk_postnr_340=340&chk_postnr_345=345&chk_postnr_350=350&chk_postnr_355=355&chk_postnr_356=356&chk_postnr_360=360&chk_postnr_370=370&chk_postnr_371=371&chk_postnr_380=380&chk_postnr_400=400&chk_postnr_401=401&chk_postnr_410=410&chk_postnr_415=415&chk_postnr_420=420&chk_postnr_425=425&chk_postnr_430=430&chk_postnr_450=450&chk_postnr_451=451&chk_postnr_460=460&chk_postnr_465=465&chk_postnr_470=470&chk_postnr_471=471&chk_postnr_500=500&chk_postnr_510=510&chk_postnr_512=512&chk_postnr_520=520&chk_postnr_524=524&chk_postnr_530=530&chk_postnr_531=531&chk_postnr_540=540&chk_postnr_541=541&chk_postnr_545=545&chk_postnr_550=550&chk_postnr_551=551&chk_postnr_560=560&chk_postnr_565=565&chk_postnr_566=566&chk_postnr_570=570&chk_postnr_580=580&chk_postnr_600=600&chk_postnr_601=601&chk_postnr_603=603&chk_postnr_610=610&chk_postnr_611=611&chk_postnr_620=620&chk_postnr_621=621&chk_postnr_625=625&chk_postnr_630=630&chk_postnr_640=640&chk_postnr_641=641&chk_postnr_645=645&chk_postnr_650=650&chk_postnr_660=660&chk_postnr_670=670&chk_postnr_671=671&chk_postnr_675=675&chk_postnr_680=680&chk_postnr_681=681&chk_postnr_685=685&chk_postnr_690=690&chk_postnr_700=700&chk_postnr_701=701&chk_postnr_710=710&chk_postnr_715=715&chk_postnr_720=720&chk_postnr_730=730&chk_postnr_735=735&chk_postnr_740=740&chk_postnr_750=750&chk_postnr_755=755&chk_postnr_760=760&chk_postnr_765=765&chk_postnr_780=780&chk_postnr_781=781&chk_postnr_785=785&chk_postnr_800=800&chk_postnr_801=801&chk_postnr_810=810&chk_postnr_815=815&chk_postnr_816=816&chk_postnr_820=820&chk_postnr_825=825&chk_postnr_840=840&chk_postnr_845=845&chk_postnr_850=850&chk_postnr_851=851&chk_postnr_860=860&chk_postnr_861=861&chk_postnr_870=870&chk_postnr_871=871&chk_postnr_880=880&chk_postnr_900=900&chk_postnr_190=190&chk_postnr_230=230&chk_postnr_233=233&chk_postnr_235=235&chk_postnr_240=240&chk_postnr_245=245&chk_postnr_250=250&chk_postnr_260=260&streetsearch=&sqm-from=&sqm-to=&nbd-from=&nbd-to=&pri-from=&pri-to=&mrt-from=&mrt-to=&textsearch=&sortby=date';

const rootUrl = 'http://www.mbl.is/fasteignir/query/';


/* Various utility stuff */

const IDRegex = /fasteign\/(\d+)/
const extractId = (url) => {
  var results = IDRegex.exec(url)
  return results[1];
};

const CoordsRegex = /\[(\d+\.\d+),\s*-?\s*(\d+\.\d+)\]/mi;
const extractCoords = (row) => {
  var results = CoordsRegex.exec(row.mapscript);
  if (results && results.length >= 3) {
    row.lat_lon = [parseFloat(results[2]), parseFloat(results[1])];

    delete row.mapscript;
  }
}

const VariousInfo = {
  'Áhvílandi': 'ahvilandi',
  'Fasteignamat': 'fasteignarmat',
  'Brunabótamat': 'brunabotamat',
  'Tegund': 'type',
  'Byggingarár': 'construction_year',
  'Stærð': 'size',
  'Herbergi': 'rooms',
  'Svefnherbergi': 'bedrooms',
  'Stofur': 'living_rooms',
  'Baðherbergi': 'bathrooms',
  'Inngangur': 'entry_type',
  'Bílskúr': 'garage',
  'Skráð á vef:': 'registered',
  'Síðast breytt:': 'last_modified'
};

const CurrencyKeys = ['Áhvílandi', 'Fasteignamat', 'Brunabótamat'];
const NumberKeys = ['Byggingarár', 'Herbergi', 'Svefnherbergi', 'Stofur', 'Baðherbergi'];

const tryParseNumber = (value) => {
  var parsed = parseInt(value, 10);
  return isNaN(parsed) ? -1 : parsed;
}

const tryParseCurrency = (value) => {
  var parsed = accounting.unformat(value, ',');
  return isNaN(parsed) ? -1 : parsed;
}

const extractLocation = (row) => {
  if (row && row.location) {
    var data = row.location.split(' ');
    if (data && data.length >= 2) {
      row.postcode = data[0];
      row.city_inflection = data[1];
    }
  }
};

const extractVariousInfo = (row) => {
  if (!row || !row.numbers) return;

  row.numbers.forEach(x => {
    var key = x.desc.trim();
    x.value = x.value.trim();

    if (VariousInfo[key]) {
      var value = x.value;

      if (CurrencyKeys.indexOf(key) >= 0) {
        value = tryParseCurrency(value);
      } else if (NumberKeys.indexOf(key) >= 0) {
        value = tryParseNumber(value);
      } else if (key === 'Stærð') {
        var bobobo = /\d+/.exec(value);
        if (bobobo) {
          value = +bobobo[0];
        } else {
          value = -1;
        }
      }

      row[VariousInfo[key]] = value;
    }
  });
};



/**
 * Creates a adapter capable of scraping the mbl.is real estate pages.
 */
export default function mbl(x) {

  function scrapeListPage(url) {
    log.debug('MBL: Scraping list page: %s', url);

    return new Promise((resolve, reject) => {
      x(url, '#fs-canvas', {
        nextLinkPage: '.pagination span.next a@href',
        properties: x('#resultlist .single-realestate', [{
          thumb: '.profile img@src',
          link: '.profile a@href',
          location: '.realestate-head h5'
        }])
      })((err, data) => {
        if (err) return reject(err);

        let nextPage = { url: data.nextLinkPage, metadata: null, type: 'listpage', parentUrl: url }
        let realEstatePages = data.properties.map(x => ({ 
          url: x.link, 
          metadata: x, 
          type: 'realestate',
          parentUrl: url
         }));

        let links = data.nextLinkPage ? [nextPage].concat(realEstatePages) : [];

        const response = {
          url,
          links: links,
          type: 'listpage',
          metadata: null,
          data
        };

        resolve(response);
      });
    });
  }

  /**
   * scrapes an individual real estate page, and returns the scraped data.
   * 
   * @param String {url}
   * @param Object {metadata}
   */
	 function scrapeRealEstatePage(url, metadata) {
    log.debug('MBL: Scraping real estate page: %s', url);
    return new Promise((resolve, reject) => {
      x(url, '.realestate', {
        price: '.realestate-headline-price',
        street: '.realestate-headline-address > strong',
        images: x('.mblcarousel .item', [{
          full: 'img@data-fullsize',
          normal: 'img@data-normalsize'
        }]),
        description: '#realestate-user-action-infobox .description@html',
        numbers: x('#realestate-user-action-infobox .numbers table tr', [{ desc: 'td:first-child', value: 'td:last-child' }]),
        mapscript: '.mapwrapper > script@text'
      })((err, row) => {
        if (err) {
          reject(err);
        } else {
          row.location = metadata.location;
          row.thumb = metadata.thumb;
          row.link = url;
          row.id = extractId(url);
          row.description = sanitizeHtml(row.description);

          if (row.price) {
            row.price = tryParseCurrency(row.price.trim())
          }

          extractLocation(row);
          extractCoords(row);
          extractVariousInfo(row);

          const response = {
            url,
            type: 'realestate',
            links: [],
            data: row
          };

          resolve(response);
        }
      });
    });
  }

  return {
    name: 'mbl',

    request(ctx) {
      const { url, metadata } = ctx;

      if (/fasteignir\/leit/i.test(url)) {
        return scrapeListPage(url, metadata);
      } else {
        return scrapeRealEstatePage(url, metadata);
      }
    },

    /**
     * Requests the root result page from mbl.is. Mbl.is generates a query ID from the given 
     * query parameters and redirects the user to it. It looks to be the same every time but
     * I can't be sure.
     * 
     * @returns a Promise of the root result page location.
     */
    requestRootResultPages() {
      return new Promise((resolve, reject) => {
        needle.post(rootUrl, formData, (err, res) => {
          if (res && res.statusCode === 302) {
            resolve([{ url: res.headers.location, metadata: null }]);
          } else {
            reject(err || res.statusCode);
          }
        });
      });
    }
  }
} 