function Message(msgType, msgData) {
    this.msgType = msgType;
    this.msgData = msgData;
}

Message.prototype.toJSON = function() {
    let obj = {
        msgType: this.msgType,
        msgData: this.msgData
    }
    return JSON.stringify(obj);
}

Message.fromJSON = function(json) {
    var obj = JSON.parse(json);
    return new Message(obj.msgType, obj.msgData);
}

export default Message;