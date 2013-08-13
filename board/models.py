from django.db import models

class Board(models.Model):

    password = models.TextField(default="")

    def __unicode__(self):
        return self.id

class PostIt(models.Model):
    board = models.ForeignKey(Board)
    x = models.IntegerField()
    y = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()
    text = models.TextField(null=True, blank=True)
    color = models.TextField(default="#FFFF99")
    back_color = models.TextField(default="#FFFF33")

class Line(models.Model):
    board = models.ForeignKey(Board)
    color_l = models.TextField(default="000000")
    stroke_w = models.IntegerField()
    path = models.TextField(null=True, blank=True)

