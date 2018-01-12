'use strict';

/*jshint expr: true*/

const whenParser = require( '../../src/whenParser' );

const expect = require( 'chai' ).expect;

const sinon = require( 'sinon' );


describe( 'src/whenParser', function() {

    describe( '.parse', function() {

        it( 'normal operation: is, then', function() {

            const config = {
                condition: 'a',
                options: {
                    is: {
                        '@type': 'string',
                        regex: /^(?!\s*$).+/,
                    },
                    then: {
                        required: null,
                    },
                },
            };

            let whenSchema = { };
            whenSchema.regex = sinon.stub().returns( whenSchema );

            const engine = {
                string: sinon.stub().returns( whenSchema ),
                required: sinon.stub().returns( whenSchema ),
            };

            const optionsShape = {
                is: whenSchema,
                then: whenSchema,
            }

            const [ condition, options ] = whenParser.parse( config, engine );

            expect( condition ).to.equal( 'a' );

            expect( options ).to.eql( optionsShape );

            expect( engine.string.calledOnce ).to.be.true;
            expect( engine.string.withArgs().calledOnce ).to.be.true;

            expect( whenSchema.regex.calledOnce ).to.be.true;
            expect( whenSchema.regex.withArgs().calledOnce ).to.be.true;

            expect( engine.required.calledOnce ).to.be.true;
            expect( engine.required.withArgs().calledOnce ).to.be.true;
        });

        it( 'normal operation: is, then, otherwise', function() {

            const config = {
                condition: 'a',
                options: {
                    is: {
                        '@type': 'string',
                        regex: /^(?!\s*$).+/,
                    },
                    then: {
                        required: null,
                    },
                    otherwise: {
                        optional: null,
                    },
                },
            };

            let whenSchema = { };
            whenSchema.regex = sinon.stub().returns( whenSchema );

            const engine = {
                string: sinon.stub().returns( whenSchema ),
                required: sinon.stub().returns( whenSchema ),
                optional: sinon.stub().returns( whenSchema ),
            };

            const optionsShape = {
                is: whenSchema,
                then: whenSchema,
                otherwise: whenSchema,
            }

            const [ condition, options ] = whenParser.parse( config, engine );

            expect( condition ).to.equal( 'a' );

            expect( options ).to.eql( optionsShape );

            expect( engine.string.calledOnce ).to.be.true;
            expect( engine.string.withArgs().calledOnce ).to.be.true;

            expect( whenSchema.regex.calledOnce ).to.be.true;
            expect( whenSchema.regex.withArgs().calledOnce ).to.be.true;

            expect( engine.required.calledOnce ).to.be.true;
            expect( engine.required.withArgs().calledOnce ).to.be.true;

            expect( engine.optional.calledOnce ).to.be.true;
            expect( engine.optional.withArgs().calledOnce ).to.be.true;
        });

        it( 'normal operation: is, then(with alternatives)', function() {

            const config = {
                condition: 'a',
                options: {
                    is: [
                        {
                            '@type': 'string',
                            regex: /^(?!\s*$).+/,
                        },
                        true,
                    ],
                    then: {
                        required: null,
                    },
                },
            };

            let whenSchema = { };
            whenSchema.regex = sinon.stub().returns( whenSchema );
            whenSchema.required = sinon.stub().returns( whenSchema );

            const engine = {
                string: sinon.stub().returns( whenSchema ),
                required: sinon.stub().returns( whenSchema ),
            };

            const optionsShape = {
                is: [
                    whenSchema,
                    true,
                ],
                then: whenSchema,
            }

            const [ condition, options ] = whenParser.parse( config, engine );

            expect( condition ).to.equal( 'a' );

            expect( options ).to.eql( optionsShape );

            expect( engine.string.calledOnce ).to.be.true;
            expect( engine.string.withArgs().calledOnce ).to.be.true;

            expect( whenSchema.regex.calledOnce ).to.be.true;
            expect( whenSchema.regex.withArgs().calledOnce ).to.be.true;

            expect( engine.required.calledOnce ).to.be.true;
            expect( engine.required.withArgs().calledOnce ).to.be.true;
        });
    });
});
