$(function(){
    var Postit = Backbone.Model.extend({

        defaults: function(){
            return {
                text: "empty note"
            }
        },
        initialize: function(){
            if (!this.get("text")) {
                this.set({"title": this.defaults.title});
            }
        },
        sync: function(method, model, options){
            alert(method);
            alert(model);
            alert(options);
        }
    });

    var PostitList = Backbone.Collection.extend({
        model: Postit,
        url: "api/boards/"+board_id+"/postits"
    });

    var PostitView = Backbone.View.extend({
        tagName: "div",

        events: {
            "mouseover": "showToolbar",
            "mouseout": "hideToolbar",
            "click .postit_close_image": "remove",
            "mouseover .postit_color_image": "showColors"
        },

        initialize: function(){
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
        },

        render: function(){
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
                            //_this.model.set("y",position.top);
                            //_this.model.set({x: position.left, y: position.top});
                            //postitToolListener.onPostitMoved(_this.id, position.left, position.top);
                        },
                        stop: function(){
                            var position = $(this).position();
                            //_this.model.set({x: position.left, y: position.top});
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
                            //postitToolListener.onPostitStopResizing(_this.id, width, height);
                        }
                    });

            this.createPostitCloseElement().appendTo(this.$el);
            this.createPostitColorTool().appendTo(this.$el);
            this.createPostitTextArea().appendTo(this.$el);
            this.createChangePostitColorTool().appendTo(this.$el);
            return this;
        },

        createPostitCloseElement: function(){
            return $("<img/>")
                    .addClass("postit_close_image")
                    .attr("src", "/static/images/close.png")
        },

        /*remove: function(){
            this.model.remove();
            //postitTool.deletePostit(_this.id);
            //postitToolListener.onDeletedPostit(_this.id);
        },*/

        createPostitTextArea: function(){
            //var postitToolListener = this.postitToolListener;
            var postitTextArea =  $("<textarea/>").addClass("postit_input")
                    .css('background-color', this.model.get("back_color"));
            var _this = this;
            postitTextArea.keyup(function(){
                //postitToolListener.onUpdatedPostitText(_this.id, postitTextArea.val());
            });
            postitTextArea.val(this.text);
            return postitTextArea;
        },

        createPostitColorTool: function(){

            var postitTool = this.postitTool;
            var _this = this;
            var element = this.element;
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
            //var postitToolListener = this.postitToolListener;
            return $("<div class='postit_color'/>")
                    .css('background-color', color)
                    .css('float', position)
                    .click(function() {
                        _this.setColor(color);
                        //postitToolListener.onPostitChangedColor(_this.id, color, color);
                    });
        },

        setColor: function(color){
            this.$el.css('background-color',color);
            this.$el.find("textarea").css('background-color', color);
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

    var postits = new PostitList();

    var BoardView = Backbone.View.extend({
        el: $("#board"),
        events: {
            "click #board_canvas": "createPostit"
        },

        initialize: function(){
            postits.bind('add', this.addOne, this);
            postits.bind('reset', this.addAll, this);
            postits.bind('all', this.render, this);
            postits.fetch();
        },

        createPostit: function(){
            alert('creando postit');
        },

        addAll: function() {
            postits.each(this.addOne);
        },

        addOne: function(postit){
            var view = new PostitView({model: postit});
            $("#board").append(view.render().el);
        }
    });

    var app = new BoardView;
});