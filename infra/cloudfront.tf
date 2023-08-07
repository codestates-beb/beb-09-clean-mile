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
