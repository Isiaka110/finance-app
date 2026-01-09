from django.db import models
from django.conf import settings
from django.utils import timezone

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

    # Core Fields
    title = models.CharField(max_length=255)
    abstract = models.TextField()
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='manuscripts'
    )
    
    # File & Versioning
    file = models.FileField(upload_to='manuscripts/')
    version = models.IntegerField(default=1)
    
    # Status & Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=SUBMITTED)
    submission_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Assignments
    editor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='assigned_manuscripts', 
        limit_choices_to={'role': 'EDITOR'}
    )

    class Meta:
        ordering = ['-submission_date']

    def __str__(self):
        return f"{self.title} - v{self.version} ({self.status})"

    # --- LOGIC FOR THE "2 OK" RULE ---
    def is_ready_for_decision(self):
        """
        Returns True if at least 2 reviewers have marked the paper 
        as 'ACCEPT' or 'REVISE'.
        """
        positive_recommendations = ['ACCEPT', 'REVISE']
        ok_count = self.reviews.filter(
            status='COMPLETED', 
            recommendation__in=positive_recommendations
        ).count()
        return ok_count >= 2

    def get_positive_review_count(self):
        """Helper for the template badge"""
        return self.reviews.filter(
            status='COMPLETED', 
            recommendation__in=['ACCEPT', 'REVISE']
        ).count()


class Review(models.Model):
    PENDING = 'PENDING'
    COMPLETED = 'COMPLETED'
    
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (COMPLETED, 'Completed'),
    ]
    
    manuscript = models.ForeignKey(Manuscript, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 'REVIEWER'}
    )
    
    # Reviewer's feedback
    comments = models.TextField(blank=True, null=True)
    score = models.IntegerField(choices=[(i, i) for i in range(1, 6)], blank=True, null=True)
    recommendation = models.CharField(
        max_length=20, 
        choices=[('ACCEPT', 'Accept'), ('REJECT', 'Reject'), ('REVISE', 'Revise')], 
        blank=True, 
        null=True
    )
    
    date_assigned = models.DateTimeField(auto_now_add=True)
    date_submitted = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)

    def save(self, *args, **kwargs):
        # Automatically set date_submitted when status changes to COMPLETED
        if self.status == self.COMPLETED and not self.date_submitted:
            self.date_submitted = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Review for {self.manuscript.title} by {self.reviewer.username}"