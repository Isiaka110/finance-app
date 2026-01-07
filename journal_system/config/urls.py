# config/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users.views import register_view, dashboard_view # Import these directly for convenience

urlpatterns = [
    path('admin/', admin.site.urls),
    # Auth urls for login/logout
    path('accounts/', include('django.contrib.auth.urls')), 
    
    # Registration & Dashboard
    path('register/', register_view, name='register'),
    path('dashboard/', dashboard_view, name='dashboard'),
    
    # Manuscript Submission paths
    path('submissions/', include('submissions.urls')),
]

# Allow Django to serve uploaded manuscripts in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)