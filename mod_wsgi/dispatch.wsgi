import sys
sys.stdout = sys.stderr

# Add the virtual Python environment site-packages directory to the path
import site
site.addsitedir('/home/ubuntu/.virtualenvs/whiteboard/lib/python2.7/site-packages')


# Avoid ``[Errno 13] Permission denied: '/var/www/.python-eggs'`` messages
import os
os.environ['PYTHON_EGG_CACHE'] = '/home/ubuntu/projects/whiteboard/mod_wsgi/egg-cache'

#If your project is not on your PYTHONPATH by default you can add the following
projects_path = '/home/ubuntu/projects'
if projects_path not in sys.path:
    sys.path.append(projects_path)

whiteboard_path = '/home/ubuntu/projects/whiteboard'
if whiteboard_path not in sys.path:
    sys.path.append(whiteboard_path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'


import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
