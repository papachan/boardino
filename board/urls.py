from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('board.views',
    url(r'^$', 'home'),
    url(r'^new$', 'create_board'),
    url(r'^subscribe', 'subscribe'),
    url(r'^(?P<board_id>\d+)$', 'board'),
    url(r'^(?P<board_id>\d+)/postits', 'get_postits'),
    url(r'^(?P<board_id>\d+)/lines$', 'get_lines'),
    url(r'^(?P<board_id>\d+)/postit/new', 'new_postit'),
    url(r'^(?P<board_id>\d+)/line/new', 'new_line'),
    url(r'^(?P<board_id>\d+)/authorize', 'authorize_board', name="board-authorization"),
    url(r'^postit/(?P<postit_id>\d+)/update', 'update_postit'),
    url(r'^postit/(?P<postit_id>\d+)/delete', 'delete_postit'),
    url(r'^(?P<board_id>\d+)/lines/clear', 'clear_lines')
)
