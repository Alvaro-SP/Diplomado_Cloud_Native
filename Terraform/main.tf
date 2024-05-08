provider "aws" {
  region = "us-east-2"
}

# Definición del recurso de seguridad
resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Permite conexión SSH"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Reemplaza con tu dirección IP específica para mayor seguridad
  }

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }
}

# Definición de la instancia "produccion"
resource "aws_instance" "produccion" {
  ami           = "ami-0747bdcabd34c712a"
  instance_type = "t2.micro"
  key_name      = "diplomado"

  vpc_security_group_ids = [
    aws_security_group.allow_ssh.id
  ]

  tags = {
    Name = "produccion"
  }
}

# Definición de la instancia "ansible"
resource "aws_instance" "ansible" {
  ami           = "ami-0747bdcabd34c712a"
  instance_type = "t2.micro"
  key_name      = "diplomado"

  vpc_security_group_ids = [
    aws_security_group.allow_ssh.id
  ]

  tags = {
    Name = "ansible"
  }
}

# Salida de las direcciones IP públicas de las instancias
output "produccion_public_ip" {
  value = aws_instance.produccion.public_ip
}

output "ansible_public_ip" {
  value = aws_instance.ansible.public_ip
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/key_pair
# ! APLICAR EL TERRAFORM

# terraform init
# terraform apply