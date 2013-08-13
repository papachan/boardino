function Toolbar(){
    this.tools = [];
}

Toolbar.prototype.addTool = function(tool){
    this.tools.push(tool);
};

(function($){
    $.fn.tool = function(toolbar, options){

        var settings = $.extend({
                                    'element': this,
                                    'enabledClass': this.attr('id')+'_enabled',
                                    'disabledClass': this.attr('id')+'_disabled',
                                    'exclusive': true
        }, options);

        this.click(function(){
            if(settings.exclusive){
                $.each(toolbar.tools, function(i, otherTool){
                    otherTool.element.attr({'class': otherTool.disabledClass})
                });
            }
            $(this).attr({'class':settings.enabledClass});
            if(settings.confirmable){
                $("#dialog").dialog({
                                        buttons : {
                                            "Confirm" : function() {
                                                $(this).dialog("close");
                                                settings.action();
                                            },
                                            "Cancel" : function() {
                                                $(this).dialog("close");
                                            }
                                        }
                                    });
            }else
                settings.action();
        });

        return settings;
    };
})(jQuery);