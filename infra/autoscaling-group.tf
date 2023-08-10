resource "aws_autoscaling_group" "client_asg" {
  vpc_zone_identifier = [aws_subnet.public_subnets[0].id, aws_subnet.public_subnets[2].id]
  desired_capacity    = 2
  max_size            = 4
  min_size            = 1
  force_delete        = true

  launch_template {
    id      = aws_launch_template.client_template.id
    version = "$Latest"
  }

  health_check_type = "ELB"
  target_group_arns = [aws_alb_target_group.main_alb_target_group_client.arn]

  tag {
    key                 = "Name"
    value               = "Client ASG"
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_group" "server_asg" {
  vpc_zone_identifier = [aws_subnet.private_subnets[0].id, aws_subnet.private_subnets[2].id]
  desired_capacity    = 2
  max_size            = 4
  min_size            = 1
  force_delete        = true

  launch_template {
    id      = aws_launch_template.server_template.id
    version = "$Latest"
  }

  health_check_type = "ELB"
  target_group_arns = [aws_alb_target_group.main_alb_target_group_server.arn]

  tag {
    key                 = "Name"
    value               = "Server ASG"
    propagate_at_launch = true
  }
}

