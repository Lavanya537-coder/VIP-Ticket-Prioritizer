from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from app.database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    employee_name = Column(String)
    email = Column(String)
    department = Column(String)
    issue_title = Column(String)
    issue_description = Column(Text)

    priority = Column(String, default="LOW")
    status = Column(String, default="OPEN")

    category = Column(String)
    ai_summary = Column(Text)
    suggested_resolution = Column(Text)