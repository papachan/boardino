define([
], function(){
    var Postit = Backbone.Model.extend({

        initialize: function(){
            if (!this.get("text")) {
                this.set({"text": " "});
            }
        }/*,
        sync: function(method, object, options){
            alert(JSON.stringify(object));
        }*/
    });
    return Postit;
});

