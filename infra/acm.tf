resource "aws_route53_zone" "clean_mile_zone" {
    name = var.domain_name

    tags = merge(
        var.common_tags,
        {
            "Name" = "clean-mile-zone"
        }
    )
}

resource "aws_acm_certificate" "clean_mile_certificate" {
    domain_name       = var.domain_name
    validation_method = "DNS"

    lifecycle {
        create_before_destroy = true
    }

    tags = merge(
        var.common_tags,
        {
            "Name" = "clean-mile-certificate"
        }
    )
}

resource "aws_route53_record" "clean_mile_certificate_validation" {
    name    = tolist(aws_acm_certificate.clean_mile_certificate.domain_validation_options)[0].resource_record_name
    type    = tolist(aws_acm_certificate.clean_mile_certificate.domain_validation_options)[0].resource_record_type
    zone_id = aws_route53_zone.clean_mile_zone.zone_id
    records = [
        tolist(aws_acm_certificate.clean_mile_certificate.domain_validation_options)[0].resource_record_value
    ]
    ttl = 60
}

resource "aws_acm_certificate_validation" "clean_mile_certificate_validation" {
    certificate_arn         = aws_acm_certificate.clean_mile_certificate.arn
    validation_record_fqdns = [
        aws_route53_record.clean_mile_certificate_validation.fqdn
    ]
}