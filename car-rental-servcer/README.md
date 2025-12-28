# car-rental-servcer

## Client connection

To connect a frontend (car-rental-client) to this server:

- **Server env**: set `CLIENT_ORIGIN` to the client URL (e.g. `http://localhost:3000`) or leave unset to allow all origins.
- **Client env**: configure your client to use the server API base URL, e.g. set `REACT_APP_API_URL=http://localhost:3000` for development.

Example client requests:

```bash
# Get all cars
curl http://localhost:3000/api/cars

# Authenticate requests (replace <TOKEN> with your JWT)
curl -H "Authorization: <TOKEN>" http://localhost:3000/api/user/profile
```

Notes:
- The server accepts JWTs in the `Authorization` header.
- If your client uses cookies, set `CLIENT_ORIGIN` and enable credentials accordingly.
