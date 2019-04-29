const sequelize = require('../../src/db/models').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;

describe('Topic', () => {
  beforeEach((done) => {
    this.topic;
    Topic.create({
      title: 'Starfleet Captains',
      description: 'Which Starfleet Captain fits your personality?'
    })
    .then((topic) => {
      this.topic = topic;
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
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
        title: 'Janeway all the way',
        body: 'Because I do what needs to be done while maintaining my humanity',
        topicId: this.topic.id
      })
      .then((post) => {
        Topic.findById(post.topicId)
        .then((topic) => {
          topic.getPosts()
          .then((posts) => {
            expect(posts[0].title).toBe('Janeway all the way');
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
