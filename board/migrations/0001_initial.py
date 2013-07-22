# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Board'
        db.create_table(u'board_board', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('password', self.gf('django.db.models.fields.TextField')(default='')),
        ))
        db.send_create_signal(u'board', ['Board'])

        # Adding model 'PostIt'
        db.create_table(u'board_postit', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('board', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['board.Board'])),
            ('x', self.gf('django.db.models.fields.IntegerField')()),
            ('y', self.gf('django.db.models.fields.IntegerField')()),
            ('width', self.gf('django.db.models.fields.IntegerField')()),
            ('height', self.gf('django.db.models.fields.IntegerField')()),
            ('text', self.gf('django.db.models.fields.TextField')(null=True)),
            ('color', self.gf('django.db.models.fields.TextField')(default='#FFFF99')),
            ('back_color', self.gf('django.db.models.fields.TextField')(default='#FFFF33')),
        ))
        db.send_create_signal(u'board', ['PostIt'])

        # Adding model 'Line'
        db.create_table(u'board_line', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('board', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['board.Board'])),
            ('color_l', self.gf('django.db.models.fields.TextField')(default='000000')),
            ('stroke_w', self.gf('django.db.models.fields.IntegerField')()),
            ('path', self.gf('django.db.models.fields.TextField')(null=True)),
        ))
        db.send_create_signal(u'board', ['Line'])


    def backwards(self, orm):
        # Deleting model 'Board'
        db.delete_table(u'board_board')

        # Deleting model 'PostIt'
        db.delete_table(u'board_postit')

        # Deleting model 'Line'
        db.delete_table(u'board_line')


    models = {
        u'board.board': {
            'Meta': {'object_name': 'Board'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'password': ('django.db.models.fields.TextField', [], {'default': "''"})
        },
        u'board.line': {
            'Meta': {'object_name': 'Line'},
            'board': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['board.Board']"}),
            'color_l': ('django.db.models.fields.TextField', [], {'default': "'000000'"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'path': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'stroke_w': ('django.db.models.fields.IntegerField', [], {})
        },
        u'board.postit': {
            'Meta': {'object_name': 'PostIt'},
            'back_color': ('django.db.models.fields.TextField', [], {'default': "'#FFFF33'"}),
            'board': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['board.Board']"}),
            'color': ('django.db.models.fields.TextField', [], {'default': "'#FFFF99'"}),
            'height': ('django.db.models.fields.IntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'text': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'width': ('django.db.models.fields.IntegerField', [], {}),
            'x': ('django.db.models.fields.IntegerField', [], {}),
            'y': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['board']