resource "random_password" "postgres_password" {
  length            = 99
  special           = true
  override_special  = "-+=_^~,."
}

resource "random_string" "postgres_username" {
  length  = 62
  special = false
}

resource "random_integer" "postgres_port" {
  min = 1024
  max = 49151
}

resource "random_integer" "postgres_random_identifier_suffix" {
  min = 0
  max = 999999999999
}
