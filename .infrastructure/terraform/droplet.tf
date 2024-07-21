# Wait for the Volume to mount to the Droplet to ensure "Resource Busy" error is not encountered
resource "time_sleep" "wait_20_seconds" {
  depends_on = [digitalocean_droplet.this]

  create_duration = "30s"
}

# Create a new droplet
resource "digitalocean_droplet" "this" {
  name        = "${local.common_name}-droplet"
  region      = "tor1"
  size        = "s-2vcpu-2gb" // https://slugs.do-api.dev/
  image       = "ubuntu-22-04-x64"
  monitoring  = true
  resize_disk = false
  backups     = true
  
  ssh_keys = [
    # Keys go here
    "43:aa:15:f1:fd:39:3a:0c:c9:a4:1c:4b:7e:e8:ba:78" 
  ]
}
