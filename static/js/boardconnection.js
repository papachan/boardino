define([
], function(){

    BoardConnection = function(board_id, boardMessageHandler) {

        this.ws = io.connect('http://'+window.location.hostname+':8888');

        var _this = this;
        this.ws.on('connect', function () {
            _this.subscribe(board_id);
            _this.ws.on('message', function (msg) {
                boardMessageHandler.handle($.parseJSON(msg));
            });
        });
    };

    BoardConnection.prototype.disconnect = function(){
        this.ws.disconnect();
    };

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

    BoardConnection.prototype.newPostit = function(postItId, x, y, width, height, text){
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

    BoardConnection.prototype.newLine = function(x, y, x1, y1, color_l, stroke_w, add_to_local_array){
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
                "stroke_w":stroke_w,
                "add_to_local_array":add_to_local_array
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

    BoardConnection.prototype.clearLines = function(){
        var message = {
            "type": "clear",
            "args": {
                "channel_id": this.board_id,
                "obj": "line"
            }
        };
        this.ws.send(JSON.stringify(message));
    };


    BoardMessageHandler = function(processingInstance, boardView){
        this.handlers = {
            "new" : function(args){
                if(args["obj"]=="postit")
                    boardView.showPostit(args["id"]);
                else
                    processingInstance.addLine(args["x"], args["y"], args["x1"],
                                                args["y1"], args["color_l"], args["stroke_w"],
                                                args["add_to_local_array"]);
            },
            "update" : function(args){
                boardView.updatePostitText(args["postit_id"], args["text"]);
            },
            "move" : function(args){
                boardView.movePostit(args["postit_id"], args["x"], args["y"]);
            },
            "resize" : function(args){
                boardView.resizePostit(args["id"], args["w"], args["h"]);
            },
            "delete" : function(args){
                boardView.deletePostit(args["id"]);
            },
            "change_color" : function(args){
                boardView.changePostitColor(args["id"], args["back_color"]);
            },
            "clear" : function(args){
                if(args["obj"] == "line")
                    processingInstance.clearLines();
            },
            "info" : function(args){
                connectedUsers = args.users+1;
                $("#connected_users").text(connectedUsers);
            },
            "register": function(args){
                connectedUsers++;
                $("#connected_users").text(connectedUsers);
                $("<div/>").addClass("user_connected")
                        .appendTo($("#notifications")).text("1 user joined!").show('slow')
                        .hide(4000, function(){$(this).remove()});
            },
            "disconnect": function(args){
                connectedUsers--;
                $("#connected_users").text(connectedUsers);
                $("<div/>").addClass("user_disconnected")
                        .appendTo($("#notifications")).text("1 user left!").show('slow')
                        .hide(4000, function(){$(this).remove()});
            }
        };

    };

    BoardMessageHandler.prototype.handle = function(message){
        var messageType = message["type"];
        if(this.handlers[messageType])
            this.handlers[messageType](message["args"]);
    };

    return BoardConnection;
});



