package storage

import (
    "context"
    "fmt"

    "github.com/minio/minio-go/v7"
    "github.com/minio/minio-go/v7/pkg/credentials"
)

type MinioClient struct{
    Client *minio.Client
    Bucket string
}

func New(endpoint, accessKey, secretKey string, useSSL bool, bucket string) (*MinioClient, error) {
    mc, err := minio.New(endpoint, &minio.Options{
        Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
        Secure: useSSL,
    })
    if err != nil {
        return nil, err
    }
    ctx := context.Background()
    exists, err := mc.BucketExists(ctx, bucket)
    if err != nil {
        return nil, err
    }
    if !exists {
        err = mc.MakeBucket(ctx, bucket, minio.MakeBucketOptions{})
        if err != nil {
            return nil, fmt.Errorf("create bucket: %w", err)
        }
    }
    return &MinioClient{Client: mc, Bucket: bucket}, nil
}
