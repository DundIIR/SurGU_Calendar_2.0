from rest_framework import serializers

from .create_json import create_json
from .models import *


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

    def to_representation(self, instance):
        return create_json(instance)

