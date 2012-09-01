# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'PostIt.color'
        db.add_column('board_postit', 'color',
                      self.gf('django.db.models.fields.TextField')(default='#FFFF99'),
                      keep_default=False)

        # Adding field 'PostIt.back_color'
        db.add_column('board_postit', 'back_color',
                      self.gf('django.db.models.fields.TextField')(default='#FFFF33'),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'PostIt.color'
        db.delete_column('board_postit', 'color')

        # Deleting field 'PostIt.back_color'
        db.delete_column('board_postit', 'back_color')


    models = {
        'board.board': {
            'Meta': {'object_name': 'Board'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        'board.line': {
            'Meta': {'object_name': 'Line'},
            'board': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['board.Board']"}),
            'color_l': ('django.db.models.fields.IntegerField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'stroke_w': ('django.db.models.fields.IntegerField', [], {}),
            'x': ('django.db.models.fields.IntegerField', [], {}),
            'x1': ('django.db.models.fields.IntegerField', [], {}),
            'y': ('django.db.models.fields.IntegerField', [], {}),
            'y1': ('django.db.models.fields.IntegerField', [], {})
        },
        'board.postit': {
            'Meta': {'object_name': 'PostIt'},
            'back_color': ('django.db.models.fields.TextField', [], {'default': "'#FFFF33'"}),
            'board': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['board.Board']"}),
            'color': ('django.db.models.fields.TextField', [], {'default': "'#FFFF99'"}),
            'height': ('django.db.models.fields.IntegerField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'text': ('django.db.models.fields.TextField', [], {}),
            'width': ('django.db.models.fields.IntegerField', [], {}),
            'x': ('django.db.models.fields.IntegerField', [], {}),
            'y': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['board']