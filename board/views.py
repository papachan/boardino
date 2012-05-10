from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from board.models import Board, PostIt

def create_board(request):
    board = Board()
    postit = PostIt(text="Soy un postit")
    board.postit_set.add(postit)
    board.save()
    return HttpResponseRedirect(board.id)

def board(request, board_id):
    board = get_object_or_404(Board, pk=board_id)
    return render_to_response('board.html',{'postits':board.postit_set.all()})