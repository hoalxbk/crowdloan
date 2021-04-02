"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var OmniTx = /** @class */ (function () {
    function OmniTx() {
    }
    __decorate([
        typeorm_1.PrimaryColumn('varchar')
    ], OmniTx.prototype, "txid");
    __decorate([
        typeorm_1.Column({ type: 'varchar', name: 'from_address', nullable: false })
    ], OmniTx.prototype, "fromAddress");
    __decorate([
        typeorm_1.Column({ type: 'varchar', name: 'to_address', nullable: false })
    ], OmniTx.prototype, "toAddress");
    __decorate([
        typeorm_1.Column({ type: 'varchar', type: 'decimal', precision: 16, scale: 8, nullable: false })
    ], OmniTx.prototype, "amount");
    __decorate([
        typeorm_1.Column({ type: 'varchar', type: 'decimal', precision: 16, scale: 8, nullable: false })
    ], OmniTx.prototype, "fee");
    __decorate([
        typeorm_1.Column({ type: 'int', name: 'property_id', nullable: false })
    ], OmniTx.prototype, "propertyId");
    __decorate([
        typeorm_1.Column({ type: 'int', name: 'type_int', nullable: false })
    ], OmniTx.prototype, "typeInt");
    __decorate([
        typeorm_1.Column({ type: 'varchar', name: 'type', nullable: false })
    ], OmniTx.prototype, "type");
    __decorate([
        typeorm_1.Column({ type: 'int', name: 'block_number', nullable: false })
    ], OmniTx.prototype, "blockNumber");
    __decorate([
        typeorm_1.Column({ type: 'int', name: 'block_time', nullable: false })
    ], OmniTx.prototype, "blockTime");
    __decorate([
        typeorm_1.Column({ type: 'varchar', name: 'block_hash', nullable: false })
    ], OmniTx.prototype, "blockHash");
    __decorate([
        typeorm_1.Column({ type: 'boolean', name: 'valid', nullable: false })
    ], OmniTx.prototype, "valid");
    __decorate([
        typeorm_1.Column({ type: 'boolean', name: 'divisible', nullable: false })
    ], OmniTx.prototype, "divisible");
    OmniTx = __decorate([
        typeorm_1.Entity('omni_txs')
    ], OmniTx);
    return OmniTx;
}());
exports.OmniTx = OmniTx;
