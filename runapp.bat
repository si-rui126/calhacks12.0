@echo off
call .venv\Scripts\activate.bat
start cmd /k "python main.py"
start cmd /k "npm run dev"