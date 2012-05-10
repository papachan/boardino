from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from board.models import Board

def create_board(request):
    board = Board()
    board.save()
    return HttpResponseRedirect(board.id)

def board(request, board_id):
    the_board = get_object_or_404(Board, pk=board_id)
    return render_to_response('board.html',{'board':the_board})