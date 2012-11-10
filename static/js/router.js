define([
  'views/board'
], function(BoardView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){
    console.log("iniciadno router");
    var app_router = new AppRouter;
    app_router.on('defaultAction', function(){
      var boardView = new BoardView();
      boardView.render();
    });
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});