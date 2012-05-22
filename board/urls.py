from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('board.views',
    url(r'^$', 'create_board'),
    url(r'^(?P<board_id>\d+)$', 'board'),
    url(r'^(?P<board_id>\d+)/postit/new', 'new_postit'),
)