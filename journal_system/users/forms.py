# users/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class JournalRegistrationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        # Removed 'role' from fields. It defaults to AUTHOR in the model/view.
        fields = UserCreationForm.Meta.fields + ('email', 'institution', 'expertise')


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'expertise']
        widgets = {
            'expertise': forms.Textarea(attrs={'rows': 3, 'placeholder': 'e.g. Data Science, Machine Learning...'}),
        }