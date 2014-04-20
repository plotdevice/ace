/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */
/*
 * TODO: python delimiters
 */

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var PlotDeviceHighlightRules = function() {

    var builtinKeywords = [
        "and", "as", "assert", "break", "class", "continue", "def", "del", "elif", "else", "except",
        "exec", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "not", "or",
        "pass", "print", "raise", "return", "try", "while", "with", "yield"
    ]

    var plodClasses = [
       'Bezier', 'BezierPath', 'Color', 'Curve', 'Effect', 'Family', 'Font',
       'Gradient', 'Grob', 'Image', 'Mask', 'PathElement', 'Pattern', 'Point',
       'Region', 'Shadow', 'Size', 'Stylesheet', 'Text', 'Transform', 'Variable',
       'adict', 'ddict', 'odict'
    ]

    var builtinConstants = ["True", "False", "None", "NotImplemented", "Ellipsis", "__debug__"]

    var plodNumeric = [
        'BEVEL', 'BOOLEAN', 'BUTT', 'BUTTON', 'CENTER', 'CLOSE', 'CMYK', 'CORNER',
        'CURVETO', 'DEFAULT', 'DEGREES', 'FORTYFIVE', 'FRAME', 'GREY', 'HEIGHT', 'HSB',
        'JUSTIFY', 'KEY_BACKSPACE', 'KEY_DOWN', 'KEY_ESC', 'KEY_LEFT', 'KEY_RIGHT',
        'KEY_TAB', 'KEY_UP', 'LEFT', 'LINETO', 'MITER', 'MOVETO', 'NORMAL', 'NUMBER',
        'PAGE', 'PERCENT', 'RADIANS', 'RGB', 'RIGHT', 'ROUND', 'SQUARE', 'TEXT', 'WIDTH',
        'cm', 'inch', 'mm', 'pi', 'pica', 'px', 'tau'
    ]

    var builtinFunctions = [
        "abs", "divmod", "input", "open", "staticmethod", "all", "enumerate", "int", "ord", "str", "any",
        "eval", "isinstance", "pow", "sum", "basestring", "execfile", "issubclass", "print", "super",
        "binfile", "iter", "property", "tuple", "bool", "filter", "len", "range", "type", "bytearray",
        "float", "list", "raw_input", "unichr", "callable", "format", "locals", "reduce", "unicode",
        "chr", "frozenset", "long", "reload", "vars", "classmethod", "getattr", "map", "repr", "xrange",
        "cmp", "globals", "max", "reversed", "zip", "compile", "hasattr", "memoryview", "round",
        "__import__", "complex", "hash", "min", "set", "apply", "delattr", "help", "next", "setattr",
        "buffer", "dict", "hex", "object", "slice", "coerce", "dir", "id", "oct", "sorted", "intern"
    ]

    var plodFunctions = [
        'align', 'alpha', 'arc', 'arcto', 'arrow', 'autoclosepath', 'autotext',
        'background', 'beginclip', 'beginpath', 'bezier', 'blend', 'canvas',
        'capstyle', 'choice', 'clear', 'clip', 'closepath', 'color', 'colormode',
        'colorrange', 'curveto', 'drawpath', 'ellipse', 'endclip', 'endpath',
        'export', 'files', 'fill', 'findpath', 'font', 'fonts', 'fontsize',
        'geometry', 'grid', 'image', 'imagesize', 'joinstyle', 'line', 'lineheight',
        'lineto', 'mask', 'measure', 'moveto', 'nofill', 'noshadow', 'nostroke',
        'order', 'ordered', 'outputmode', 'oval', 'pen', 'plot', 'poly', 'pop',
        'push', 'random', 'read', 'rect', 'reset', 'rotate', 'scale', 'shadow',
        'shuffled', 'size', 'skew', 'speed', 'star', 'stroke', 'strokewidth',
        'stylesheet', 'text', 'textheight', 'textmetrics', 'textpath', 'textwidth',
        'transform', 'translate', 'ximport'
    ]

    var colorEntities = ('aliceblue|antiquewhite|aqua|aquamarine|azure|bark|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightsteelblue|lightyellow|lime|limegreen|linen|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|snow|springgreen|steelblue|tan|teal|thistle|tomato|transparent|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen');
    var colorCodes = '(#?[a-f0-9]{3}([a-f0-9]{3}([a-f0-9]{2})?)?\\b)'

    var keywordMapper = this.createKeywordMapper({
        "invalid.deprecated": "debugger",
        "support.function": builtinFunctions.concat(plodFunctions).join("|"),
        "constant.language": builtinConstants.join("|"),
        "constant.numeric": plodNumeric.join("|"),
        "keyword": builtinKeywords.concat(plodClasses).join("|")
    }, "identifier");

    var strPre = "(?:r|u|ur|R|U|UR|Ur|uR)?";

    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var octInteger = "(?:0[oO]?[0-7]+)";
    var hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
    var binInteger = "(?:0[bB][01]+)";
    var integer = "(?:" + decimalInteger + "|" + octInteger + "|" + hexInteger + "|" + binInteger + ")";

    var exponent = "(?:[eE][+-]?\\d+)";
    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    var exponentFloat = "(?:(?:" + pointFloat + "|" +  intPart + ")" + exponent + ")";
    var floatNumber = "(?:" + exponentFloat + "|" + pointFloat + ")";
    var colorString = "'(" + colorCodes + "|" + colorEntities + ")'"
    var qcolorString = '"(' + colorCodes + '|' + colorEntities + ')"'

    var stringEscape =  "\\\\(x[0-9A-Fa-f]{2}|[0-7]{3}|[\\\\abfnrtv'\"]|U[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})";

    this.$rules = {
        "start" : [ {
            token : "comment",
            regex : "#.*$"
        }, {
            token : "keyword",
            regex : '\\bdef\\b|\\bclass\\b',
            next : "define"
        }, {
            token : "constant.numeric", // string containing a hex or named color
            regex : colorString
        }, {
            token : "constant.numeric", // string containing a hex or named color
            regex : qcolorString
        }, {
            token : "string",           // multi line """ string start
            regex : strPre + '"{3}',
            next : "qqstring3"
        }, {
            token : "string",           // " string
            regex : strPre + '"(?=.)',
            next : "qqstring"
        }, {
            token : "string",           // multi line ''' string start
            regex : strPre + "'{3}",
            next : "qstring3"
        }, {
            token : "string",           // ' string
            regex : strPre + "'(?=.)",
            next : "qstring"
        }, {
            token : "constant.numeric", // imaginary
            regex : "(?:" + floatNumber + "|\\d+)[jJ]\\b"
        }, {
            token : "constant.numeric", // float
            regex : floatNumber
        }, {
            token : "constant.numeric", // long integer
            regex : integer + "[lL]\\b"
        }, {
            token : "constant.numeric", // integer
            regex : integer + "\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="
        }, {
            token : "paren.lparen",
            regex : "[\\[\\(\\{]"
        }, {
            token : "paren.rparen",
            regex : "[\\]\\)\\}]"
        }, {
            token : "text",
            regex : "\\s+"
        } ],
        "define":[
            {
                token : "constant.language",
                regex : "def|class"
            },
            {
                token : "variable.language",
                regex : "[A-Za-z_][A-Za-z0-9_]*",
                next : "start"
            },
            {
                token : "text",
                regex : "\\s+"
            }
        ],
        "qqstring3" : [ {
            token : "constant.language.escape",
            regex : stringEscape
        }, {
            token : "string", // multi line """ string end
            regex : '"{3}',
            next : "start"
        }, {
            defaultToken : "string"
        } ],
        "qstring3" : [ {
            token : "constant.language.escape",
            regex : stringEscape
        }, {
            token : "string",  // multi line ''' string end
            regex : "'{3}",
            next : "start"
        }, {
            defaultToken : "string"
        } ],
        "qqstring" : [{
            token : "constant.language.escape",
            regex : stringEscape
        }, {
            token : "string",
            regex : "\\\\$",
            next  : "qqstring"
        }, {
            token : "string",
            regex : '"|$',
            next  : "start"
        }, {
            defaultToken: "string"
        }],
        "qstring" : [{
            token : "constant.language.escape",
            regex : stringEscape
        }, {
            token : "string",
            regex : "\\\\$",
            next  : "qstring"
        }, {
            token : "string",
            regex : "'|$",
            next  : "start"
        }, {
            defaultToken: "string"
        }]
    };
};

oop.inherits(PlotDeviceHighlightRules, TextHighlightRules);

exports.PlotDeviceHighlightRules = PlotDeviceHighlightRules;
});
