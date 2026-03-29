#!/bin/bash

echo "Waiting for LocalStack to be ready..."
# Wait for LocalStack to be ready before creating buckets
# This can help if services aren't fully initialized yet
sleep 10

LOCALSTACK_ENDPOINT=http://localstack:4566

echo "Creating S3 buckets..."

# list of buckets to create
BUCKETS=("user-profiles" "vehicle-posts" "documents")

for BUCKET in "${BUCKETS[@]}"; do
    echo "Creating bucket: $BUCKET"
    aws --endpoint-url=$LOCALSTACK_ENDPOINT s3api create-bucket --bucket $BUCKET --region us-east-1
    aws --endpoint-url=$LOCALSTACK_ENDPOINT s3api put-bucket-acl --bucket $BUCKET --acl public-read

    # Add CORS configuration to allow PUT requests from all origins
    echo "Enabling CORS for bucket: $BUCKET"
    aws --endpoint-url=$LOCALSTACK_ENDPOINT s3api put-bucket-cors --bucket $BUCKET --cors-configuration '{
        "CORSRules": [
            {
                "AllowedOrigins": ["*"],
                "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
                "AllowedHeaders": ["*"],
                "ExposeHeaders": ["ETag"],
                "MaxAgeSeconds": 3000
            }
        ]
    }'
done

echo "Verifying S3 buckets..."
aws --endpoint-url=$LOCALSTACK_ENDPOINT s3 ls

echo "S3 buckets created successfully!"
