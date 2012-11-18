from rest_framework import serializers
from board.models import PostIt, Line

class PostitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostIt
        fields = {'id','x','y','width','height','text','back_color'}


class LineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Line
        fields = {'id', 'color_l','stroke_w','path'}

  