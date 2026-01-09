# config/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users.views import register_view, dashboard_view # Import these directly for convenience
from users.views import manage_users
from users import views as users_views  # Add this line
from submissions import views as submissions_views  # Add this line
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', users_views.landing_page, name='landing'), # The Root Page
    path('admin/', admin.site.urls),
    # Auth urls for login/logout
    path('accounts/', include('django.contrib.auth.urls')), 
    
    # Registration & Dashboard
    path('register/', register_view, name='register'),
    path('dashboard/', dashboard_view, name='dashboard'),
    
    # Manuscript Submission paths
    path('submissions/', include('submissions.urls')),
# ... inside urlpatterns ...
path('manage-users/', manage_users, name='manage_users'),
path('request-promotion/', users_views.request_promotion, name='request_promotion'),
path('message-reviewers/<int:manuscript_id>/', submissions_views.message_reviewers, name='message_reviewers'),
path('password-change/', auth_views.PasswordChangeView.as_view(template_name='registration/password_change_form.html'), name='password_change'),
    path('password-change/done/', auth_views.PasswordChangeDoneView.as_view(template_name='registration/password_change_done.html'), name='password_change_done'),
    path('profile/', users_views.profile_view, name='profile'), # Add this
]

# Allow Django to serve uploaded manuscripts in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)