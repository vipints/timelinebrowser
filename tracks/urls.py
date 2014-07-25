
from django.conf.urls import patterns, url

from tracks import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index')
    )
