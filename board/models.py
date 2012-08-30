from django.db import models

class Board(models.Model):

    def __unicode__(self):
        return self.id

class PostIt(models.Model):
    board = models.ForeignKey(Board)
    x = models.IntegerField()
    y = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()
    text = models.TextField()

class Line(models.Model):
    board = models.ForeignKey(Board)
    x = models.IntegerField()
    y = models.IntegerField()
    x1 = models.IntegerField()
    y1 = models.IntegerField()
    color_l = models.IntegerField()
    stroke_w = models.IntegerField()
