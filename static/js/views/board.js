define([
    'views/postit',
    'models/postit',
    'collections/postits'
], function(PostitView, Postit, PostitList){
    var BoardView = Backbone.View.extend({
        el: $("#board"),
        events: {
            //"click #board_canvas": "createPostit"
        },

        initialize: function(){
            postits = new PostitList();
            postits.bind('add', this.addOne, this);
            postits.bind('reset', this.addAll, this);
            postits.bind('all', this.render, this);
            postits.fetch();
        },

        createPostit: function(x, y){
            postit = new Postit({"x":x, "y":y, "width":120, "height":120, "text":""});
            postits.add(postit);
            postit.save(null, {
                success: function(model, response){
                    boardConnection.newPostit(model.get("id"), postit.get("x"), postit.get("y"), postit.get("width"), postit.get("height"), postit.get("text"));
                }
            });
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
            //alert("updated text! "+text);
            postits.get(id).set("text",text);
        }
    });

    return BoardView;
});
