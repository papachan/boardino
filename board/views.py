import json
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseForbidden
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.reverse import reverse
from board.models import Board, PostIt, Line
from board.serializers import PostitSerializer, LineSerializer

def home(request):
    return render_to_response('home.html')

@csrf_exempt
def subscribe(request):

    if "email" not in request.POST or not validateEmail(request.POST["email"]):
        json_data = json.dumps({"result":"Pleas enter a valid email"})
        return HttpResponse(json_data, mimetype="application/json")

    print "seguieee!!"
    if request.is_ajax():
        email = request.POST["email"]
        try:
            User.objects.get(email__exact=email)
            json_data = json.dumps({"result":"The email is already registered"})
        except User.DoesNotExist:
            user = User.objects.create_user(email, email)
            user.save()
            json_data = json.dumps({"result":"Subscribed!"})
        return HttpResponse(json_data, mimetype="application/json")
    else:
        return HttpResponse(status=400)

def validateEmail(email):
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError
    try:
        validate_email( email )
        return True
    except ValidationError:
        return False

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
                    height=100,
                    back_color='#FF69B4')
    comeBackPostit = PostIt(text="Come back to check new features!",x=550,y=50, board=new_board,
                            width=150,
                            height=100,
                            back_color='#ADFF2F')
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
def clear_lines(request, board_id):
    board = get_object_or_404(Board, pk=board_id)
    Line.objects.filter(board=board).delete()

    json_data = json.dumps({"result":"OK"})

    if request.is_ajax():
        return HttpResponse(json_data, mimetype="application/json")
    else:
        return HttpResponse(status=400)


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'postits':reverse('postit-list', request=request)
    })


class PostitList(generics.ListCreateAPIView):
    model = PostIt
    serializer_class = PostitSerializer

    def get_queryset(self):
        board_id = self.kwargs['board_id']
        return PostIt.objects.filter(board__id=board_id)

    def pre_save(self, postit):
        board_id = self.kwargs['board_id']
        board = get_object_or_404(Board, pk=board_id)
        postit.board = board


class PostitDetail(generics.RetrieveUpdateDestroyAPIView):
    model = PostIt
    serializer_class = PostitSerializer


class LineList(generics.ListCreateAPIView):
    model = Line
    serializer_class = LineSerializer

    def get_queryset(self):
        board_id = self.kwargs['board_id']
        return Line.objects.filter(board__id=board_id)

    def pre_save(self, line):
        board_id = self.kwargs['board_id']
        board = get_object_or_404(Board, pk=board_id)
        line.board = board

class LineDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Line
    serializer_class = LineSerializer