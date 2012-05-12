from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from board.models import Board, PostIt

def create_board(request):
    new_board = Board()
    new_board.save()

    postit = PostIt(text="Nuevo",x=20,y=20, board=new_board)
    postit.save()

    return HttpResponseRedirect(new_board.id)

def board(request, board_id):
    the_board = get_object_or_404(Board, pk=board_id)
    return render_to_response('board.html',{'postits':the_board.postit_set.all()})