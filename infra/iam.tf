resource "aws_iam_policy" "ec2_to_ecr_policy" {
  name        = "ec2_to_ecr_policy"
  path        = "/"
  description = "Policy for EC2 to ECR"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:DescribeImages",
                "ecr:GetAuthorizationToken",
                "ecr:ListImages"
            ],
            "Resource": "*"
        }
    ]
}
EOF

  tags = merge(
    var.common_tags,
    {
      "Name" = "Clean Mile EC2 to ECR Policy"
    }
  )
}

resource "aws_iam_role" "ec2_to_ecr_role" {
  name = "ec2_to_ecr_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Effect": "Allow",
      "Principal": {
        "Service": ["ec2.amazonaws.com"]
        }
      }
    ]
  }
EOF

  tags = merge(
    var.common_tags,
    {
      "Name" = "Clean Mile EC2 to ECR Role"
    }
  )
}

resource "aws_iam_role_policy_attachment" "ec2_to_ecr_role_policy_attachment" {
  role       = aws_iam_role.ec2_to_ecr_role.name
  policy_arn = aws_iam_policy.ec2_to_ecr_policy.arn
}

resource "aws_iam_instance_profile" "ec2_to_ecr_instance_profile" {
  name = "ec2_to_ecr_instance_profile"
  role = aws_iam_role.ec2_to_ecr_role.name
}