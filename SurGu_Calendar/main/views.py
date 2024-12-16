from django.db.models import Q
from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView

from .models import *
from .serializers import LessonSerializer, SubgroupSerializer, ProfessorSerializer, CustomUserSerializer
import jwt
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authentication import BaseAuthentication

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'path.to.BearerAuthentication',
    ],
}


def index(request):
    return render(request, 'index.html')


# Контроллер для получения расписания с фильтрацией
class LessonAPIList(generics.ListAPIView):
    serializer_class = LessonSerializer

    def get_queryset(self):
        search_query = self.request.GET.get('search', '')
        if search_query:
            request_list = search_query.split(' ')
            if len(request_list) <= 3:
                return search_lessons(self, *request_list)
        return None


# Контроллер для получения списка групп с фильтрацией
class SubgroupListAPIView(generics.ListAPIView):
    serializer_class = SubgroupSerializer  # Сериализатор для подгрупп

    def get_queryset(self):
        search_query = self.request.GET.get('search', '')
        if search_query:
            groups = Group.objects.filter(number_group__startswith=search_query)
            return Subgroup.objects.filter(group__in=groups)
        return Subgroup.objects.all()


# Контроллер для получения списка преподавателей с фильтрацией
class ProfessorListAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfessorSerializer

    def get_queryset(self):
        search_query = self.request.GET.get('search', '')  # Получаем параметр search
        if search_query:
            return Professor.objects.filter(
                Q(last_name__startswith=search_query) |
                Q(first_name__startswith=search_query) |
                Q(patronymic__startswith=search_query)
            )
        return Professor.objects.all()


def search_lessons(self, attr1, attr2=None, attr3=None):
    if attr3:
        search_results = Professor.objects.get(last_name=attr1, first_name=attr2, patronymic=attr3)
        lessons = Lesson.objects.filter(professor=search_results)
    elif attr2:
        lessons1 = Lesson.objects.filter(schedule__subgroup__group__number_group=attr1,
                                         schedule__subgroup__name_subgroup=attr2)
        lessons2 = Lesson.objects.filter(schedule__subgroup__group__number_group=attr1,
                                         schedule__subgroup__name_subgroup=None)
        lessons = lessons1.union(lessons2)
    else:
        lessons = Lesson.objects.filter(schedule__subgroup__group__number_group=attr1)
    return lessons


# Проверка авторизации пользователя
class ProtectedDataAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response({
            'message': 'Все отлично',
            'user': serializer.data
        })