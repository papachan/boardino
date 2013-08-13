define([
], function(){
    var Postit = Backbone.Model.extend({
        urlRoot: "api/boards/"+board_id+"/postits/",

        initialize: function(){
        }
    });
    return Postit;
});

