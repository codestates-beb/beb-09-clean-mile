resource "aws_alb" "main_alb" {
  name                             = "clean-mile-alb"
  internal                         = false
  load_balancer_type               = "application"
  security_groups                  = [aws_security_group.main_public_security_group.id]
  subnets                          = aws_subnet.public_subnets[*].id
  enable_cross_zone_load_balancing = true

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile ALB"
    }
  )
}

resource "aws_alb_target_group" "main_alb_target_group_http" {
  name     = "alb-target-group-http"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main_vpc.id

  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 2
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile ALB Target Group HTTP"
    }
  )
}

resource "aws_alb_target_group" "main_alb_target_group_https" {
  name     = "alb-target-group-https"
  port     = 443
  protocol = "HTTPS"
  vpc_id   = aws_vpc.main_vpc.id

  health_check {
    path                = "/"
    protocol            = "HTTPS"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 2
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile ALB Target Group HTTPS"
    }
  )
}

resource "aws_alb_target_group_attachment" "main_alb_target_group_attachment_http" {
  target_group_arn = aws_alb_target_group.main_alb_target_group_http.arn
  target_id        = module.ec2.ec2_instance_id
  port             = 80
}

resource "aws_alb_target_group_attachment" "main_alb_target_group_attachment_https" {
  target_group_arn = aws_alb_target_group.main_alb_target_group_https.arn
  target_id        = module.ec2.ec2_instance_id
  port             = 443
}

resource "aws_lb_listener" "main_alb_listener_http" {
  load_balancer_arn = aws_alb.main_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.main_alb_target_group_http.arn
  }
}

resource "aws_lb_listener" "main_alb_listener_https" {
  load_balancer_arn = aws_alb.main_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"

  certificate_arn = aws_acm_certificate.clean_mile_certificate.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.main_alb_target_group_https.arn
  }
}
