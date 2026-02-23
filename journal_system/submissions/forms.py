from django import forms
from .models import Manuscript

from .models import Review


class ManuscriptSubmissionForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs.update({'class': 'form-control'})

    class Meta:
        model = Manuscript
        fields = ['title', 'abstract', 'file']
        widgets = {
            'abstract': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Enter your manuscript abstract...'}),
        }


# submissions/forms.py

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['comments', 'score', 'recommendation']
        widgets = {
            'comments': forms.Textarea(attrs={'class': 'form-control', 'rows': 5}),
            'score': forms.Select(attrs={'class': 'form-select'}),
            'recommendation': forms.Select(attrs={'class': 'form-select'}),
        }