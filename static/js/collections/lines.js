define([
  'models/line'
], function(Line){
    var LineList = Backbone.Collection.extend({
        model: Line,
        url: "api/boards/"+board_id+"/lines/"
    });
    return LineList;
});
