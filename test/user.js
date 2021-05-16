process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const User = require('../server/models/user');
const { server } = require('../server/server');
const request = require('supertest');

chai.use(chaiHttp);

const registerData = {
  issuer: 'self',
  data: {
    userName: 'Code',
    lastName: 'Royale',
    email: 'coderoyale@gmail.com',
    password: 'hash',
    signUpType: 'native',
  },
};

const loginData = {
  email: 'coderoyale@gmail.com',
  password: 'hash',
};

const updateData = {
  firstName: 'Codi',
  lastName: 'Royali',
};

//now let's login the user before we run any tests
var authenticatedUser = request.agent(server);
var token;

describe('USER API TESTING', () => {
  // Login User
  it('it should login user', (done) => {
    authenticatedUser
      .post('/mock')
      .send(loginData)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(true);
        res.body.payload.should.have
          .property('message')
          .eql('SUCCESSFUL LOGIN');
        res.body.payload.should.have.property('accessToken');
        token = res.body.payload.accessToken;
        done();
      });
  });

  // Get Info
  it('it should get info of user', (done) => {
    authenticatedUser
      .get('/users/info?email=coderoyale@gmail.com')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(true);
        res.body.payload.should.have.property('message').eql('INFO');
        res.body.payload.should.have.property('accessToken');
        res.body.payload.should.have
          .property('email')
          .eql('coderoyale@gmail.com');
        done();
      });
  });

  // Username Availibility
  it('it should check availability of user name', (done) => {
    authenticatedUser
      .get('/users/username?userName=CodeMe')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(true);
        res.body.payload.should.have.property('message').eql('DATA UPDATABLE');
        res.body.payload.should.have.property('accessToken');
        done();
      });
  });

  // Update User Profile
  it('it should update user profile', (done) => {
    authenticatedUser
      .patch('/users/update')
      .set('Authorization', 'Bearer ' + token)
      .send(updateData)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(true);
        res.body.payload.should.have.property('message').eql('DATA UPDATED');
        res.body.payload.should.have.property('accessToken');
        token = res.body.payload.accessToken;
        done();
      });
  });

  // Logout User
  it('it should logout user', (done) => {
    authenticatedUser
      .get('/users/logout')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(true);
        res.body.payload.should.have
          .property('message')
          .eql('SUCCESSFUL LOGOUT');
        done();
      });
  });

  // Username Availibility Doesn't work after logout
  it("it shouldn't check availability of user name", (done) => {
    authenticatedUser
      .get('/users/username?userName=CodeMe')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('status').eql(false);
        res.body.payload.should.have.property('message').eql('AUTH FAIL');
        done();
      });
  });
});
