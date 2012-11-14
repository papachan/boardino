define([
  'views/board',
  'views/canvas',
  'boardconnection'
], function(BoardView, BoardCanvas, BoardConnection){
    var initialize = function(){

        var boardView = new BoardView();
        boardView.render();

        var canvas = new BoardCanvas();
        canvas.render();

        function initBoard(){
            boardConnection = new BoardConnection(board_id, new BoardMessageHandler(boardView));
        }

        /*function loadLines(){
            $.get('/'+board_id+'/lines', function(json){
                $.each(json, function(i, line){
                    processingInstance.addLine(line.x, line.y , line.x1,
                    line.y1, line.color_l, line.stroke_w, true);
                });
            });
        }

        function clearLines(){
            $.get('/'+board_id+'/lines/clear/',  function(json){
                 boardConnection.clearLines();
                 processingInstance.clearLines();
            });
        } */


        $(document).ready(function() {
            initBoard();
            loadToolbar();

            $("#connected_users").mouseover(function(){
                $(this).text(connectedUsers + " connected users");
            });
            $("#connected_users").mouseout(function(){
                $(this).text(connectedUsers);
            });

            $(window).bind("beforeunload", function() {
                boardConnection.disconnect();
            });
        });

        function loadToolbar(){
            var toolbar = new Toolbar();
            toolbar.addTool($("#eraser_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/eraser_disabled.ico),default');
                        processingInstance.selectEraserTool();
                    }
            }));

            toolbar.addTool($("#postit_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/postit_disabled.ico),default');
                        processingInstance.selectPostitTool();
                    }
            }));

            toolbar.addTool($("#selected_pencil_tool").tool(toolbar, {
                    "enabledClass": "pencil_black_tool_enabled",
                    "disabledClass": "pencil_tool_disabled",
                    "action": function(){}
            }));

            toolbar.addTool($("#pencil_black_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/pencil_disabled.ico),default');
                        processingInstance.selectPencilTool("FF000000");
                        $("#selected_pencil_tool").attr('class', "pencil_black_tool_enabled");
                    }
            }));

            toolbar.addTool($("#pencil_green_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/pencil_green_disabled.ico),default');
                        processingInstance.selectPencilTool("FF00FF00");
                        $("#selected_pencil_tool").attr('class', "pencil_green_tool_enabled");
                    }
            }));

            toolbar.addTool($("#pencil_red_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/pencil_red_disabled.ico),default');
                        processingInstance.selectPencilTool("FFFF0000");
                        $("#selected_pencil_tool").attr('class', "pencil_red_tool_enabled");
                    }
            }));

            toolbar.addTool($("#pencil_blue_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/pencil_blue_disabled.ico),default');
                        processingInstance.selectPencilTool("FF0000FF");
                        $("#selected_pencil_tool").attr('class', "pencil_blue_tool_enabled");
                    }
            }));

            toolbar.addTool($("#clear_lines_tool").tool(toolbar, {
                    "action": function(){
                        clearLines();
                    },
                    "confirmable": true,
                    "exclusive": false
            }));

            toolbar.addTool($("#rectline_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/rectline_disabled.ico),default');
                        processingInstance.selectRectLineTool("FF000000");
                    }
            }));


            $("#pencil_tool").mouseover(function(){
                $("#pencil_tool").width(200);
                $("#selected_pencil_tool").hide();
                $("#pencil_black_tool").show();
                $("#pencil_green_tool").show();
                $("#pencil_red_tool").show();
                $("#pencil_blue_tool").show();
            });
            $("#pencil_tool").mouseout(function(){
                $("#pencil_tool").width(50);
                $("#selected_pencil_tool").show();
                $("#pencil_black_tool").hide();
                $("#pencil_green_tool").hide();
                $("#pencil_red_tool").hide();
                $("#pencil_blue_tool").hide();
            });
        }
  };

  return {
    initialize: initialize
  };
});
