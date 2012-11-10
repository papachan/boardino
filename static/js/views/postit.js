define([
], function(){
    var PostitView = Backbone.View.extend({
        tagName: "div",

        events: {
            "mouseover": "showToolbar",
            "mouseout": "hideToolbar",
            "click .postit_close_image": "deletePostit",
            "mouseover .postit_color_image": "showColors",
            "keyup .postit_input": "updateText"
        },

        initialize: function(){
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
            var _this = this;
            this.$el.attr("id", "postit"+this.model.id)
                    .addClass("postit")
                    .css("position", "absolute")
                    .css("top", this.model.get("y")+"px")
                    .css("left", this.model.get("x")+"px")
                    .css("width", this.model.get("width")+"px")
                    .css("height", this.model.get("height")+"px")
                    .css("padding", "22px 2px 2px 2px")
                    .css("background-color", this.model.get("back_color"))
                    .draggable({
                        containment: "parent",
                        drag: function(){
                            var position = $(this).position();
                            boardConnection.movePostit(_this.model.get("id"), position.left, position.top);
                        },
                        stop: function(){
                            var position = $(this).position();
                            _this.model.save({x: position.left, y: position.top});
                            //postitToolListener.onPostitStopMoving(_this.id, position.left, position.top);
                        }
                    })
                    .resizable({
                        resize: function(){
                            var width = $(this).width();
                            var height = $(this).height();
                            //boardConnection.resizePostit(_this.id, width, height); //todo , change to call postittoollistener
                        },
                        stop: function(event, ui){
                            var width = ui.size.width;
                            var height = ui.size.height;
                            _this.model.save({width: width, height: height});
                            //postitToolListener.onPostitStopResizing(_this.id, width, height);
                        }
                    });

            this.createPostitCloseElement().appendTo(this.$el);
            this.createPostitColorTool().appendTo(this.$el);
            this.createPostitTextArea().appendTo(this.$el);
            this.createChangePostitColorTool().appendTo(this.$el);

            this.input = this.$('.postit_input');

        },

        render: function(){
            this.$el
                .css("top", this.model.get("y")+"px")
                .css("left", this.model.get("x")+"px")
                .css("width", this.model.get("width")+"px")
                .css("height", this.model.get("height")+"px")
                .css("background-color", this.model.get("back_color"));
            this.$(".postit_input").css('background-color', this.model.get("back_color"));
            this.input.focus();
            return this;
        },

        createPostitCloseElement: function(){
            return $("<img/>")
                    .addClass("postit_close_image")
                    .attr("src", "/static/images/close.png")
        },

        deletePostit: function(){
            this.model.destroy();
            //postitToolListener.onDeletedPostit(_this.id);
        },

        createPostitTextArea: function(){
            var postitTextArea =  $("<textarea/>").addClass("postit_input")
                    .css('background-color', this.model.get("back_color"));
            postitTextArea.val(this.model.get("text"));
            return postitTextArea;
        },

        updateText: function(){
            var text = this.input.val();
            this.model.save({text: text});
            //postitToolListener.onUpdatedPostitText(_this.id, postitTextArea.val());
        },

        createPostitColorTool: function(){
            var image = $("<img/>")
                    .addClass("postit_color_image")
                    .attr("src", "/static/images/colors.png");
            return image;
        },

        showColors: function(){
            this.$el.find(".postit_color_tool").show();
        },

        createChangePostitColorTool: function() {
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
        },

        createColorSelectionElement: function(color, position){
            var _this = this;
            return $("<div class='postit_color'/>")
                    .css('background-color', color)
                    .css('float', position)
                    .click(function() {
                        //_this.setColor(color);
                        _this.model.save({"back_color": color});
                        //postitToolListener.onPostitChangedColor(_this.id, color, color);
                    });
        },

        showToolbar: function(){
            this.$el.find(".postit_close_image").show();//showCLoseImage
            this.$el.find(".postit_color_image").show();//showColorImage
            this.$el.css('padding-top','2px');
            this.$el.css('padding-bottom','20px');
        },

        hideToolbar: function(){
            this.$el.find(".postit_close_image").hide();//hideCloseImage
            this.$el.find(".postit_color_image").hide();//hideColorImage
            this.$el.css('padding-top','22px');
            this.$el.css('padding-bottom','2px');
        }
    });
    return PostitView;
});