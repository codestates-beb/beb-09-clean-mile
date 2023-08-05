module "ecr" {
  source = "./modules/ecr"

  for_each = var.ecr_repos

  name                 = each.value.name
  environment          = each.value.environment
  image_tag_mutability = each.value.image_tag_mutability
  scan_on_push         = each.value.scan_on_push
  common_tags          = var.common_tags
}

output "ecr_repo_names" {
  value = {
    for k, v in module.ecr : k => v.ecr_repo_name
  }
}

output "ecr_repo_arns" {
  value = {
    for k, v in module.ecr : k => v.ecr_repo_arn
  }
}

output "ecr_repo_registry_ids" {
  value = {
    for k, v in module.ecr : k => v.ecr_repo_registry_id
  }
}

output "ecr_repo_repository_url" {
  value = {
    for k, v in module.ecr : k => v.ecr_repo_repository_url
  }
}

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

resource "aws_cloudfront_origin_access_identity" "s3_bucket_origin_access_identity" {
  comment = "Access identity for S3 bucket"
}

resource "aws_cloudfront_distribution" "cloudfront_distribution" {
  origin {
    domain_name = aws_s3_bucket.s3_bucket.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.s3_bucket.id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.s3_bucket_origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = aws_s3_bucket.s3_bucket.id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = var.common_tags
}

resource "aws_s3_bucket_policy" "allow_cloudfront_access_to_s3_bucket" {
  bucket = aws_s3_bucket.s3_bucket.id
  policy = data.aws_iam_policy_document.allow_cloudfront_access_to_s3_bucket.json
}

data "aws_iam_policy_document" "allow_cloudfront_access_to_s3_bucket" {
  statement {
    actions = ["s3:GetObject"]
    resources = [
      aws_s3_bucket.s3_bucket.arn,
      "${aws_s3_bucket.s3_bucket.arn}/*",
    ]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.s3_bucket_origin_access_identity.iam_arn]
    }
  }
}

output "cloudfront_distribution_domain_name" {
  value = aws_cloudfront_distribution.cloudfront_distribution.domain_name
}

resource "tls_private_key" "private_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "private_key_pem" {
  content         = tls_private_key.private_key.private_key_openssh
  filename        = "private_key.pem"
  file_permission = "0400"
}

resource "aws_key_pair" "key_pair" {
  key_name   = var.key_pair_name
  public_key = tls_private_key.private_key.public_key_openssh

  tags = var.common_tags
}
