"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Match_1 = require("tournament/match/Match");
var DoubleEliminationMatch = (function (_super) {
    __extends(DoubleEliminationMatch, _super);
    function DoubleEliminationMatch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.parentMatches = [];
        return _this;
    }
    DoubleEliminationMatch.prototype.getStats = function () {
        var stats = _super.prototype.getStats.call(this);
        stats.parentMatches = this.parentMatches;
        return stats;
    };
    return DoubleEliminationMatch;
}(Match_1["default"]));
exports["default"] = DoubleEliminationMatch;
//# sourceMappingURL=DoubleEliminationMatch.js.map