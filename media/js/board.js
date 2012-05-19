function BoardConnection(ws) {
    this.ws = ws;
    //this.board_id = board_id;
}

BoardConnection.prototype.movePostIt = function(postItId, x, y){
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