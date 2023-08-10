resource "aws_autoscaling_group" "client_asg" {
  availability_zones = slice(var.availability_zones, 0, 2)
  desired_capacity   = 2
  max_size           = 4
  min_size           = 1
  force_delete       = true

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
  availability_zones = slice(var.availability_zones, 0, 2)
  desired_capacity   = 2
  max_size           = 4
  min_size           = 1
  force_delete       = true

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

resource "aws_autoscaling_group" "admin_asg" {
  availability_zones = [var.availability_zones[2]]
  desired_capacity   = 1
  max_size           = 2
  min_size           = 1
  force_delete       = true

  launch_template {
    id      = aws_launch_template.admin_template.id
    version = "$Latest"
  }

  health_check_type = "ELB"
  target_group_arns = [aws_alb_target_group.main_alb_target_group_admin.arn]

  tag {
    key                 = "Name"
    value               = "Admin ASG"
    propagate_at_launch = true
  }
}

