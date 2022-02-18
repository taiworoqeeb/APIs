const app = require('../app');
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

chai.request(app)
    .post('/auth/register-user')
    .send({username: 'testuser', email: 'testuser@gmail.com', fullname: "test user", password: "d15997"})
    .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.json(user);
    })

chai.request(app)
    .post('/auth/register-admin')
    .send({username: 'testadmin', email: 'testadmin@gmail.com', fullname: "test admin", password: "d15997"})
    .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.json(user);
    });

chai.request(app)
    .post('/auth/signin-user')
    .send({email: 'testuser@gmail.com', password: "d15997"})
    .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.json(user);
    });

chai.request(app)
    .post('/auth/signin-admin')
    .send({email: 'testadmin@gmail.com', password: "d15997"})
    .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.json(user);
    });