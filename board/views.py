import json
from django.core import serializers
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from board.models import Board, PostIt

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
    postit = PostIt(text=params["text"],x=params["x"],y=params["y"], board=the_board)
    postit.save()

    json_data = json.dumps({"postit_id":postit.id, "text":postit.text, "x":postit.x, "y":postit.y})
    print "JSON!:"+json_data
    #json_data = serializers.serialize("json", [postit], ensure_ascii=False, use_natural_keys=True)
    if request.is_ajax():
        return HttpResponse(json_data, mimetype="application/json")
    else:
        return HttpResponse(status=400)
