# submissions/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('new/', views.submit_manuscript, name='submit_paper'),
    path('assign/<int:manuscript_id>/', views.assign_reviewer, name='assign_reviewer'),
    path('review/<int:review_id>/', views.submit_review, name='submit_review'),
    path('decision/<int:manuscript_id>/', views.editorial_decision, name='editorial_decision'),
]