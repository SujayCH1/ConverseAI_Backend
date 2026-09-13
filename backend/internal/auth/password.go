package auth

import (
	cryptorand "crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"strings"

	"golang.org/x/crypto/argon2"
)

type PasswordHasher struct {
	memory      uint32
	iterations  uint32
	parallelism uint8
	saltLength  uint32
	keyLength   uint32
}

func NewPasswordHasher() *PasswordHasher {
	return &PasswordHasher{
		memory:      19 * 1024,
		iterations:  2,
		parallelism: 1,
		saltLength:  16,
		keyLength:   32,
	}
}

func (h *PasswordHasher) Hash(password string) (string, error) {
	salt := make([]byte, h.saltLength)

	_, err := cryptorand.Read(salt)
	if err != nil {
		return "", fmt.Errorf("generate password salt: %w", err)
	}

	key := argon2.IDKey(
		[]byte(password),
		salt,
		h.iterations,
		h.memory,
		h.parallelism,
		h.keyLength,
	)

	encodedSalt := base64.RawStdEncoding.EncodeToString(salt)
	encodedKey := base64.RawStdEncoding.EncodeToString(key)

	encodedHash := fmt.Sprintf(
		"$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version,
		h.memory,
		h.iterations,
		h.parallelism,
		encodedSalt,
		encodedKey,
	)

	return encodedHash, nil
}

func (h *PasswordHasher) Verify(password, encodedHash string) (bool, error) {
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 {
		return false, fmt.Errorf("invalid encoded password hash format")
	}

	if parts[1] != "argon2id" {
		return false, fmt.Errorf("unsupported password hash algorithm %q", parts[1])
	}

	var version int
	if _, err := fmt.Sscanf(parts[2], "v=%d", &version); err != nil {
		return false, fmt.Errorf("parse Argon2 version: %w", err)
	}
	if version != argon2.Version {
		return false, fmt.Errorf("unsupported Argon2 version %d", version)
	}

	var memory uint32
	var iterations uint32
	var parallelism uint8
	if _, err := fmt.Sscanf(
		parts[3],
		"m=%d,t=%d,p=%d",
		&memory,
		&iterations,
		&parallelism,
	); err != nil {
		return false, fmt.Errorf("parse Argon2 parameters: %w", err)
	}
	if memory == 0 || iterations == 0 || parallelism == 0 {
		return false, fmt.Errorf("invalid Argon2 parameters")
	}

	salt, err := base64.RawStdEncoding.Strict().DecodeString(parts[4])
	if err != nil {
		return false, fmt.Errorf("decode password salt: %w", err)
	}
	if len(salt) == 0 {
		return false, fmt.Errorf("password salt is empty")
	}

	expectedKey, err := base64.RawStdEncoding.Strict().DecodeString(parts[5])
	if err != nil {
		return false, fmt.Errorf("decode password hash: %w", err)
	}
	if len(expectedKey) == 0 {
		return false, fmt.Errorf("password hash is empty")
	}

	calculatedKey := argon2.IDKey(
		[]byte(password),
		salt,
		iterations,
		memory,
		parallelism,
		uint32(len(expectedKey)),
	)

	return subtle.ConstantTimeCompare(calculatedKey, expectedKey) == 1, nil
}
