"use strict";
exports.__esModule = true;
var PubSub = require("pubsub-js");
var PubSubber = (function () {
    function PubSubber() {
        this.subscriptionTokens = [];
    }
    PubSubber.prototype.publish = function (event, data) {
        PubSub.publish(event, data);
    };
    PubSubber.prototype.publishNamespaced = function (namespace, event, data) {
        this.publish(this.makeNamespace(namespace, event), data);
    };
    PubSubber.prototype.subscribeNamespaced = function (namespace, event, fn) {
        this.subscribe(this.makeNamespace(namespace, event), fn);
    };
    PubSubber.prototype.subscribe = function (event, fn) {
        var token = PubSub.subscribe(event, fn);
        this.subscriptionTokens.push(token);
    };
    PubSubber.prototype.unsubscribeAll = function () {
        this.subscriptionTokens.forEach(function (token) {
            PubSub.unsubscribe(token);
        });
    };
    PubSubber.prototype.makeNamespace = function (namespace, event) {
        return event + "--" + namespace;
    };
    return PubSubber;
}());
exports["default"] = PubSubber;
//# sourceMappingURL=Subscriber.js.map