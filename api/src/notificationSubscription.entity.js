"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NotificationSubscription = void 0;
var typeorm_1 = require("typeorm");
var NotificationSubscription = /** @class */ (function () {
    function NotificationSubscription() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], NotificationSubscription.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)("text")
    ], NotificationSubscription.prototype, "mobileToken");
    __decorate([
        (0, typeorm_1.Column)("text")
    ], NotificationSubscription.prototype, "deviceType");
    __decorate([
        (0, typeorm_1.Column)("text")
    ], NotificationSubscription.prototype, "type");
    __decorate([
        (0, typeorm_1.Column)("text")
    ], NotificationSubscription.prototype, "realm");
    __decorate([
        (0, typeorm_1.Column)({
            "default": true
        })
    ], NotificationSubscription.prototype, "isActive");
    NotificationSubscription = __decorate([
        (0, typeorm_1.Entity)()
    ], NotificationSubscription);
    return NotificationSubscription;
}());
exports.NotificationSubscription = NotificationSubscription;
