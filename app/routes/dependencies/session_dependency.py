from fastapi import Depends

from app.core.engine import get_session

SessionDep = Depends(get_session)
