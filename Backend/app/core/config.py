from dotenv import load_dotenv
import os
import re

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    DATABASE_URL = DATABASE_URL.strip("\"' ")

    # 1. Ensure pymysql driver
    if DATABASE_URL.startswith("mysql+mysqldb://"):
        DATABASE_URL = DATABASE_URL.replace("mysql+mysqldb://", "mysql+pymysql://", 1)
    elif DATABASE_URL.startswith("mysql://"):
        DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

    # 2. Strip angle brackets around password if present (e.g. :<password>@)
    DATABASE_URL = re.sub(r":<([^>]+)>@", r":\1@", DATABASE_URL)

    # 3. Change /sys database to /test (since sys is read-only)
    DATABASE_URL = re.sub(r":4000/sys(\?|$)", r":4000/test\1", DATABASE_URL)

    # 4. Strip unsupported ssl_ca and ssl_mode parameters
    DATABASE_URL = re.sub(r"[?&]ssl_ca=[^&]*", "", DATABASE_URL)
    DATABASE_URL = re.sub(r"[?&]ssl_mode=[^&]*", "", DATABASE_URL)

    # 5. Ensure ssl_verify_cert=true for TiDB Cloud
    if "tidbcloud.com" in DATABASE_URL and "ssl_verify_cert" not in DATABASE_URL:
        delim = "&" if "?" in DATABASE_URL else "?"
        DATABASE_URL = f"{DATABASE_URL}{delim}ssl_verify_cert=true"

    DATABASE_URL = DATABASE_URL.rstrip("?&")

SECRET_KEY = os.getenv("SECRET_KEY", "1049a10fa59f31b2170e2e5bf15ead3b1405473c1d2f92fdd7737eca31b5beb9")

ALGORITHM = os.getenv("ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 10080)
)