function PostitTool(postitToolListener){
    this.postitToolListener = postitToolListener;
    this.postits = {}
}

PostitTool.prototype.getListener = function(){
    return this.postitToolListener;
};

PostitTool.prototype.setListener = function(postitToolListener){
    this.postitToolListener = postitToolListener;
};

PostitTool.prototype.updatePostitText = function(id, text){
    this.getPostit(id).setText(text);
};

PostitTool.prototype.deletePostit = function(id){
    this.getPostit(id).remove();
    delete this.postits[id];
};


PostitTool.prototype.focusPostit = function(postitId){
    this.getPostit(postitId).focus();
};

function PostitToolListener(boardConnection){
    this.boardConnection = boardConnection;
}


PostitToolListener.prototype.onDeletedPostit = function(id){
    var boardConnection = this.boardConnection;
    $.post('/postit/'+id+'/delete/', function(json){
        boardConnection.deletePostit(id);
    });
};

PostitToolListener.prototype.onPostitMoved = function(postitId, x, y){
    boardConnection.movePostit(postitId, x, y);
};

function Postit(postitTool, id, text, x, y, width, height, back_color){
    if(back_color == null)
        back_color = "#FFFF33";
    this.postitTool = postitTool;
    this.postitToolListener = postitTool.getListener();
    this.id = id;
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.back_color = back_color;
    this.createElement();
}

Postit.prototype.createElement = function(){
    this.element = this.createPostitDiv().appendTo("#board").addTouch();
    this.createPostitCloseElement().appendTo(this.element);
    this.createPostitColorTool().appendTo(this.element);
    this.createPostitTextArea().appendTo(this.element);
    this.createChangePostitColorTool().appendTo(this.element);
};

Postit.prototype.createPostitDiv = function(){
    var postitDivId = "postit"+this.id;
    var _this = this;
    var postitToolListener = this.postitToolListener;
    postitElement = $("<div/>")
            .attr("id", postitDivId)
            .addClass("postit")
            .css("position", "absolute")
            .css("top", this.y+"px")
            .css("left", this.x+"px")
            .css("width", this.width+"px")
            .css("height", this.height+"px")
            .css("padding", "22px 2px 2px 2px")
            .css("background-color", this.back_color);

    postitElement.draggable({
                    containment: "parent",
                    drag: function(){
                        var position = $(this).position();
                        postitToolListener.onPostitMoved(_this.id, position.left, position.top);
                    },
                    stop: function(){
                        var position = $(this).position();
                        postitToolListener.onPostitStopMoving(_this.id, position.left, position.top);
                    }
            })
            .resizable({
                    resize: function(){
                        var width = $(this).width();
                        var height = $(this).height();
                        boardConnection.resizePostit(_this.id, width, height); //todo , change to call postittoollistener
                    },
                    stop: function(event, ui){
                        var width = ui.size.width;
                        var height = ui.size.height;
                        postitToolListener.onPostitStopResizing(_this.id, width, height);
                    }
            });
    postitElement.mouseover(function(){
        var postit = $(this);
        postit.find(".postit_close_image").show();//showCLoseImage
        postit.find(".postit_color_image").show();//showColorImage
        postit.css('padding-top','2px');
        postit.css('padding-bottom','20px');
    });
    postitElement.mouseout(function(){
        var postit = $(this);
        postit.find(".postit_close_image").hide();//hideCloseImage
        postit.find(".postit_color_image").hide();//hideColorImage
        postit.css('padding-top','22px');
        postit.css('padding-bottom','2px');
    });
    return postitElement;
};

Postit.prototype.createPostitCloseElement = function(){
    var _this = this;
    var postitToolListener = this.postitToolListener;
    var postitTool = this.postitTool;
    return $("<img/>")
            .addClass("postit_close_image")
            .attr("src", "/static/images/close.png")
            .click(function(){
                postitTool.deletePostit(_this.id);
                postitToolListener.onDeletedPostit(_this.id);
            });
};

Postit.prototype.createPostitTextArea = function(){
    var postitToolListener = this.postitToolListener;
    var postitTextArea =  $("<textarea/>").addClass("postit_input").css('background-color', this.back_color);
    var _this = this;
    postitTextArea.keyup(function(){
        postitToolListener.onUpdatedPostitText(_this.id, postitTextArea.val());
    });
    postitTextArea.val(this.text);
    return postitTextArea;
};

Postit.prototype.createPostitColorTool = function(){

    var postitTool = this.postitTool;
    var _this = this;
    var element = this.element;
    var image = $("<img/>")
            .addClass("postit_color_image")
            .attr("src", "/static/images/colors.png")
            .mouseover(function(){
                element.find(".postit_color_tool").show();
            });

    return image;
};

Postit.prototype.createChangePostitColorTool = function() {
    var postitChangeColorTool = $("<div />")
            .addClass("postit_color_tool");
    postitChangeColorTool.mouseout(function() {
        postitChangeColorTool.hide()
    });
    this.createColorSelectionElement("#FFFF33", "left").appendTo(postitChangeColorTool);
    this.createColorSelectionElement("#FF69B4", "right").appendTo(postitChangeColorTool);
    this.createColorSelectionElement("#ADFF2F", "left").appendTo(postitChangeColorTool);
    this.createColorSelectionElement("gold", "right").appendTo(postitChangeColorTool);
    return postitChangeColorTool.hide();
};

Postit.prototype.createColorSelectionElement = function(color, location){
    var _this = this;
    var postitToolListener = this.postitToolListener;
    return $("<div class='postit_color'/>")
            .css('background-color', color)
            .css('float', location)
            .click(function() {
                           _this.color(color);
                           postitToolListener.onPostitChangedColor(_this.id, color, color);
                       });
};

Postit.prototype.move = function(newX, newY){
    this.element.css('top', newY+"px");
    this.element.css('left',newX+"px");
};

Postit.prototype.setWidth = function(width){
    this.element.width(width);
};

Postit.prototype.setHeight = function(height){
    this.element.height(height);
};

Postit.prototype.setText = function(text){
    this.element.find("textarea").val(text);
};

Postit.prototype.remove = function(){
    this.element.find("textarea").remove();
    this.element.remove();
};

Postit.prototype.color = function(color){
    this.element.css('background-color',color);
    this.element.find("textarea").css('background-color', color);
};

Postit.prototype.focus = function(){
    this.element.find("textarea").focus();
};


