const sequelize = require('../../src/db/models').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const User = require('../../src/db/models').User;

describe('Topic', () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: 'starman@tesla.com',
        password: 'Trekkie4lyfe'
      })
      .then((user) => {
        this.user = user;

        Topic.create({
          title: 'Expeditions to Alpha Centauri',
          description: 'A compilation of reports from recent visits to the star system.',
          posts: [{
            title: 'My first visit to Proxima Centauri b',
            body: 'I saw some rocks.',
            userId: this.user.id
          }]
        }, {
          include: {
            model: Post,
            as: 'posts'
          }
        })
        .then((topic) => {
          this.topic = topic;
          this.post = topic.posts[0];
          done();
        });
      });
    });
  });

  describe('#create()', () => {
    it('should create a new topic and store it in the database', (done) => {
      Topic.create({
        title: 'Coolest Baddies',
        description: 'Best baddies in the universe'
      })
      .then((topic) => {
        Topic.findOne({
          where: { title: 'Coolest Baddies' }
        })
        .then((topic) => {
          expect(topic.description).toBe('Best baddies in the universe');
          done();
        })
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe('#getPosts()', () => {
    it('should return posts associated with given topic', (done) => {
      Post.create({
        title: 'Transit Experience',
        body: 'It took so long to get there!',
        topicId: this.topic.id,
        userId: this.user.id
      })
      .then((post) => {
        Topic.findById(post.topicId)
        .then((topic) => {
          topic.getPosts()
          .then((posts) => {
            expect(posts[1].title).toBe('Transit Experience');
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
