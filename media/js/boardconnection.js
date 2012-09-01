function BoardConnection(ws) {
    this.ws = ws;
}

BoardConnection.prototype.movePostit = function(postItId, x, y){
    if(!this.board_id){
        throw "should be subscribed to board before trying to update postit";
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

BoardConnection.prototype.resizePostit = function(postItId, width, height){
    if(!this.board_id){
        throw "should be subscribed to board before trying to update postit";
    }
    var message = {
        "type": "resize",
        "args": {
            "channel_id": this.board_id,
            "id":postItId,
            "w": width,
            "h": height
        }
    };
    this.ws.send(JSON.stringify(message));
};

BoardConnection.prototype.updatePostitText = function(postItId, text){
    if(!this.board_id){
        throw "should be subscribed to board before trying to update postit";
    }
    var message = {
        "type": "update",
        "args": {
            "channel_id": this.board_id,
            "postit_id":postItId,
            "text": text
        }
    };
    this.ws.send(JSON.stringify(message));
};

BoardConnection.prototype.changePostitColor = function(postItId, color, backColor){
    if(!this.board_id){
        throw "should be subscribed to board before trying to update postit";
    }
    var message = {
        "type": "change_color",
        "args": {
            "channel_id": this.board_id,
            "id": postItId,
            "color": color,
            "back_color": backColor
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

BoardConnection.prototype.newPostit = function(board_id, postItId, x, y, width, height, text){
    this.board_id = board_id;
    var message = {
        "type": "new",
        "args": {
            "channel_id": this.board_id,
            "obj":"postit",
            "id":postItId,
            "x": x,
            "y": y,
            "w": width,
            "h": height,
            "text":text 
        }
    };
    this.ws.send(JSON.stringify(message));
};

BoardConnection.prototype.newLine = function(x, y, x1, y1, color_l, stroke_w){
    var message = {
        "type": "new",
        "args": {
            "channel_id": this.board_id,
            "obj":"line",
            "x": x,
            "y": y,
            "x1": x1,
            "y1": y1,
            "color_l":color_l,
            "stroke_w":stroke_w
        }
    };
    this.ws.send(JSON.stringify(message));
};

BoardConnection.prototype.selectPostit = function(postItId){
    var message = {
        "type": "select",
        "args": {
            "channel_id": this.board_id,
            "id":postItId
        }
    };
    this.ws.send(JSON.stringify(message));
};

BoardConnection.prototype.deselectPostit = function(postItId){
    var message = {
        "type": "deselect",
        "args": {
            "channel_id": this.board_id,
            "id":postItId
        }
    };
    this.ws.send(JSON.stringify(message));
};

BoardConnection.prototype.deletePostit = function(postitId){
    var message = {
        "type": "delete",
        "args": {
            "channel_id": this.board_id,
            "obj": "postit",
            "id":postitId
        }
    };
    this.ws.send(JSON.stringify(message));
};
