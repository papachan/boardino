from django.shortcuts import render_to_response

def board(request):
    return render_to_response('board.html')
