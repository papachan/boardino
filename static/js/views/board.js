define([
    'views/postit',
    'collections/postits'
], function(PostitView, PostitList){
    var BoardView = Backbone.View.extend({
        el: $("#board"),
        events: {
            "click #board_canvas": "createPostit"
        },

        initialize: function(){
            postits = new PostitList();
            postits.bind('add', this.addOne, this);
            postits.bind('reset', this.addAll, this);
            postits.bind('all', this.render, this);
            postits.fetch();
        },

        createPostit: function(e){
                //postitTool.focusPostit(json["postit_id"]);
                //boardConnection.newPostit({{ board_id }}, json["postit_id"], json["x"],json["y"], width, height, json["text"]);
            postit = new Postit({"x":e.pageX, "y":e.pageY, "width":120, "height":120, "text":""});
            postits.add(postit);
            postit.save();
        },

        addAll: function() {
            postits.each(this.addOne);
        },

        addOne: function(postit){
            var view = new PostitView({model: postit});
            $("#board").append(view.render().el);
        }
    });

    return BoardView;
});