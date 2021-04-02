"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var ZecTx = /** @class */ (function () {
    function ZecTx() {
    }
    __decorate([
        typeorm_1.PrimaryColumn('varchar')
    ], ZecTx.prototype, "txid");
    __decorate([
        typeorm_1.Column({ type: 'int', precision: 16, scale: 8, nullable: false })
    ], ZecTx.prototype, "fee");
    __decorate([
        typeorm_1.Column({ type: 'int', nullable: false })
    ], ZecTx.prototype, "block_number");
    __decorate([
        typeorm_1.Column({ type: 'varchar', nullable: false })
    ], ZecTx.prototype, "block_time");
    __decorate([
        typeorm_1.Column({ type: 'varchar', nullable: false })
    ], ZecTx.prototype, "block_hash");
    ZecTx = __decorate([
        typeorm_1.Entity('zec_txs')
    ], ZecTx);
    return ZecTx;
}());
exports.ZecTx = ZecTx;
