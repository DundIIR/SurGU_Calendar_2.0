from django.urls import path
from .views import *


urlpatterns = [
    path('api/', LessonAPIList.as_view(), name='index_api'),
    path('', index, name='index'),
]
