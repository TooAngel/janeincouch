terraform {
  required_version = "~> 0.12.0"

  backend "remote" {
    workspaces {
      prefix = "kbst-apps-"
    }

    hostname     = "app.terraform.io"
    organization = "couchallenge"
  }
}

data "kustomization" "current" {
  path = "overlays/${terraform.workspace}"
}

resource "kustomization_resource" "current" {
  for_each = data.kustomization.current.ids

  manifest = data.kustomization.current.manifests[each.value]
}
