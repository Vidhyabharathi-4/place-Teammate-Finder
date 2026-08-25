from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.core.config import SECRET_KEY, ALGORITHM

print(">>> auth_dependency.py LOADED")

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    print("\n==============================")
    print("AUTHENTICATION STARTED")
    print("==============================")

    print("Received Token:")
    print(token)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("\nDecoded Payload:")
        print(payload)

        email = payload.get("sub")

        print("\nEmail From Token:")
        print(email)

        if email is None:
            print("\nERROR: 'sub' claim not found in JWT.")
            raise credentials_exception

    except JWTError as e:

        print("\nJWT Decode Error:")
        print(e)

        raise credentials_exception

    user = db.query(User).filter(
        User.college_email == email
    ).first()

    print("\nUser Found In Database:")
    print(user)

    if user is None:
        print("\nERROR: User not found in database.")
        raise credentials_exception

    print("\nAuthentication Successful")
    print("==============================\n")

    return user