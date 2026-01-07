from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import JournalRegistrationForm
from django.contrib.auth.decorators import login_required

def register_view(request):
    if request.method == 'POST':
        form = JournalRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = JournalRegistrationForm()
    return render(request, 'registration/register.html', {'form': form})

# users/views.py - update the dashboard_view function

@login_required
def dashboard_view(request):
    user = request.user
    
    if user.role == 'AUTHOR':
        items = user.manuscripts.all()
        template = 'dashboards/author.html'
    elif user.role == 'EDITOR':
        from submissions.models import Manuscript
        items = Manuscript.objects.all()
        template = 'dashboards/editor.html'
    elif user.role == 'REVIEWER':
        # ONLY get manuscripts assigned to THIS reviewer
        from submissions.models import Review
        items = Review.objects.filter(reviewer=user)
        template = 'dashboards/reviewer.html'
    else:
        items = []
        template = 'dashboards/default.html'
        
    return render(request, template, {'items': items})