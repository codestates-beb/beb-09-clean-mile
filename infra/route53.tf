// imported from existing zone
resource "aws_route53_zone" "existing_clean_mile_zone" {
  name = var.domain_name

  tags = merge(
    var.common_tags,
    {
      "Name" = "Clean Mile Zone"
    }
  )
}

resource "aws_route53_record" "client_clean_mile_record" {
  zone_id = aws_route53_zone.existing_clean_mile_zone.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_alb.main_alb.dns_name
    zone_id                = aws_alb.main_alb.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "server_clean_mile_record" {
  zone_id = aws_route53_zone.existing_clean_mile_zone.zone_id
  name    = "api.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_alb.main_alb.dns_name
    zone_id                = aws_alb.main_alb.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "admin_clean_mile_record" {
  zone_id = aws_route53_zone.existing_clean_mile_zone.zone_id
  name    = "admin.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_alb.main_alb.dns_name
    zone_id                = aws_alb.main_alb.zone_id
    evaluate_target_health = true
  }
}
