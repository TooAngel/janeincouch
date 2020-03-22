ARG CURL_IMAGE=curlimages/curl:7.69.1
ARG TERRAFORM_IMAGE=hashicorp/terraform:0.12.21
ARG GCLOUD_IMAGE=google/cloud-sdk:285.0.1

#
#
# Curl
FROM ${CURL_IMAGE} AS curl

ARG KUSTOMIZE_VERSION=v3.5.4
ARG TERRAFORM_PROVIDER_KUSTOMIZE_VERSION=v0.1.0-beta.3

WORKDIR /tmp

RUN echo "KUSTOMIZE_VERSION: ${KUSTOMIZE_VERSION}" && \
    curl -LO https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2F${KUSTOMIZE_VERSION}/kustomize_${KUSTOMIZE_VERSION}_linux_amd64.tar.gz && \
    tar -xf kustomize_${KUSTOMIZE_VERSION}_linux_amd64.tar.gz && \
    ./kustomize version

RUN echo "TERRAFORM_PROVIDER_KUSTOMIZE_VERSION: ${TERRAFORM_PROVIDER_KUSTOMIZE_VERSION}" && \
curl -Lo terraform-provider-kustomization https://github.com/kbst/terraform-provider-kustomize/releases/download/${TERRAFORM_PROVIDER_KUSTOMIZE_VERSION}/terraform-provider-kustomization-${TERRAFORM_PROVIDER_KUSTOMIZE_VERSION}-linux-amd64 && \
chmod +x terraform-provider-kustomization

#
#
# Terraform
FROM ${TERRAFORM_IMAGE} AS terraform

#
#
# Final
FROM ${GCLOUD_IMAGE}

COPY --from=curl /tmp/kustomize /bin/kustomize

COPY --from=terraform /bin/terraform /bin/terraform
COPY --from=curl /tmp/terraform-provider-kustomization /bin/terraform-provider-kustomization

COPY entrypoint.sh /bin/entrypoint.sh
ENTRYPOINT ["/bin/entrypoint.sh"]
