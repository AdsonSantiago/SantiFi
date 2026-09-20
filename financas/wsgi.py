import os
import sys
from pathlib import Path

# Caminho absoluto para a raiz do projeto
BASE_DIR = Path(__file__).resolve().parent.parent

# Adiciona a raiz ao PYTHONPATH (ISSO RESOLVE 90% DOS PROBLEMAS)
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'financas.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()