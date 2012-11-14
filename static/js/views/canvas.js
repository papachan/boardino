define([
    'models/line',
    'collections/lines'
], function(Line, LineList){
    var BoardCanvas = Backbone.View.extend({
        el: $("#board-canvas"),

        path: null,

        line: null,

        lines : new LineList(),

        events: {
            "mousedown": "startLine",
            "mousemove": "mouseMove",
            "mouseup": "finishLine"
        },

        initialize: function(){
            //lines = new LineList();
            var _this = this;
            this.lines.fetch({success: function(lineList){
                //alert(JSON.stringify(lineList.models));
                _.each(lineList.models, function(line){
                    _this.deserialize(line.get("path"));
                });
            }});
            var canvas = this.el;
            paper.setup(canvas);

            _.each(this.lines.models, function(line){
                alert(line.get("path"));
                _this.deserialize(line.get("path"));
            });
            paper.view.draw();
            /*var json = '[{"point":{"x":696,"y":90},"handleIn":{"x":0,"y":0},"handleOut":{"x":-26.38383792414288,"y":45.22943644138775}},{"point":{"x":640,"y":235},"handleIn":{"x":22.92872158819273,"y":-45.857443176385516},"handleOut":{"x":-0.14907119849999617,"y":0.2981423969999639}},{"point":{"x":639,"y":235},"handleIn":{"x":0.33333333333337123,"y":0},"handleOut":{"x":0,"y":0}}]';
            this.path = this.deserialize(json);
            this.path.strokeColor = 'black';   */
        },

        render: function(){
            paper.view.draw();
        },

        startLine: function(e){
            this.line = new Line();
            this.lines.add(this.line);
            this.line.save({"x":1,"y":1,"x1":1,"y1":1,"stroke_w":1,"x":1});

            this.line.path = new paper.Path();
            this.line.path.strokeColor = 'black';
            var start = new paper.Point(e.pageX, e.pageY);
            //TODO: indicar con BoardConnection que empieza la línea
            this.line.path.add(start);

        },

        mouseMove: function(e){
            if(this.line && e.which==1){
                this.line.path.add(new paper.Point(e.pageX, e.pageY));
                //TODO: indicar con BoardConnection que se agregó un punto
            }
            paper.view.draw();
        },

        finishLine: function(e){
            this.line.path.simplify(10);
            //TODO: indicar con BoardConnection que se terminó de hacer la línea, para que la simplifiquen allá
            this.line.save({path: this.serialize(this.line.path)});
            this.line = null;
        },

        serialize: function(path){
            var pathToSerialize = [];
            $.each(path.getSegments(), function(i, segment){
                var segmentToSerialize = {
                    point: {x: segment.getPoint().x, y: segment.getPoint().y},
                    handleIn :  {x: segment.getHandleIn().x, y: segment.getHandleIn().y},
                    handleOut :  {x: segment.getHandleOut().x, y: segment.getHandleOut().y}
                };
                pathToSerialize.push(segmentToSerialize);
            });
            return JSON.stringify(pathToSerialize);
        },

        deserialize: function(jsonString){
            var path = new paper.Path();
            path.strokeColor = 'black';
            //alert(jsonString);
            $.each($.parseJSON(jsonString), function(i, segment){
                //alert(segment);
                path.add(new paper.Segment(segment.point, segment.handleIn, segment._handleOut));
            });
            return path;
        }
    });

    return BoardCanvas;
});
