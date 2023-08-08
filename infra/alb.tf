resource "aws_alb" "main_alb" {
  name                             = "clean-mile-alb"
  internal                         = false
  load_balancer_type               = "application"
  security_groups                  = [aws_security_group.alb_security_group.id]
  subnets                          = aws_subnet.public_subnets[*].id
  enable_cross_zone_load_balancing = true

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile ALB"
    }
  )
}

resource "aws_alb_target_group" "main_alb_target_group_client" {
  name     = "alb-target-group-client"
  port     = 3000
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
      Name = "Clean Mile ALB Target Group Client"
    }
  )
}

resource "aws_alb_target_group" "main_alb_target_group_admin" {
  name     = "alb-target-group-admin"
  port     = 3001
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
      Name = "Clean Mile ALB Target Group Client"
    }
  )
}

resource "aws_alb_target_group" "main_alb_target_group_server" {
  name     = "alb-target-group-server"
  port     = 8080
  protocol = "HTTP"
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
      Name = "Clean Mile ALB Target Group Server"
    }
  )
}

resource "aws_alb_target_group_attachment" "main_alb_target_group_attachment_client1" {
  target_group_arn = aws_alb_target_group.main_alb_target_group_client.arn
  target_id        = aws_instance.client_instance1.id
  port             = 3000
}

resource "aws_alb_target_group_attachment" "main_alb_target_group_attachment_server1" {
  target_group_arn = aws_alb_target_group.main_alb_target_group_server.arn
  target_id        = aws_instance.server_instance1.id
  port             = 8080
}

resource "aws_alb_target_group_attachment" "main_alb_target_group_attachment_admin" {
  target_group_arn = aws_alb_target_group.main_alb_target_group_admin.arn
  target_id        = aws_instance.admin_instance.id
  port             = 3001
}


resource "aws_lb_listener" "main_alb_listener_http" {
  load_balancer_arn = aws_alb.main_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile ALB Listener HTTP"
    }
  )
}

resource "aws_lb_listener" "main_alb_listener_https" {
  load_balancer_arn = aws_alb.main_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"

  certificate_arn = aws_acm_certificate.clean_mile_certificate.arn

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
      host        = "www.${var.domain_name}"
    }
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile ALB Listener HTTPS"
    }
  )
}


resource "aws_lb_listener_rule" "main_alb_listener_rule_https_client" {
  listener_arn = aws_lb_listener.main_alb_listener_https.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.main_alb_target_group_client.arn
  }

  condition {
    host_header {
      values = [aws_route53_record.client_clean_mile_record.name]
    }
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile ALB Listener Rule HTTPS Client"
    }
  )
}

resource "aws_lb_listener_rule" "main_alb_listener_rule_https_server" {
  listener_arn = aws_lb_listener.main_alb_listener_https.arn
  priority     = 2

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.main_alb_target_group_server.arn
  }

  condition {
    host_header {
      values = [aws_route53_record.server_clean_mile_record.name]
    }
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile ALB Listener Rule HTTPS Server"
    }
  )
}

resource "aws_lb_listener_rule" "main_alb_listener_rule_https_admin" {
  listener_arn = aws_lb_listener.main_alb_listener_https.arn
  priority     = 3

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.main_alb_target_group_admin.arn
  }

  condition {
    host_header {
      values = [aws_route53_record.admin_clean_mile_record.name]
    }
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile ALB Listener Rule HTTPS Admin"
    }
  )
}
