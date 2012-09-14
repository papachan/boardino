import json
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseForbidden
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from board.models import Board, PostIt, Line

def create_board(request):
    new_board = Board()
    new_board.save()

    welcomePostit = PostIt(text="Welcome! Move me! Edit me! Delete me!",x=120,y=50, board=new_board, width=100,
                           height=100)
    sharePostit = PostIt(text="Share this board and work together in realtime!\n\nhttp://www.boardino.com/"+str(new_board.id),
                    x=200,
                    y=300,
                    board=new_board,
                    width=220,
                    height=100)
    comeBackPostit = PostIt(text="Come back to check new features!",x=550,y=50, board=new_board,
                            width=150,
                            height=100)
    welcomePostit.save()
    sharePostit.save()
    comeBackPostit.save()

    return HttpResponseRedirect("/"+str(new_board.id))

def authorize_board(request, board_id):
    if request.POST:
        board = get_object_or_404(Board, pk=board_id)
        password = request.POST["password"]
        if password==board.password:
            request.session['board_'+board_id] = {"authorized":True}
            return HttpResponseRedirect("/"+str(board_id))
        else:
            return render_to_response('authorize.html',{'board_id': board_id},context_instance=RequestContext(request))
    else:
        return render_to_response('authorize.html',{'board_id': board_id},context_instance=RequestContext(request))

def board(request, board_id):
    board = get_object_or_404(Board, pk=board_id)
    if board.password:
        if 'board_'+board_id not in request.session:
            return HttpResponseRedirect("/"+str(board_id)+"/authorize")
    return render_to_response('board.html',{'board_id': board_id, 'postits':board.postit_set.all()})

@csrf_exempt
def new_postit(request, board_id):
    the_board = get_object_or_404(Board, pk=board_id)
    params = request.POST
    postit = PostIt(text=params["text"],x=params["x"],y=params["y"], board=the_board,
                    width=int(float(params["width"])),
                    height=int(float(params["height"])))
    postit.save()

    json_data = json.dumps({"postit_id":postit.id, "text":postit.text, "x":postit.x, "y":postit.y})

    if request.is_ajax():
        return HttpResponse(json_data, mimetype="application/json")
    else:
        return HttpResponse(status=400)

@csrf_exempt
def new_line(request, board_id):
    board = get_object_or_404(Board, pk=board_id)
    params = request.POST
    line = Line(x=params["x"],y=params["y"], x1=params["x1"], y1=params["y1"], color_l=params["color_l"], stroke_w=params["stroke_w"], board=board)
    line.save()

    json_data = json.dumps({"x":line.x, "y":line.y, "x1":line.x1, "y1":line.y1,
                           "color_l":line.color_l, "stroke_w":line.stroke_w})

    if request.is_ajax():
        return HttpResponse(json_data, mimetype="application/json")
    else:
        return HttpResponse(status=400)

@csrf_exempt
def update_postit(request, postit_id):
    postit = get_object_or_404(PostIt, pk=postit_id)

    params = request.POST

    if "x" in params.keys():
        postit.x = int(float(params["x"]))

    if "y" in params.keys():
        postit.y = int(float(params["y"]))

    if "width" in params.keys():
        postit.width = int(float(params["width"]))

    if "height" in params.keys():
        postit.height = int(float(params["height"]))

    if "text" in params.keys():
        postit.text = params["text"]

    if "color" in params.keys():
        postit.color = params["color"]

    if "back_color" in params.keys():
        postit.back_color = params["back_color"]

    postit.save()

    json_data = json.dumps({"result":"OK"})

    if request.is_ajax():
        return HttpResponse(json_data, mimetype="application/json")
    else:
        return HttpResponse(status=400)

@csrf_exempt
def delete_postit(request, postit_id):
    postit = get_object_or_404(PostIt, pk=postit_id)
    postit.delete()

    json_data = json.dumps({"result":"OK"})

    if request.is_ajax():
        return HttpResponse(json_data, mimetype="application/json")
    else:
        return HttpResponse(status=400)

@csrf_exempt
def get_postits(request, board_id):
    board = get_object_or_404(Board, pk=board_id)
    json_data = json.dumps(list(board.postit_set.all().values()))

    if request.is_ajax():
        return HttpResponse(json_data, mimetype="application/json")
    else:
        return HttpResponse(status=400)

@csrf_exempt
def get_lines(request, board_id):
    board = get_object_or_404(Board, pk=board_id)
    json_data = json.dumps(list(board.line_set.all().values()))

    if request.is_ajax():
        return HttpResponse(json_data, mimetype="application/json")
    else:
        return HttpResponse(status=400)

@csrf_exempt
def clear_lines(request, board_id):
    print "hey!"
    board = get_object_or_404(Board, pk=board_id)
    Line.objects.filter(board=board).delete()

    json_data = json.dumps({"result":"OK"})

    if request.is_ajax():
        return HttpResponse(json_data, mimetype="application/json")
    else:
        return HttpResponse(status=400)
