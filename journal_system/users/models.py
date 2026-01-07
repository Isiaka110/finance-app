# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # Define Roles as constants
    ADMIN = 'ADMIN'
    EDITOR = 'EDITOR'
    REVIEWER = 'REVIEWER'
    AUTHOR = 'AUTHOR'

    ROLE_CHOICES = [
        (ADMIN, 'Administrator'),
        (EDITOR, 'Editor'),
        (REVIEWER, 'Reviewer'),
        (AUTHOR, 'Author'),
    ]

    # Add the role field
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=AUTHOR)
    
    # Add extra fields for profiles
    institution = models.CharField(max_length=255, blank=True, null=True)
    expertise = models.CharField(max_length=255, blank=True, null=True, help_text="Comma-separated areas of expertise")

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"

    # Helper methods to check permissions easily in templates/views
    @property
    def is_editor(self):
        return self.role == self.EDITOR

    @property
    def is_reviewer(self):
        return self.role == self.REVIEWER
    
    @property
    def is_author(self):
        return self.role == self.AUTHOR