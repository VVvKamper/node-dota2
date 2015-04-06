var Dota2 = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages_client = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages_client.desc")),
    protoMask = 0x80000000;

// Methods

Dota2.Dota2Client.prototype.inviteToPartyRequest = function(steamId, callback) {
    callback = callback || null;

    /* Sends a message to the Game Coordinator inviting `matchId`'s match details.  Listen for `inviteRespone` event for Game Coordinator's response. */

    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending party invite request");
    var payload = base_gcmessages.CMsgInviteToParty.serialize({
        "steamId": steamId
    });

    this._client.toGC(this._appid, (Dota2.EGCBaseMsg.k_EMsgGCInviteToParty | protoMask), payload, callback);
};

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EGCBaseMsg.k_EMsgGCPartyInviteResponse] = function onPartyInvite(message) {
    var response = base_gcmessages.k_EMsgGCPartyInviteResponse.parse(message);
    this.emit("partyRespone", message.accept, message);
};