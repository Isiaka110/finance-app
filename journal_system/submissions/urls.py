# submissions/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('new/', views.submit_manuscript, name='submit_paper'),
    path('assign/<int:manuscript_id>/', views.assign_reviewer, name='assign_reviewer'),
    path('review/<int:review_id>/', views.submit_review, name='submit_review'),
    path('decision/<int:manuscript_id>/', views.editorial_decision, name='editorial_decision'),
    path('revision/<int:manuscript_id>/', views.upload_revision, name='upload_revision'),
    path('export/csv/', views.export_submissions_csv, name='export_csv'),
]