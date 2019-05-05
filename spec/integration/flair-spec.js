const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/topics';

const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const Flair = require('../../src/db/models').Flair;

describe(' routes : flair ', () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({force: true}).then(() => {
      Topic.create({
        title: 'Dream Garage',
        description: 'What 3 cars would you pick for your dream garage?'
      })
      .then((topic) => {
        this.topic = topic;
        Post.create({
          title: 'Italian Dream Garage',
          body: 'Ferrari 458 Italia, Lamborghini Miura, Lancia Stratos',
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          Flair.create({
              name: 'Italian',
              color: '#d40000',
              postId: this.post.id
          })
          .then((flair) => {
            this.flair = flair;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });
  });

  describe('GET /topics/:topicId/posts/:postId/flair/new', () => {
    it('should render a new flair form', (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flair/new`,
      (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('New Flair');
        done();
      });
    });
  });


  describe('POST /topics/:topicId/posts/:postId/flair/create', () => {
    it('should create a new flair tag for the assigned post', (done) => {
      let options = {
        url: `${base}/${this.topic.id}/posts/${this.post.id}/flair/create`,
        form: {
          name: 'Fast',
          color: '#8ff34c'
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        Flair.findOne({ where: {name: 'Fast'} })
        .then((flair) => {
          expect(flair).not.toBeNull();
          expect(flair.color).toBe('#8ff34c');

          request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain('Fast');
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe('POST /topics/:topicId/posts/:postId/flair/:flairId/destroy', () => {
    it('should delete the specified flair', (done) => {
      let newFlair = {
        name: 'Fast',
        color: '#8ff34c',
        postId: this.post.id
      };

      Flair.create(newFlair)
      .then((flair) => {
        expect(flair).not.toBeNull();
        Flair.findAll()
        .then((flairs) => {
          let flairCountBeforeDestroy = flairs.length;
          expect(flairCountBeforeDestroy).toBe(2);

          request.post(`${base}/${this.topic.id}/posts/${this.post.id}/flair/${flair.id}/destroy`, (err, res, body) => {
            expect(err).toBeNull();

            Flair.findAll()
            .then((flairs) => {
              expect(flairs.length).toBe(flairCountBeforeDestroy - 1);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });
    });
  });

  describe('GET /topics/:topicId/posts/:postId/flair/:flairId/edit', () => {
    it('should display a form to edit selected flair', (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flair/${this.flair.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('Edit Flair');
        done();
      });
    });
  });

  describe('GET /topics/:topicId/posts/:postId/flair/:flairId/update', () => {
    it('should update the selected flair with new values', (done) => {
      let options = {
        url: `${base}/${this.topic.id}/posts/${this.post.id}/flair/${this.flair.id}/update`,
        form: {
          name: 'Italian',
          color: '#f7fa09'
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Flair.findById(this.flair.id)
        .then((flair) => {
          expect(flair.color).toBe('#f7fa09');
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
});
