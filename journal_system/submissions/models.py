# submissions/models.py
from django.db import models
from django.conf import settings # To reference the User model

class Manuscript(models.Model):
    # Status Choices
    SUBMITTED = 'SUBMITTED'
    UNDER_REVIEW = 'UNDER_REVIEW'
    DECISION_READY = 'DECISION_READY'
    ACCEPTED = 'ACCEPTED'
    REJECTED = 'REJECTED'
    REVISION_REQ = 'REVISION_REQ'

    STATUS_CHOICES = [
        (SUBMITTED, 'Submitted'),
        (UNDER_REVIEW, 'Under Review'),
        (DECISION_READY, 'Decision Ready'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
        (REVISION_REQ, 'Revision Required'),
    ]

    title = models.CharField(max_length=255)
    abstract = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='manuscripts')
    
    # File Upload (Requires media configuration)
    file = models.FileField(upload_to='manuscripts/')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=SUBMITTED)
    submission_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Assigned Editor (Optional until assigned)
    editor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_manuscripts', limit_choices_to={'role': 'EDITOR'})

    def __str__(self):
        return f"{self.title} ({self.status})"





# submissions/models.py

class Review(models.Model):
    # Status of the individual review
    PENDING = 'PENDING'
    COMPLETED = 'COMPLETED'
    
    manuscript = models.ForeignKey(Manuscript, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role': 'REVIEWER'})
    
    # Reviewer's feedback
    comments = models.TextField(blank=True, null=True)
    score = models.IntegerField(choices=[(i, i) for i in range(1, 6)], blank=True, null=True) # 1-5 scale
    recommendation = models.CharField(max_length=20, choices=[('ACCEPT', 'Accept'), ('REJECT', 'Reject'), ('REVISE', 'Revise')], blank=True, null=True)
    
    date_assigned = models.DateTimeField(auto_now_add=True)
    date_submitted = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, default=PENDING)

    def __str__(self):
        return f"Review for {self.manuscript.title} by {self.reviewer.username}"