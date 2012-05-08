from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('board.views',
    url(r'^$', 'board'),
)