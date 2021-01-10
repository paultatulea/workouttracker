from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from contextlib import contextmanager

__engine = create_engine('sqlite:///workouttracker.db', echo=False)

Session = sessionmaker(bind=__engine)


@contextmanager
def session_scope(session=None):
    """Provide a transactional scope around a series of operations."""
    session = session or Session()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()
