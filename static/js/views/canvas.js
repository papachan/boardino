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
                    if(line.get("path")){
                        line.path = _this.lineToPath(line);
                        line.path.model = line;
                    }
                });
                paper.view.draw();
            }});
            var canvas = this.el;
            paper.setup(canvas);
        },

        render: function(){
            paper.view.draw();
        },

        startLine: function(x, y, type){
            var line = new Line();
            line.set("color_l",this.strokeColor);
            line.type = type;

            var path = new paper.Path();
            path.model = line;

            path.strokeColor = this.strokeColor;
            var start = new paper.Point(x, y);
            path.add(start);

            var _this = this;
            line.save({"stroke_w":1},{
                          success: function(model, response){
                              _this.line = model;
                              _this.line.path = path;
                              _this.lines.add(model);
                              boardConnection.startPath(model.get("id"), x, y, model.get("color_l"));
                              paper.view.draw();
                          }
                      });
        },

        mouseMove: function(e){
            var _this = this;
            setTimeout(function() {
                if(_this.line && e.which==1 && _this.line.type == "free"){
                    _this.line.path.add(new paper.Point(e.pageX, e.pageY));
                    boardConnection.addPathPoint(_this.line.get("id"), e.pageX, e.pageY);
                }
                paper.view.draw();
            }, 0);
        },

        finishLine: function(e){
            if(this.line.type=="rect"){
                this.line.path.add(new paper.Point(e.pageX, e.pageY));
                boardConnection.addPathPoint(this.line.get("id"), e.pageX, e.pageY);
            }
            else{
                this.line.path.simplify(10);
            }
            paper.view.draw();
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
            var path = new paper.Path();
            path.add(new paper.Point(x, y));
            line.path = path;
            line.path.model = line;
            line.fetch({
                success: function(model){
                    path.strokeColor = model.get("color_l");
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
        },

        clearLines: function(color){
            _.chain(this.lines.models).clone().each(function(model){
                if(model.path)
                    model.path.remove();
                model.destroy();
                boardConnection.deleteLine(model.get("id"));
            });
            paper.view.draw();
        },

        tryToErase: function(x, y){
            var hitOptions = {
                segments: true,
                stroke: true,
                fill: true,
                tolerance: 5
            };
            var hitResult = paper.project.hitTest(new paper.Point(x,y), hitOptions);
            if(hitResult){
                hitResult.item.remove();
                boardConnection.deleteLine(hitResult.item.model.get("id"));
                hitResult.item.model.destroy();
                paper.view.draw();
            }
        },

        deleteLine: function(id){
            if( this.lines.get(id)){
                this.lines.get(id).path.remove();
                paper.view.draw();
            }
        }
    });

    return BoardCanvas;
});
