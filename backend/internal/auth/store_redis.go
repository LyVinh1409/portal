package auth

import (
    "context"
    "fmt"
    "time"

    "github.com/redis/go-redis/v9"
)

type RedisStore struct {
    client *redis.Client
    prefix string
}

func NewRedisStore(addr string) *RedisStore {
    opt := &redis.Options{Addr: addr}
    c := redis.NewClient(opt)
    return &RedisStore{client: c, prefix: "auth_refresh:"}
}

func (r *RedisStore) SaveRefreshToken(ctx context.Context, userID uint, token string, ttl time.Duration) error {
    key := r.prefix + "uid:" + stringUint(userID)
    return r.client.Set(ctx, key, token, ttl).Err()
}

func (r *RedisStore) ValidateRefreshToken(ctx context.Context, userID uint, token string) (bool, error) {
    key := r.prefix + "uid:" + stringUint(userID)
    v, err := r.client.Get(ctx, key).Result()
    if err == redis.Nil { return false, nil }
    if err != nil { return false, err }
    return v == token, nil
}

func (r *RedisStore) DeleteRefreshToken(ctx context.Context, userID uint) error {
    key := r.prefix + "uid:" + stringUint(userID)
    return r.client.Del(ctx, key).Err()
}

func stringUint(u uint) string {
    return fmt.Sprintf("%d", u)
}
