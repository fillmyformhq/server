CREATE TABLE users(
    id VARCHAR NOT NULL UNIQUE PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    tier_expires_at TIMESTAMPTZ DEFAULT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE apps(
    id VARCHAR NOT NULL UNIQUE PRIMARY KEY,
    name TEXT NOT NULL,
    created_by VARCHAR NOT NULL REFERENCES users(id),
    description TEXT NOT NULL,
    website TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments(
    id VARCHAR UNIQUE NOT NULL PRIMARY KEY,
    response TEXT NOT NULL,
    is_payment_successful BOOLEAN NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_plans(
    id VARCHAR NOT NULL UNIQUE PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    tier_id VARCHAR NOT NULL,
    payment_id VARCHAR REFERENCES payments(id) DEFAULT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE responses(
    id VARCHAR NOT NULL UNIQUE PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    response TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address VARCHAR NOT NULL
);