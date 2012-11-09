require.config({
  paths: {
    jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js',
    underscore: 'http://ajax.cdnjs.com/ajax/libs/underscore.js/1.3.3/underscore-min.js',
    backbone: 'backbone-min.js'
  }

});

require([

  // Load our app module and pass it to our definition function
  'app',
], function(App){
    // The "app" dependency is passed in as "App"
    App.initialize();
});
