resource "tls_private_key" "private_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "private_key_pem" {
  content         = tls_private_key.private_key.private_key_openssh
  filename        = "private_key.pem"
  file_permission = "0400"
}

resource "aws_key_pair" "key_pair" {
  key_name   = var.key_pair_name
  public_key = tls_private_key.private_key.public_key_openssh

  tags = merge(
    var.common_tags,
    {
      "Name" = "Clean Mile Key Pair"
    }
  )
}
