BEGIN;

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_provider_id text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE,
    display_name text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE businesses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    timezone text NOT NULL DEFAULT 'UTC',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- A business can connect multiple Instagram accounts.
CREATE TABLE instagram_accounts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    instagram_user_id text NOT NULL UNIQUE,
    username text NOT NULL,
    access_token_encrypted text NOT NULL,
    token_expires_at timestamptz,
    connected_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX instagram_accounts_business_idx
    ON instagram_accounts (business_id);

CREATE TABLE webhook_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    instagram_account_id uuid NOT NULL REFERENCES instagram_accounts(id) ON DELETE CASCADE,
    external_event_id text NOT NULL,
    event_type text NOT NULL,
    payload jsonb NOT NULL,
    status text NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'processed', 'failed')),
    attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    last_error text,
    received_at timestamptz NOT NULL DEFAULT now(),
    processed_at timestamptz,
    UNIQUE (instagram_account_id, external_event_id)
);

CREATE INDEX webhook_events_processing_idx
    ON webhook_events (status, received_at);

CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    sku text NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(12, 2) NOT NULL CHECK (price >= 0),
    currency char(3) NOT NULL DEFAULT 'USD',
    inventory_tracking text NOT NULL DEFAULT 'none'
        CHECK (inventory_tracking IN ('none', 'manual', 'integration')),
    stock_quantity integer CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
    attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (business_id, sku),
    CHECK (
        (inventory_tracking = 'none' AND stock_quantity IS NULL)
        OR
        (inventory_tracking IN ('manual', 'integration') AND stock_quantity IS NOT NULL)
    )
);

CREATE INDEX products_business_active_idx
    ON products (business_id, active);

CREATE TABLE knowledge_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    title text NOT NULL,
    source_type text NOT NULL,
    source_uri text,
    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX knowledge_documents_business_idx
    ON knowledge_documents (business_id);

-- A chunk belongs to either an uploaded document or a product, never both.
CREATE TABLE knowledge_chunks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id uuid REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    chunk_index integer NOT NULL CHECK (chunk_index >= 0),
    content text NOT NULL,
    embedding vector,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (num_nonnulls(document_id, product_id) = 1)
);

CREATE UNIQUE INDEX knowledge_chunks_document_position_idx
    ON knowledge_chunks (document_id, chunk_index)
    WHERE document_id IS NOT NULL;

CREATE UNIQUE INDEX knowledge_chunks_product_position_idx
    ON knowledge_chunks (product_id, chunk_index)
    WHERE product_id IS NOT NULL;

CREATE TABLE chatbot_configurations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
    enabled boolean NOT NULL DEFAULT false,
    assistant_name text NOT NULL DEFAULT 'Assistant',
    tone text NOT NULL DEFAULT 'friendly'
        CHECK (tone IN ('friendly', 'professional', 'casual')),
    language text NOT NULL DEFAULT 'en',
    greeting text,
    business_description text,
    handoff_instructions text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    instagram_user_id text NOT NULL,
    username text,
    display_name text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (business_id, instagram_user_id)
);

CREATE TABLE conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    instagram_account_id uuid NOT NULL REFERENCES instagram_accounts(id) ON DELETE CASCADE,
    contact_id uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    external_thread_id text,
    status text NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'handed_off', 'closed')),
    last_message_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (instagram_account_id, external_thread_id)
);

CREATE INDEX conversations_business_status_idx
    ON conversations (business_id, status, last_message_at DESC);

CREATE INDEX conversations_contact_idx
    ON conversations (contact_id, last_message_at DESC);

CREATE TABLE messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    external_message_id text UNIQUE,
    direction text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    sender_type text NOT NULL CHECK (sender_type IN ('contact', 'ai', 'human', 'system')),
    body text NOT NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    sent_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX messages_conversation_sent_idx
    ON messages (conversation_id, sent_at);

COMMIT;
