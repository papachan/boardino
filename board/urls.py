from django.conf.urls import include
from django.conf.urls.defaults import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns
from board.views import PostitList

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
    url(r'^(?P<board_id>\d+)/lines/clear', 'clear_lines'),
    #API
    url(r'^api/boards/(?P<board_id>\d+)/postits/$', PostitList.as_view(), name='postit-list'),
)

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'api'])


urlpatterns += patterns('',
    url(r'^api/$', 'board.views.api_root'),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)
