/**
 * @fileoverview Disallows strict null or undefined checks
 * @author Damilola Randolph
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
    meta: {
        type: 'problem', // `problem`, `suggestion`, or `layout`
        docs: {
            description: 'Disallows strict null or undefined checks',
            category: 'Errors',
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: 'code', // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
    },

    create(context) {
        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const isNullOrUndefined = function (val) {
            return val === 'null' || val === 'undefined';
        };

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            BinaryExpression: (node) => {
                if (node.operator !== '===' && node.operator !== '!==') return;

                const left = node.left;
                const right = node.right;
                /** @type {import('eslint').Rule.Node | null} */
                let valueNode = null;
                if (
                    (left.type === 'Identifier' && left.name === 'undefined') ||
                    (left.type === 'Literal' && left.raw === 'null')
                ) {
                    valueNode = right;
                } else if (
                    (right.type === 'Identifier' &&
                        right.name === 'undefined') ||
                    (right.type === 'Literal' && right.raw === 'null')
                ) {
                    valueNode = left;
                }

                if (!valueNode) {
                    return;
                }

                if (
                    valueNode.type === 'MemberExpression' ||
                    (valueNode.type === 'Identifier' &&
                        valueNode.name !== 'undefined')
                ) {
                    context.report({
                        node: node,
                        message: 'Unexpected strict null check',
                        loc: node.loc,
                    });
                }
            },
        };
    },
};
