docker run -p 8000:8000 -e DATABASE_URI=postgresql://admin:admin123@host.docker.internal:5434/todo_app_db crystaldba/postgres-mcp --access-mode=unrestricted --transport=sse



#local installation
pipx install postgres-mcp
postgres-mcp "postgresql://admin:admin123@localhost:5434/todo_app_db" --access-mode=unrestricted --transport=sse