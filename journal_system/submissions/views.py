from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from django.http import HttpResponse
import csv

from .models import Manuscript, Review
from .forms import ManuscriptSubmissionForm, ReviewForm
from users.models import CustomUser
from .utils import notify_user 

# --- AUTHOR ACTIONS ---

@login_required
def submit_manuscript(request):
    if request.method == 'POST':
        form = ManuscriptSubmissionForm(request.POST, request.FILES)
        if form.is_valid():
            manuscript = form.save(commit=False)
            manuscript.author = request.user
            manuscript.save()
            messages.success(request, "Manuscript submitted successfully!")
            return redirect('dashboard')
    else:
        form = ManuscriptSubmissionForm()
    return render(request, 'submissions/submit.html', {'form': form})

@login_required
def upload_revision(request, manuscript_id):
    manuscript = get_object_or_404(Manuscript, id=manuscript_id, author=request.user)
    if manuscript.status != 'REVISION_REQ':
        return redirect('dashboard')

    if request.method == 'POST':
        form = ManuscriptSubmissionForm(request.POST, request.FILES, instance=manuscript)
        if form.is_valid():
            revision = form.save(commit=False)
            revision.version += 1
            revision.status = 'SUBMITTED' 
            revision.save()
            messages.success(request, f"Version {revision.version} uploaded successfully.")
            return redirect('dashboard')
    else:
        form = ManuscriptSubmissionForm(instance=manuscript)
    return render(request, 'submissions/upload_revision.html', {'form': form, 'manuscript': manuscript})

@login_required
def message_reviewers(request, manuscript_id):
    """Allows authors to send a direct inquiry to assigned reviewers regarding delays."""
    manuscript = get_object_or_404(Manuscript, id=manuscript_id, author=request.user)
    message_content = request.POST.get('message')

    if not message_content:
        messages.error(request, "Message cannot be empty.")
        return redirect('dashboard')

    reviews = manuscript.reviews.all()
    if reviews.exists():
        for r in reviews:
            subject = f"Inquiry regarding Manuscript: {manuscript.title}"
            body = f"The author has sent an inquiry regarding the status of their paper:\n\n\"{message_content}\"\n\nPlease update the status as soon as possible."
            notify_user(subject, body, [r.reviewer.email])
        
        messages.success(request, "Your message has been forwarded to the reviewers.")
    else:
        messages.error(request, "No reviewers have been assigned to this paper yet.")
    
    return redirect('dashboard')


# --- EDITOR & SUPERADMIN ACTIONS ---

@login_required
def assign_reviewer(request, manuscript_id):
    # Unified Power: Superusers act as Editors
    if not (request.user.is_superuser or request.user.role == 'EDITOR'):
        return redirect('dashboard')

    manuscript = get_object_or_404(Manuscript, id=manuscript_id)
    reviewers = CustomUser.objects.filter(role='REVIEWER')

    if request.method == 'POST':
        reviewer_id = request.POST.get('reviewer')
        reviewer = get_object_or_404(CustomUser, id=reviewer_id)
        
        # Prevent assigning the same reviewer twice
        if not Review.objects.filter(manuscript=manuscript, reviewer=reviewer).exists():
            Review.objects.create(manuscript=manuscript, reviewer=reviewer)
            manuscript.status = 'UNDER_REVIEW'
            manuscript.save()
            messages.success(request, f"Assigned {reviewer.username} as a reviewer.")
        else:
            messages.warning(request, "This reviewer is already assigned.")
        
        return redirect('dashboard')

    return render(request, 'submissions/assign_reviewer.html', {
        'manuscript': manuscript,
        'reviewers': reviewers
    })

@login_required
def editorial_decision(request, manuscript_id):
    if not (request.user.is_superuser or request.user.role == 'EDITOR'):
        return redirect('dashboard')

    manuscript = get_object_or_404(Manuscript, id=manuscript_id)
    reviews = manuscript.reviews.filter(status='COMPLETED')

    # Security: Ensure 2 reviews are marked 'OK' (Accept or Revise) before decision
    is_ready = manuscript.is_ready_for_decision()

    if request.method == 'POST':
        if not is_ready and request.POST.get('decision') == 'ACCEPTED':
            messages.error(request, "Cannot accept a manuscript without at least 2 positive reviews.")
        else:
            decision = request.POST.get('decision')
            manuscript.status = decision
            manuscript.save()

            # Notify Author
            subject = f"Editorial Decision: {manuscript.title}"
            message = f"Hello {manuscript.author.username},\n\nA decision has been made: {manuscript.get_status_display()}."
            notify_user(subject, message, [manuscript.author.email])
            
            messages.success(request, "Decision recorded and author notified.")
            return redirect('dashboard')

    return render(request, 'submissions/editorial_decision.html', {
        'manuscript': manuscript, 
        'reviews': reviews,
        'is_ready': is_ready
    })


# --- REVIEWER ACTIONS ---

@login_required
def submit_review(request, review_id):
    review = get_object_or_404(Review, id=review_id, reviewer=request.user)
    
    if request.method == 'POST':
        form = ReviewForm(request.POST, instance=review)
        if form.is_valid():
            review = form.save(commit=False)
            review.status = 'COMPLETED'
            review.date_submitted = timezone.now()
            review.save()
            messages.success(request, "Review submitted. Thank you!")
            return redirect('dashboard')
    else:
        form = ReviewForm(instance=review)
    
    return render(request, 'submissions/submit_review.html', {'form': form, 'manuscript': review.manuscript})


# --- DATA EXPORT ---

@login_required
def export_submissions_csv(request):
    if not (request.user.is_superuser or request.user.role == 'EDITOR'):
        return HttpResponse("Unauthorized", status=401)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="manuscripts_report.csv"'

    writer = csv.writer(response)
    writer.writerow(['Title', 'Author', 'Status', 'Date Submitted', 'Version', 'Positive Reviews'])

    manuscripts = Manuscript.objects.all()
    for m in manuscripts:
        writer.writerow([
            m.title, 
            m.author.username, 
            m.get_status_display(), 
            m.submission_date.strftime("%Y-%m-%d"), 
            m.version,
            m.get_positive_review_count()
        ])

    return response