from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response

def create_board(request):
    id = 1
    return HttpResponseRedirect("1")

def board(request, board_id):
    return render_to_response('board.html')