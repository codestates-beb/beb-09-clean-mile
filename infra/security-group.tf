resource "aws_security_group" "alb_security_group" {
  name        = "Clean Mile ALB Security Group"
  description = "Clean Mile ALB Security Group"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    description = "Allow http inbound traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow https inbound traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile ALB Security Group"
    }
  )
}

resource "aws_security_group" "bastion_security_group" {
  name        = "Clean Mile Bastion Security Group"
  description = "Clean Mile Bastion Security Group"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    description = "Allow SSH inbound traffic"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.manager_ips
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile Bastion Security Group"
    }
  )
}

resource "aws_security_group" "server_security_group" {
  name        = "Clean Mile Server Security Group"
  description = "Clean Mile Server Security Group"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    description     = "Allow SSH inbound traffic"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_security_group.id]
  }

  ingress {
    description     = "Allow 8080 inbound traffic from ALB"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_security_group.id]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile Server Security Group"
    }
  )
}

resource "aws_security_group" "client_security_group" {
  name        = "Clean Mile Client Security Group"
  description = "Clean Mile Client Security Group"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    description = "Allow SSH inbound traffic"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.manager_ips
  }

  ingress {
    description = "Allow 3000 inbound traffic from ALB"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile Client Security Group"
    }
  )
}

resource "aws_security_group" "admin_security_group" {
  name        = "Clean Mile Admin Security Group"
  description = "Clean Mile Admin Security Group"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    description = "Allow SSH inbound traffic"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.manager_ips
  }

  ingress {
    description = "Allow 3001 inbound traffic from ALB"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile Admin Security Group"
    }
  )
}
