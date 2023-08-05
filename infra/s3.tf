resource "aws_s3_bucket" "s3_bucket" {
  bucket        = var.s3_bucket_name
  force_destroy = true
  tags          = var.common_tags
}

resource "aws_s3_bucket_public_access_block" "s3_bucket_public_access_block" {
  bucket = aws_s3_bucket.s3_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "s3_bucket_domain_name" {
  value = aws_s3_bucket.s3_bucket.bucket_domain_name
}

output "s3_bucket_regional_domain_name" {
  value = aws_s3_bucket.s3_bucket.bucket_regional_domain_name
}