from django.urls import path
from .views import *


urlpatterns = [
    path('api/validate-token/', ProtectedDataAPIView.as_view(), name='validate_token'),
    path('api/groups/', SubgroupListAPIView.as_view(), name='group_list'),
    path('api/professors/', ProfessorListAPIView.as_view(), name='professor_list'),
    path('api/', LessonAPIList.as_view(), name='index_api'),
    path('', index, name='index'),
]
