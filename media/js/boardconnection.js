function BoardConnection(ws) {
    this.ws = ws;
}

BoardConnection.prototype.movePostIt = function(postItId, x, y){
    if(!this.board_id){
        throw "should be subscribed to board before trying to move postit";
    }
    var message = {
        "type": "move",
        "args": {
            "channel_id": this.board_id,
            "postit_id":postItId,
            "x": x,
            "y": y
        }
    };
    this.ws.send(JSON.stringify(message));
};

BoardConnection.prototype.subscribe = function(board_id){
    this.board_id = board_id;
    var message = {
        "type": "register",
        "args": {
            "channel_id": this.board_id
        }
    };
    this.ws.send(JSON.stringify(message));
};

BoardConnection.prototype.newPostit = function(board_id, postItId, x, y, text){
    this.board_id = board_id;
    var message = {
        "type": "new",
        "args": {
            "channel_id": this.board_id,
            "obj":"postit",
            "postit_id":postItId,
            "x": x,
            "y": y,
            "text":text 
        }
    };
    this.ws.send(JSON.stringify(message));
};
