define([
], function(){

    BoardConnection = function(board_id, boardMessageHandler) {

        /*this.pusher = new Pusher('32b728d173f152c58554');
        var channel = this.pusher.subscribe('test_channel');

        channel.bind('my_event', function(data) {
            alert(data.message);
        });*/

        this.ws = io.connect('http://23.21.155.34:8888');

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

    BoardConnection.prototype.send = function(message, args){
        if (!args["channel_id"]) args["channel_id"] = this.board_id;
        this.ws.send(JSON.stringify({
            "type": message,
            "args": args
        }));
    };

    BoardConnection.prototype.movePostit = function(id, x, y){
        this.send("move",{
                "id": id,
                "x": x,
                "y": y
        });
    };

    BoardConnection.prototype.resizePostit = function(postItId, width, height){
        this.send("resize", {
                "id":postItId,
                "w": width,
                "h": height
            });
    };

    BoardConnection.prototype.updatePostitText = function(postItId, text){
        this.send("update", {
                "id":postItId,
                "text": text
            });
    };

    BoardConnection.prototype.changePostitColor = function(postItId, color, backColor){
        this.send("change_color", {
                "id": postItId,
                "color": color,
                "back_color": backColor
            });
    };

    BoardConnection.prototype.subscribe = function(board_id){
        this.board_id = board_id;
        this.send("register",{});
    };

    BoardConnection.prototype.newPostit = function(postItId, x, y, width, height, text){
        this.send("new",{
                "obj":"postit",
                "id":postItId,
                "x": x,
                "y": y,
                "w": width,
                "h": height,
                "text":text
            });
    };

    BoardConnection.prototype.deletePostit = function(postitId){
        this.send("delete",{
                "obj": "postit",
                "id":postitId
            });
    };

    BoardConnection.prototype.deleteLine = function(id){
        this.send("delete", {
                "obj": "line",
                "id": id
            });
    };


    BoardConnection.prototype.startPath = function(id, x, y, color){
        this.send("startPath",{
                "id": id,
                "x": x,
                "y": y,
                "color": color
            });
    };

    BoardConnection.prototype.addPathPoint = function(id, x, y){
        this.send("addPathPoint",{
                "id": id,
                "x": x,
                "y": y
            });
    };

    BoardConnection.prototype.finishPath = function(id){
        this.send("finishPath",{
                "id": id
            });
    };

    BoardMessageHandler = function(boardView){
        this.handlers = {
            "startPath": function(args){
                boardView.startPath(args["id"], args["x"], args["y"], args["color"]);
            },
            "addPathPoint": function(args){
                boardView.addPathPoint(args["id"], args["x"], args["y"]);
            },
            "finishPath": function(args){
                boardView.finishPath(args["id"]);
            },
            "new" : function(args){
                if(args["obj"]=="postit")
                    boardView.showPostit(args["id"]);
            },
            "update" : function(args){
                boardView.updatePostitText(args["id"], args["text"]);
            },
            "move" : function(args){
                boardView.movePostit(args["id"], args["x"], args["y"]);
            },
            "resize" : function(args){
                boardView.resizePostit(args["id"], args["w"], args["h"]);
            },
            "delete" : function(args){
                if(args["obj"]=="postit")
                    boardView.deletePostit(args["id"]);
                else
                    boardView.deleteLine(args["id"]);
            },
            "change_color" : function(args){
                boardView.changePostitColor(args["id"], args["back_color"]);
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



