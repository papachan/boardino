require.config({
  paths: {
    jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min',
    jqueryui: 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.min',
    underscore: 'underscore-min',
    backbone: 'backbone-min'
  }

});

require([
    'app'
], function(App){
    // The "app" dependency is passed in as "App"
    App.initialize();
});
