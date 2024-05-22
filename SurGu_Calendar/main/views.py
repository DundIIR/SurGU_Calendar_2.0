from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers import LessonSerializer


def index(request):
    return render(request, 'index.html')


class LessonAPIList(generics.ListAPIView):
    serializer_class = LessonSerializer

    def get_queryset(self):
        request_list = self.request.GET.get('search').split(' ')
        if len(request_list) <= 3:
            result = search_lessons(self, *request_list)
            return result


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
