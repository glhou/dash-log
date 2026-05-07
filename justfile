default:
  just -l

fastapi:
  uv run fastapi dev --port 8000


alembic-upgrade:
  uv run alembic upgrade head

alembic-migration message:
  uv run alembic revision --autogenerate -m {{message}}

vite:
  cd frontend && npm run dev

fixtures:
  uv run scripts/load_fixtures.py

prod:
  just build
  uv run fastapi run

build:
  cd frontend && npm run build

install:
  uv sync
  cd frontend && npm install
