# resource "aws_instance" "admin_instance" {
#   subnet_id = aws_subnet.public_subnets[1].id

#   launch_template {
#     id      = aws_launch_template.admin_template.id
#     version = "$Latest"
#   }

#   tags = merge(
#     var.common_tags,
#     {
#       "Name" = "Clean Mile Admin Instance"
#     }
#   )
# }
