define([
  'underscore',
  'backbone',
  'views/board' // Request router.js
], function(_, Backbone, BoardView){
  var initialize = function(){
      var boardView = new BoardView();
      boardView.render();
  };

  return {
    initialize: initialize
  };
});