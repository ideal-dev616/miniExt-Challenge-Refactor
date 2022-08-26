/**
 * @fileoverview Disallows strict null or undefined checks
 * @author Damilola Randolph
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-strict-null-undefined'),
    RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('disallow-strict-null-undefined-checks', rule, {
    valid: [{ code: 'value == null' }],

    invalid: [
        {
            code: 'value === null',
            errors: [{ message: 'Unexpected strict null check' }],
        },
    ],
});
