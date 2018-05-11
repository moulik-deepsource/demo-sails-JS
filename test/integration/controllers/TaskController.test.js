/* eslint no-unused-vars: "off" */
let chai = require('chai');
let sails = require('sails');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);
describe('Test Task controller', () => {
  describe('POST /api/task - Create new task', () => {
    it('It should return 200 when create new task successfully', done => {
      let newTask = {
        text: ' Test new task'
      };
      chai.request(sails.hooks.http.app)
        .post('/api/task')
        .send(newTask)
        .end((err, res) => {
          if (err) {
            sails.log(err);
          }
          res.should.have.status(200);
          res.body.should.have.property('success');
          res.body.success.should.be.equal(true);
          done();
        });
    });

    it('It should return 400 when missing task content in request body', done => {
      let newTask = {};
      chai.request(sails.hooks.http.app)
        .post('/api/task')
        .send(newTask)
        .end((err, res) => {
          if (err) {
            sails.log(err);
          }
          res.should.have.status(400);
          res.body.should.have.property('success');
          res.body.success.should.be.equal(false);
          res.body.should.have.property('message');
          res.body.message.should.be.equal('Missing content of task');
          done();
        });
    });
  });

  describe('GET /api/tasks - Return all tasks', () => {
    before(done => {
      Task.destroy({}, (err, results) => {
        if (err) {
          return done(err);
        }
        return done();
      });
    });
    it('It should return 200 when return all tasks successfully', done => {
      let firstTask = {
        text: 'first task'
      };
      Task.create(firstTask).exec((err, result) => {
        if (err) {
          sails.log(err);
        } else {
          chai.request(sails.hooks.http.app)
            .get('/api/tasks')
            .end((err, res) => {
              if (err) {
                sails.log(err);
              }
              res.should.have.status(200);
              res.body.should.have.property('success');
              res.body.success.should.be.equal(true);
              res.body.should.have.property('tasks');
              res.body.tasks.should.be.an('Array');
              res.body.tasks.length.should.be.equal(1);
              done();
            });
        }
      });
    });
  });

  describe('DELETE /api/task/:id - Delete task', () => {
    it('It should return 200 when delete task successfully', async () =>{
      let firstTask = await Task.create({
        text: 'first task'
      }).fetch();
      chai.request(sails.hooks.http.app)
        .delete('/api/task/' + firstTask.id)
        .end((err, res) => {
          if (err) {
            sails.log(err);
          }
          res.should.have.status(200);
          res.body.should.have.property('success');
          res.body.success.should.be.equal(true);
        });
    });

    it('It should return 404 when task not found', async () =>{
      let firstTask = await Task.create({
        text: 'first task'
      }).fetch();
      chai.request(sails.hooks.http.app)
        .delete('/api/task/jshf' + firstTask.id)
        .end((err, res) => {
          if (err) {
            sails.log(err);
          }
          res.should.have.status(404);
          res.body.should.have.property('success');
          res.body.success.should.be.equal(false);
          res.body.should.have.property('message');
          res.body.message.should.be.equal('Task not found');
        });
    });
  });

  describe('PUT /api/task/:id - Update task', () => {
    it('It should return 200 when update task successfully', async () => {
      let firstTask = await Task.create({
        text: 'first task'
      }).fetch();
      let updateTask = {
        text: 'updated',
        status: false
      };
      chai.request(sails.hooks.http.app)
        .put('/api/task/' + firstTask.id)
        .send(updateTask)
        .end((err, res) => {
          if (err) {
            sails.log(err);
          }
          res.should.have.status(200);
          res.body.should.have.property('success');
          res.body.success.should.be.equal(true);
          res.body.should.have.property('message');
          res.body.message.should.be.equal('Task updated');
        });
    });

    it('It should return 404 when task id not found', async () => {
      let firstTask = await Task.create({
        text: 'first task'
      }).fetch();
      let updateTask = {
        text: 'updated',
        status: false
      };
      chai.request(sails.hooks.http.app)
        .put('/api/task/asfh'+ firstTask.id)
        .send(updateTask)
        .end((err, res) => {
          if (err) {
            sails.log(err);
          }
          res.should.have.status(404);
          res.should.have.status(404);
          res.body.should.have.property('success');
          res.body.success.should.be.equal(false);
          res.body.should.have.property('message');
          res.body.message.should.be.equal('Task not found');
        });
    });

    it('It should return 400 when missing task content in request body', async () => {
      let firstTask = await Task.create({
        text: 'first task'
      }).fetch();
      let updateTask = {
        status: false
      };
      chai.request(sails.hooks.http.app)
        .put('/api/task/' + firstTask.id)
        .send(updateTask)
        .end((err, res) => {
          if (err) {
            sails.log(err);
          }
          res.should.have.status(400);
          res.body.should.have.property('success');
          res.body.success.should.be.equal(false);
          res.body.should.have.property('message');
          res.body.message.should.be.equal('Missing content of task');
        });
    });

    it('It should return 400 when missing task status in request body', async () => {
      let firstTask = await Task.create({
        text: 'first task'
      }).fetch();
      let updateTask = {
        text: 'updated',
      };
      chai.request(sails.hooks.http.app)
        .put('/api/task/' + firstTask.id)
        .send(updateTask)
        .end((err, res) => {
          if (err) {
            sails.log(err);
          }
          res.should.have.status(400);
          res.body.should.have.property('success');
          res.body.success.should.be.equal(false);
          res.body.should.have.property('message');
          res.body.message.should.be.equal('Missing content of task');
        });
    });
  });
});
