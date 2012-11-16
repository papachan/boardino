define([
    'models/line',
    'collections/lines'
], function(Line, LineList){
    var BoardCanvas = Backbone.View.extend({
        el: $("#board-canvas"),

        lines : new LineList(),

        events: {
        },

        initialize: function(){
            this.strokeColor = "black";
            var _this = this;
            this.lines.fetch({success: function(lineList){
                _.each(lineList.models, function(line){
                    if(line.get("path"))
                        _this.lineToPath(line);
                });
                paper.view.draw();
            }});
            var canvas = this.el;
            paper.setup(canvas);


        },

        render: function(){
            paper.view.draw();
        },

        startLine: function(e){
            var line = new Line();
            line.set("color_l",this.strokeColor);
            this.lines.add(this.line);

            line.path = new paper.Path();
            line.path.strokeColor = this.strokeColor;
            var start = new paper.Point(e.pageX, e.pageY);
            line.path.add(start);

            var _this = this;
            line.save({"x":1,"y":1,"x1":1,"y1":1,"stroke_w":1},{
                          success: function(model, response){
                              _this.line = model;
                              boardConnection.startPath(model.get("id"), e.pageX, e.pageY, model.get("color_l"));
                              paper.view.draw();
                          }
                      });
        },

        mouseMove: function(e){
            var _this = this;
            setTimeout(function() {
                if(_this.line && e.which==1){
                    _this.line.path.add(new paper.Point(e.pageX, e.pageY));
                    boardConnection.addPathPoint(_this.line.get("id"), e.pageX, e.pageY);
                }
                paper.view.draw();
            }, 0);
        },

        finishLine: function(e){
            this.line.path.simplify(10);
            boardConnection.finishPath(this.line.get("id"));
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

        lineToPath: function(line){
            var path = new paper.Path();
            path.strokeColor = line.get("color_l");
            $.each($.parseJSON(line.get("path")), function(i, segment){
                path.add(new paper.Segment(segment.point, segment.handleIn, segment._handleOut));
            });
            return path;
        },

        startPath: function(id, x, y, color){
            var line = new Line({id:id});
            line.fetch({
                success: function(model){
                    var path = new paper.Path();
                    path.strokeColor = model.get("color_l");
                    path.add(new paper.Point(x, y));
                    line.path = path;
                }
            });
            this.lines.add(line);
        },

        addPathPoint: function(id, x, y){
            this.lines.get(id).path.add(new paper.Point(x, y));
            paper.view.draw();
        },

        finishPath: function(id){
            this.lines.get(id).path.simplify(10);
            paper.view.draw();
        },

        setStrokeColor: function(color){
            this.strokeColor = color;
        }
    });

    return BoardCanvas;
});
