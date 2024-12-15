from rest_framework import serializers

from .create_json import create_json
from .models import *

# Сериализатор для расписания
class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

    def to_representation(self, instance):
        return create_json(instance)

# Сериализатор для групп
class SubgroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subgroup
        fields = '__all__'

    def to_representation(self, instance):
        return {
            'subgroup': instance.name_subgroup,
            'group': instance.group.number_group
        }

# Сериализатор для преподавателей
class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = []

    def to_representation(self, instance):
        return {
            'full_name': f"{instance.last_name} {instance.first_name} {instance.patronymic}"
        }