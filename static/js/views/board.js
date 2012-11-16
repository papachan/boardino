define([
    'views/postit',
    'views/canvas',
    'models/postit',
    'collections/postits'
], function(PostitView, BoardCanvas, Postit, PostitList){
    var BoardView = Backbone.View.extend({
        el: $("#board"),

        events: {
            "mousedown": "startLine",
            "mousedown #board-canvas": "createPostit",
            "mousemove": "mouseMove",
            "mouseup": "mouseUp"
        },

        initialize: function(){
            this.tool = "postits";
            this.canvas = new BoardCanvas(),
            //this.bind("mousedown", this.startLine, this);
            this.canvas.render();

            postits = new PostitList();
            postits.bind('add', this.addOne, this);
            postits.bind('reset', this.addAll, this);
            postits.bind('all', this.render, this);
            postits.fetch();
        },

        startLine: function(e){
            if(this.tool=="drawing")
                this.canvas.startLine(e);
        },

        mouseMove: function(e){
            if(this.tool=="drawing"){
                this.canvas.mouseMove(e);
            }
        },

        mouseUp: function(e){
            if(this.tool=="drawing"){
                this.canvas.finishLine(e);
            }
        },

        createPostit: function(e){
            if(this.tool=="postits"){
                postit = new Postit({"x":e.pageX, "y":e.pageY, "width":120, "height":120, "text":""});
                postits.add(postit);
                postit.save(null, {
                    success: function(model, response){
                        boardConnection.newPostit(model.get("id"), postit.get("x"), postit.get("y"), postit.get("width"), postit.get("height"), postit.get("text"));
                    }
                });
            }
        },

        showPostit: function(id){
            postit = new Postit({id:id});
            postit.fetch();
            postits.add(postit);
        },

        addAll: function() {
            postits.each(this.addOne);
        },

        addOne: function(postit){
            var view = new PostitView({model: postit});
            $("#board").append(view.render().el);
        },

        onCreatedLine: function(x, y, x1, y1, color, strokeWidth, add_to_local_array){
            $.post('/api/boards/'+board_id+'/lines/', { x: x, y: y, x1:x1, y1:y1, color_l:color, stroke_w:strokeWidth }, function(json){
                boardConnection.newLine(x, y, x1, y1, color, strokeWidth,
                                        add_to_local_array);
            });
        },

        onCreatingRectLine: function(x, y, x1, y1, color, strokeWidth, add_to_local_array){
            boardConnection.newLine(x, y, x1, y1, color, strokeWidth, add_to_local_array);
        },

        movePostit: function(id, newX, newY){
            postits.get(id).set({x: newX, y: newY});
        },

        resizePostit: function(id, width, height){
            postits.get(id).set({width: width, height: height});
        },

        changePostitColor: function(id, color){
            postits.get(id).set("back_color", color);
        },

        deletePostit: function(id){
            postits.remove(id);
        },

        updatePostitText: function(id, text){
            postits.get(id).set("text",text);
        },

        startPath: function(id, x, y, color){
            this.canvas.startPath(id, x, y, color);
        },

        addPathPoint: function(id, x, y){
            this.canvas.addPathPoint(id, x, y);
        },

        finishPath: function(id){
            this.canvas.finishPath(id);
        },

        selectPostitTool: function(){
            this.tool = "postits";
        },

        selectPencilTool: function(color){
            this.tool = "drawing";
            this.canvas.setStrokeColor(color);
        },

        selectRectLineTool: function(){
            this.tool = "drawing";
        },

        selectEraserTool: function(){

        },

        clearLines: function(){
            this.canvas.clearLines();
        }
    });

    return BoardView;
});
