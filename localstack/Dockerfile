FROM localstack/localstack

COPY ./localstack/init/ready.d/create_buckets.sh /etc/localstack/init/ready.d/create_buckets.sh
RUN chmod +x /etc/localstack/init/ready.d/create_buckets.sh
