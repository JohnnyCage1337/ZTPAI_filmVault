# people/serializers.py

from rest_framework import serializers
from .models import Person, Credit

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'first_name', 'middle_name', 'last_name', 'sex', 'birth_date', 'description', 'image']


class CreditSerializer(serializers.ModelSerializer):
    person = PersonSerializer(read_only=True)
    class Meta:
        model = Credit
        fields = [
            'id', 'person', 'role', 'character_name',
            'billing_order', 'content_type', 'object_id'
        ]

class CreditCreateSerializer(serializers.ModelSerializer):
    person_id = serializers.PrimaryKeyRelatedField(
        source='person', queryset=Person.objects.all(), write_only=True
    )
    class Meta:
        model = Credit
        fields = ['person_id', 'role', 'character_name', 'billing_order']
