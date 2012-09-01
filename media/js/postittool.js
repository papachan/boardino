function PostitTool(postitToolListener){
    this.postitToolListener = postitToolListener;
}

PostitTool.prototype.addPostits = function(postits) {
    var _this = this;
    $.each(postits, function(i, postit) {
        _this.createPostit(postit.id, postit.text, postit.x, postit.y, postit.width, postit.height);
    });
};

PostitTool.prototype.createPostit = function(id, text, x, y, width, height){
    var postit = this.createPostitDiv(id, x, y, width, height).appendTo("#board");
    var postitCloseElement = this.createPostitCloseElement(id).appendTo(postit);
    var postitTextArea = this.createPostitTextArea(id).appendTo(postit);
    postitTextArea.val(text);
    postitToolListener = this.postitToolListener;
    postitTextArea.keyup(function(){
        postitToolListener.onUpdatedPostitText(id, postitTextArea.val());
    });
    setTimeout(function() { postitTextArea.focus(); }, 0);
};

PostitTool.prototype.createPostitTextArea = function(postitId){
    return $("<textarea/>").addClass("postit_input");
};

PostitTool.prototype.createPostitCloseElement = function(postitId){
    var _this = this;
    var postitToolListener = this.postitToolListener;
    return $("<img/>")
            .addClass("postit_close_image")
            .attr("src", "/media/close.png")
            .click(function(){
                _this.deletePostit(postitId);
                postitToolListener.onDeletedPostit(postitId);
            });
};

PostitTool.prototype.createPostitDiv = function(postitId, x, y, width, height){
    var postitDivId = "postit"+postitId;
    postitElement = $("<div/>")
            .attr("id", postitDivId)
            .addClass("postit")
            .css("position", "absolute")
            .css("top", y+"px")
            .css("left", x+"px")
            .css("width", width+"px")
            .css("height", height+"px")
            .css("padding", "2px 2px 25px 2px");

    postitElement.draggable({
                    containment: "parent",
                    drag: function(){
                        var position = $(this).position();
                        boardConnection.movePostit(postitId, position.left, position.top);
                    },
                    stop: function(){
                        var position = $(this).position();
                        savePostitPosition(postitId, position.left, position.top);
                    }
            })
            .resizable({
                    resize: function(){
                        var width = $(this).width();
                        var height = $(this).height();
                        boardConnection.resizePostit(postitId, width, height);
                    },
                    stop: function(event, ui){
                        var width = ui.size.width;
                        var height = ui.size.height;
                        savePostitSize(postitId, width, height);
                    }
            });
    return postitElement;
};

PostitTool.prototype.movePostit = function(id, newX, newY){
    var postit = this.getPostit(id);
    postit.css('top', newY+"px");
    postit.css('left',newX+"px");
};

PostitTool.prototype.resizePostit = function(id, width, height){
    var postit = this.getPostit(id);
    postit.width(width);
    postit.height(height);
};

PostitTool.prototype.updatePostitText = function(id, text){
    this.getPostit(id).find("textarea").val(text);
};

PostitTool.prototype.deletePostit = function(id){
    this.getPostit(id).find("textarea").remove();
    this.getPostit(id).remove();
};

PostitTool.prototype.getPostit = function(id){
    return $("#postit"+id);
};

function PostitToolListener(boardConnection){
    this.boardConnection = boardConnection;
}

PostitToolListener.prototype.onUpdatedPostitText = function(id, text){
    var boardConnection = this.boardConnection;
    $.post('/postit/'+id+'/update/', { text:text}, function(){
        boardConnection.updatePostitText(id, text);
    });
};

PostitToolListener.prototype.onDeletedPostit = function(id){
    var boardConnection = this.boardConnection;
    $.post('/postit/'+id+'/delete/', function(json){
        boardConnection.deletePostit(id);
    });
};