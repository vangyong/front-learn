
/*
 *  进制转换工具
 */
var BaseUtil = {
    HEX_TABLE: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    getTableMaxHex: function () {
        return this.HEX_TABLE.length;
    },
    getHexTableChar: function (ch) {
        return this.HEX_TABLE.join('').indexOf(ch);
    },
    hex10ToAny: function (number, hex, hexTable) {
        if (!hexTable)
            hexTable = this.HEX_TABLE;
        if (hex > hexTable.length)
            return null;
        var s = "";
        var negative = false; // 是否为负数
        if (number < 0) {
            number = -number;
            negative = true;
        }
        while (number != 0) {
            s = hexTable[Math.floor(number % hex)] + s;
            number = Math.floor(number / hex);
        }
        if (s == "")
            s = "0";
        else
            s = negative ? "-" : "" + s;
        return s;
    },
    anyToHex10: function (hexNumber, hex, hexTable) {
        if (!hexTable)
            hexTable = this.HEX_TABLE;
        if (hex > hexTable.length)
            return null;
        var hexTableString =  hexTable.join('');
        var negative = false; // 是否为负数
        if (hexNumber.indexOf("-") == 0) {
            hexNumber = hexNumber.substring(1);
            negative = true;
        }
        var hexNumLen = hexNumber.length;
        var number = 0;
        for (var i = 0; i < hexNumLen; i++)
            number += Math.pow(hex, i) * hexTableString.indexOf(hexNumber.charAt(hexNumLen - i - 1));
        if (negative)
            number = 0 - number;
        return number;
    },
    anyToAny: function (hexNumber, hex, toHex, hexTable, toHexTable) {
        if (!hexTable)
            hexTable = this.HEX_TABLE;
        if (!toHexTable)
            toHexTable = hexTable;
        var hex10 = this.anyToHex10(hexNumber, hex, hexTable);
        if (hex10 == null)
            return null;
        return this.hex10ToAny(hex10, toHex, toHexTable);
    }
};