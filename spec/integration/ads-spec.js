const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/ads/';
const sequelize = require('../../src/db/models/index').sequelize;
const Advertisement = require('../../src/db/models').Advertisement;

describe(' routes : advertisements ', () => {
  beforeEach((done) => {
    this.ad;
    sequelize.sync({force: true}).then((res) => {
      Advertisement.create({
        title: 'Babel Fish',
        description: 'Universal translator that crosses the language divide between any species'
      })
      .then((ad) => {
        this.ad = ad;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe('GET /ads', () => {
    it('should return status code 200 all ads', (done) => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(res.statusCode).toBe(200);
        expect(body).toContain('Advertisements');
        expect(body).toContain('Babel Fish');
        done();
      });
    });
  });

  describe('GET /ads/new', () => {
    it('should render a new ad form', (done) => {
      request.get(`${base}new`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain('New Advertisement');
      done();
      });
    });
  });

  describe('POST /ads/create', () => {
    const options = {
      url: `${base}create`,
      form: {
        title: 'Towel',
        description: 'Just about the most massively useful thing an interstellar hitchhiker can carry'
      }
    };

    it('should create a new ad and redirect', (done) => {
      request.post(options, (err, res, body) => {

        Advertisement.findOne({ where: {title: 'Babel Fish'}}).then((ad) => {
          expect(res.statusCode).toBe(303);
          expect(ad.title).toBe('Towel');
          expect(ad.description).toBe('Just about the most massively useful thing an interstellar hitchhiker can carry');
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      })
    });
  });

  describe('GET /ads/:id', () => {
    it('should display selected advertisement', (done) => {
      request.get(`${base}${this.ad.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('Babel Fish');
        done();
      });
    });
  });

  describe('POST ad/:id/destroy', () => {
    it('should delete ad corresponding to ID', (done) => {
      Advertisement.all()
      .then((ads) => {
        const adCountBeforeDelete = ads.length;
        expect(adCountBeforeDelete).toBe(1);

        request.post(`${base}${this.ad.id}/destroy`, (err, res, body) => {
          Advertisement.all()
          .then((ads) => {
            expect(err).toBeNull;
            expect(ads.length).toBe(adCountBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });

  describe('GET ads/:id/edit', () => {
    it('should display an editing form', (done) => {
      request.get(`${base}${this.ad.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('Edit Advertisement');
        expect(body).toContain('Babel Fish');
        done();
      });
    });
  });

  describe('POST /ads/:id/update', () => {
    it('should update the ad with new values', (done) => {
      const options = {
        url: `${base}${this.ad.id}/update`,
        form: {
          title: 'Babel Fish',
          description: 'Probably the oddest thing in the universe'
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Advertisement.findOne({
          where: { id: this.ad.id }
        })
        .then((ad) => {
          expect(ad.description).toBe('Probably the oddest thing in the universe');
          done();
        });
      });
    });
  });

});