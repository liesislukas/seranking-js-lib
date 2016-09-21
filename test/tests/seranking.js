import {describe, before, it} from 'mocha';
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = require('chai').expect;

import {config} from './../../lib/config';
import {
  seranking_login,
  seranking_sites,
  seranking_siteKeywords,
  seranking_stat,
} from './../../../src/server/helpers/seranking';

describe('server/helpers/seranking', function () {

  it('seranking_login', done => {
    let promise = seranking_login({username: config.seranking.username, password: config.seranking.password});
    expect(promise).to.eventually.have.property('token').and.notify(done);
  });

  it('seranking_sites', done => {
    let promise = seranking_sites();
    expect(promise).to.eventually.be.instanceof(Array).and.notify(done);
  });

  it('seranking_siteKeywords', done => {
    seranking_sites()
      .then(sites => {
        let site = sites[0];

        let promise = seranking_siteKeywords({site_id: site.id});
        expect(promise).to.eventually.be.instanceof(Array).and.notify(done);

      });
  });

  it('seranking_stat', done => {
    seranking_sites()
      .then(sites => {
        let site = sites[0];

        let promise = seranking_stat({site_id: site.id});
        expect(promise).to.eventually.be.instanceof(Array).and.notify(done);

      });
  });

});
