import os
from dotenv import load_dotenv

# Load environment variables from .env file
dotenv_path = os.path.join((os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'keys.env')
load_dotenv(dotenv_path)
print(dotenv_path)
OPENAI_KEY = os.environ["openaikey"]
