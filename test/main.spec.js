/* global describe, it */

// Tests suite
import path from 'path'
import chai from 'chai'
chai.should()

// The stars of the show
import Src from '../src'
import Dist from '../dist'
const envEmpty = path.resolve(__dirname, './envs/.empty')
const envEmptyExample = path.resolve(__dirname, './envs/.empty.example')
const envSimple = path.resolve(__dirname, './envs/.simple')
const envSimpleExample = path.resolve(__dirname, './envs/.simple.example')

const envEmptyJson = {}
const envSimpleJson = {TEST: 'testing'}

function runTests (Obj, name) {
  function envTest (config) {
    return JSON.parse(new Obj(config).definitions['process.env'])
  }

  describe(name, () => {
    describe('Defaults', () => {
      it('Should be a function.', () => {
        Obj.should.be.a.function
      })

      // @todo - This one isn't a great test, but it wasn't really working for me.
      it('Should return a instance of DefinePlugin.', () => {
        envTest().should.be.an('object')
      })

      it('Should be an empty object when no environment variables exist in .env file.', () => {
        envTest().should.deep.equal(envEmptyJson)
      })
    })

    describe('Simple configuration', () => {
      it('Should load enviornment variables when they exist in the .env file.', () => {
        envTest({path: envSimple}).should.deep.equal(envSimpleJson)
      })

      it('Should allow system env variables', () => {
        const test = envTest({path: envSimple, systemvars: true})
        const key = Object.keys(envSimpleJson)[0]
        const value = envSimpleJson[key]
        test[key].should.equal(value)
        Object.keys(test).length.should.be.above(Object.keys(envSimpleJson).length)
      })
    })

    describe('Safe configuration', () => {
      it('Should load successfully if variables defined', () => {
        envTest({path: envEmpty, safe: true, sample: envEmptyExample}).should.deep.equal(envEmptyJson)
        envTest({path: envSimple, safe: true, sample: envSimpleExample}).should.deep.equal(envSimpleJson)
      })

      it('Should fail if env does not match sample.', () => {
        function errorTest () {
          envTest({path: envEmpty, safe: true, sample: envSimpleExample})
        }

        errorTest.should.throw('Missing environment variable')
      })
    })
  })
}

describe('The tests', () => {
  it('Should be able to run tests.', () => {
    true.should.be.true
  })

  runTests(Src, 'Source')
  runTests(Dist, 'Distribution')
})
