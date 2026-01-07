from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import ManuscriptSubmissionForm
from django.shortcuts import get_object_or_404
from users.models import CustomUser
from .models import Manuscript, Review
from django.utils import timezone
from .forms import ReviewForm
from .utils import notify_user # Import our helper

@login_required
def submit_manuscript(request):
    if request.method == 'POST':
        form = ManuscriptSubmissionForm(request.POST, request.FILES)
        if form.is_valid():
            manuscript = form.save(commit=False)
            manuscript.author = request.user
            manuscript.save()
            return redirect('dashboard')
    else:
        form = ManuscriptSubmissionForm()
    return render(request, 'submissions/submit.html', {'form': form})



@login_required
def assign_reviewer(request, manuscript_id):
    # Only Editors can access this
    if request.user.role != 'EDITOR':
        return redirect('dashboard')

    manuscript = get_object_or_404(Manuscript, id=manuscript_id)
    reviewers = CustomUser.objects.filter(role='REVIEWER')

    if request.method == 'POST':
        reviewer_id = request.POST.get('reviewer')
        reviewer = get_object_or_404(CustomUser, id=reviewer_id)
        
        # Create the assignment
        Review.objects.create(manuscript=manuscript, reviewer=reviewer)
        
        # Update manuscript status
        manuscript.status = 'UNDER_REVIEW'
        manuscript.save()
        
        return redirect('dashboard')

    return render(request, 'submissions/assign_reviewer.html', {
        'manuscript': manuscript,
        'reviewers': reviewers
    })




@login_required
def submit_review(request, review_id):
    review = get_object_or_404(Review, id=review_id, reviewer=request.user)
    
    if request.method == 'POST':
        form = ReviewForm(request.POST, instance=review)
        if form.as_p:
            review = form.save(commit=False)
            review.status = 'COMPLETED'
            review.date_submitted = timezone.now()
            review.save()
            
            # Check if all reviews for this paper are done
            # (Optional: Notify Editor)
            return redirect('dashboard')
    else:
        form = ReviewForm(instance=review)
    
    return render(request, 'submissions/submit_review.html', {
        'form': form,
        'manuscript': review.manuscript
    })


# submissions/views.py



@login_required
def editorial_decision(request, manuscript_id):
    if request.user.role != 'EDITOR':
        return redirect('dashboard')

    manuscript = get_object_or_404(Manuscript, id=manuscript_id)
    reviews = manuscript.reviews.filter(status='COMPLETED')

    if request.method == 'POST':
        decision = request.POST.get('decision')
        manuscript.status = decision
        manuscript.save()

        # Send Email to Author
        subject = f"Editorial Decision: {manuscript.title}"
        message = f"Hello {manuscript.author.username},\n\nAn editorial decision has been made regarding your submission: {manuscript.title}.\n\nNew Status: {manuscript.get_status_display()}\n\nPlease log in to the portal for more details."
        
        notify_user(subject, message, [manuscript.author.email])

        return redirect('dashboard')

    return render(request, 'submissions/editorial_decision.html', {'manuscript': manuscript, 'reviews': reviews})