define([
  'models/postit'
], function(Postit){
    var PostitList = Backbone.Collection.extend({
        model: Postit,
        url: "api/boards/"+board_id+"/postits/"
    });
    return PostitList;
});