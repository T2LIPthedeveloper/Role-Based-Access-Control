from django.urls import path
from .views import file_list, check_access, upload_file

urlpatterns = [
    path('files/', file_list, name='file-list'),
    path('files/<int:file_id>/access/', check_access, name='check-access'),
    path('upload/', upload_file, name='upload-file'),
]