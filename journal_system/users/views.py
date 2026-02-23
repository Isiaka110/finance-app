from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages

from .forms import JournalRegistrationForm
from .models import CustomUser

# --- REGISTRATION ---
def register_view(request):
    if request.method == 'POST':
        form = JournalRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.role = 'AUTHOR'  # Every new user starts as an Author
            user.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = JournalRegistrationForm()
    return render(request, 'registration/register.html', {'form': form})

# --- UNIFIED DASHBOARD ---
@login_required
def dashboard_view(request):
    user = request.user
    
    if user.is_superuser or user.role == 'EDITOR':
        from submissions.models import Manuscript
        items = Manuscript.objects.all().order_by('-submission_date')
        return render(request, 'dashboards/editor.html', {'items': items})

    elif user.role == 'REVIEWER':
        from submissions.models import Review
        items = Review.objects.filter(reviewer=user).order_by('-date_assigned')
        return render(request, 'dashboards/reviewer.html', {'items': items})

    else: # AUTHOR
        items = user.manuscripts.all().order_by('-submission_date')
        submission_count = items.count()
        
        eligible = submission_count >= 2
        # Calculate remaining submissions needed for promotion
        needed = max(0, 2 - submission_count) 
        
        return render(request, 'dashboards/author.html', {
            'items': items,
            'eligible_for_promotion': eligible,
            'submission_count': submission_count,
            'needed': needed # <--- Pass this new variable
        })

# --- SUPERADMIN USER MANAGEMENT ---
@staff_member_required 
def manage_users(request):
    # Filter out the superuser so they don't accidentally demote themselves
    users = CustomUser.objects.filter(is_superuser=False).order_by('username')
    
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        new_role = request.POST.get('new_role')
        
        user_to_edit = get_object_or_404(CustomUser, id=user_id)
        user_to_edit.role = new_role
        user_to_edit.save()
        
        messages.success(request, f"Updated {user_to_edit.username} to {user_to_edit.get_role_display()}")
        return redirect('manage_users')

    return render(request, 'dashboards/manage_users.html', {'users': users})

@login_required
def request_promotion(request):
    if request.method == 'POST':
        user = request.user
        current_expertise = user.expertise or ""
        user.expertise = f"{current_expertise}\n[SYSTEM: REQUESTED PROMOTION]".strip()
        user.save()
        messages.info(request, "Your request has been sent to the Chief Editor.")

    return redirect('dashboard')

from .forms import UserProfileForm # You will create this below

@login_required
def profile_view(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Your profile has been updated!")
            return redirect('dashboard')
    else:
        form = UserProfileForm(instance=request.user)
    return render(request, 'users/profile.html', {'form': form})

def landing_page(request):
    if request.user.is_authenticated:
        return redirect('dashboard') # Redirect logged-in users to their workspace
    return render(request, 'landing.html')