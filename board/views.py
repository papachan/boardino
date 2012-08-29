import json
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from board.models import Board, PostIt, Line

def create_board(request):
    new_board = Board()
    new_board.save()

    postit = PostIt(text="Nuevo",x=20,y=20, board=new_board)
    postit.save()

    return HttpResponseRedirect(new_board.id)

def board(request, board_id):
    the_board = get_object_or_404(Board, pk=board_id)
    return render_to_response('board.html',{'board_id': board_id, 'postits':the_board.postit_set.all()})

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
    line = Line(x=params["x"],y=params["y"], x1=params["x1"], y1=params["y1"], board=board)
    line.save()

    json_data = json.dumps({"x":line.x, "y":line.y, "x1":line.x1, "y1":line.y1})

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