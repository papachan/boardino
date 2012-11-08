from rest_framework import serializers
from board.models import PostIt

class PostitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostIt
        fields = {'id','x','y','width','height','text','back_color'}

  