var sails = require('sails');

before(done => {
  // this.timeout(5000);
  sails.lift({
    log: {level: 'wanr'}
  }, err => {
    if(err){
      return done(err);
    }
    return done();
  });
});

after(done => {
  sails.lower(done);
});
