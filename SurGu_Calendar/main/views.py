import boto3
from django.db.models import Q
from django.shortcuts import render
from rest_framework import generics
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from .authentication import IsAdminUserRole
from .models import *
from .serializers import LessonSerializer, SubgroupSerializer, ProfessorSerializer, CustomUserSerializer, \
    UserListSerializer, FileSerializer

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import AuthenticationFailed, ValidationError, NotFound
from rest_framework.authentication import BaseAuthentication

from django.conf import settings

import uuid
from datetime import datetime

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
            'user': serializer.data
        })


class UserListAPIView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole]


class UpdateUserRoleAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def post(self, request):
        email = request.data.get('email')
        role_name = request.data.get('role')

        if not email or not role_name:
            raise ValidationError({'error': 'Поля email и role обязательны.'})

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise NotFound({'error': f'Пользователь с email {email} не найден.'})

        try:
            role = Role.objects.get(name=role_name)
        except Role.DoesNotExist:
            raise NotFound({'error': f'Роль с именем {role_name} не найдена.'})

        user.role = role
        user.save()

        return Response({'message': f'Роль пользователя {email} успешно обновлена на {role_name}.'})


# class FileUploadAPIView(APIView):
#     authentication_classes = []
#     permission_classes = [AllowAny]
#     parser_classes = [MultiPartParser]
#     def post(self, request):
#         files = request.FILES.getlist('files')
#
#         s3_client = boto3.client(
#             's3',
#             aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
#             aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
#             endpoint_url=settings.AWS_END_POINT,
#             region_name=settings.AWS_REGION,
#
#         )
#
#         uploaded_files = []
#
#         for file in files:
#             print(file)
#             try:
#                 s3_client.upload_fileobj(
#                     Fileobj=file,
#                     Bucket=settings.AWS_BUCKET,
#                     Key=file.name,
#                     ExtraArgs={'ContentType': file.content_type}
#                 )
#                 uploaded_files.append(file.name)
#             except Exception as e:
#                 return Response({'error': f'Ошибка загрузки файла {file.name}: {str(e)}'}, status=500)
#
#         return Response({
#             'message': 'Файлы успешно загружены в Yandex Object Storage.',
#             'uploaded_files': uploaded_files
#         })


class FileUploadAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser]

    def post(self, request):
        # Проверка наличия файлов в запросе
        files = request.FILES.getlist('files')
        if not files:
            return Response({'error': 'Файлы не были загружены.'}, status=400)

        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            endpoint_url=settings.AWS_END_POINT,
            region_name=settings.AWS_REGION,
        )

        uploaded_files = []

        for file in files:
            # Валидация: Проверка типа файла
            if not file.name.endswith('.pdf'):  # пример для PDF файлов
                return Response({'error': f'Неверный тип файла: {file.name}. Требуется PDF.'}, status=400)

            # Валидация: Проверка длина названия
            if len(file.name) > 250:
                return Response(
                    {
                        'error': f'Название файла слишком длинное, {len(file.name)} символов. Максимум 250 символов.'},
                    status=400
                )

            # Валидация: Проверка размера файла (например, 5MB)
            if file.size > 5 * 1024 * 1024:  # 5MB
                return Response({'error': f'Файл {file.name} слишком большой. Максимальный размер: 5MB.'}, status=400)

            # Генерация уникального имени файла
            unique_name = str(uuid.uuid4()) + '.pdf'

            try:
                # Загрузка файла в S3
                s3_client.upload_fileobj(
                    Fileobj=file,
                    Bucket=settings.AWS_BUCKET,
                    Key=unique_name,
                    ExtraArgs={'ContentType': file.content_type}
                )

                # Формирование URL для загруженного файла
                file_url = f"{settings.AWS_END_POINT}/{settings.AWS_BUCKET}/{unique_name}"

                # Добавление записи в БД
                file_record = FileSchedule(file_name=file.name, file_url=file_url)
                file_record.save()

                # Добавление в список успешных файлов
                uploaded_files.append(file.name)
            except Exception as e:
                return Response({'error': f'Файл {file.name} не загрузился: {str(e)}'}, status=500)

        # Возвращаем успешный ответ
        return Response({
            'message': 'Файлы успешно загружены в Yandex Object Storage.',
            'uploaded_files': uploaded_files
        })


class FileListAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        files = FileSchedule.objects.all()
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data)