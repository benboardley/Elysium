"""
WSGI config for Elysium_Backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'keys.env')
load_dotenv(dotenv_path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Elysium_Backend.settings')

application = get_wsgi_application()
