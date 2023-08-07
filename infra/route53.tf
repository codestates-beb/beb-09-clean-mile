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
