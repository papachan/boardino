function PostitTool(postitToolListener){
    this.postitToolListener = postitToolListener;
}

PostitTool.prototype.setListener = function(postitToolListener){
    this.postitToolListener = postitToolListener;
};

PostitTool.prototype.addPostits = function(postits) {
    var _this = this;
    $.each(postits, function(i, postit) {
        _this.createPostit(postit.id, postit.text, postit.x, postit.y, postit.width, postit.height);
        _this.changePostitColor(postit.id, postit.color, postit.back_color);
    });
};

PostitTool.prototype.createPostit = function(id, text, x, y, width, height){
    var postit = this.createPostitDiv(id, x, y, width, height).appendTo("#board");
    this.createPostitCloseElement(id).appendTo(postit);
    this.createPostitColorTool(id).appendTo(postit);
    this.createPostitTextArea(id, text).appendTo(postit);
    this.createChangePostitColorTool(id).appendTo(postit);
};

PostitTool.prototype.createPostitTextArea = function(postitId, text){
    var postitToolListener = this.postitToolListener;
    var postitTextArea =  $("<textarea/>").addClass("postit_input");
    postitTextArea.keyup(function(){
        postitToolListener.onUpdatedPostitText(postitId, postitTextArea.val());
    });
    postitTextArea.val(text);
    setTimeout(function() { postitTextArea.focus(); }, 0);
    return postitTextArea;
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

PostitTool.prototype.createPostitColorTool = function(postitId){

    var _this = this;
    var image = $("<img/>")
            .addClass("postit_color_image")
            .attr("src", "/media/colors.png")
            .mouseover(function(){
                var tool = _this.getPostit(postitId).find(".postit_color_tool");
                tool.show();
            });

    return image;
};

PostitTool.prototype.createChangePostitColorTool = function(postitId) {
    var postitChangeColorTool = $("<div />")
            .addClass("postit_color_tool");
    postitChangeColorTool.mouseout(function() {
        postitChangeColorTool.hide()
    });
    var _this = this;
    var postitToolListener = this.postitToolListener;
    this.createColorSelectionElement(postitId, "#FFFF33", "#FFFF33", "left").appendTo(postitChangeColorTool);
    this.createColorSelectionElement(postitId, "#FF69B4", "#FF69B4", "right").appendTo(postitChangeColorTool);
    this.createColorSelectionElement(postitId, "#ADFF2F", "#ADFF2F", "left").appendTo(postitChangeColorTool);
    this.createColorSelectionElement(postitId, "gold", "gold", "right").appendTo(postitChangeColorTool);
    return postitChangeColorTool.hide();
};

PostitTool.prototype.createColorSelectionElement = function(postitId, color, backColor, location){
    var _this = this;
    var postitToolListener = this.postitToolListener;
    return $("<div class='postit_color'/>")
            .css('background-color', color)
            .css('float', location)
            .click(function() {
                           var postit = _this.getPostit(postitId);
                           postit.find("textarea").css('background-color', color);
                           postit.css('background-color', backColor);
                           postitToolListener.onPostitChangedColor(postitId, color, backColor);
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

PostitTool.prototype.changePostitColor = function(postItId, color, backColor){
    var postit = this.getPostit(postItId);
    postit.css('background-color',backColor);
    postit.find("textarea").css('background-color', color);
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


PostitToolListener.prototype.onPostitChangedColor = function(id, color, backColor){
    var boardConnection = this.boardConnection;
    $.post('/postit/'+id+'/update/', {color:color, back_color:backColor}, function(json){
        boardConnection.changePostitColor(id, color, backColor);
    });
};