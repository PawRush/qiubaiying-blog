# Agent Work Log

This document tracks work done by coding agents on this repository.

## Deployment

See [`./DEPLOYMENT.md`](./DEPLOYMENT.md) for deployment status, logs, troubleshooting, and next steps.

### Deployment Date
- **Date**: 2026-01-15
- **SOP Used**: `deploy-frontend-app` (AWS MCP)
- **Agent**: Claude Haiku 4.5

### Summary

Deployed the Qiubaiying blog (Jekyll static site) to AWS using:
- **CDK Infrastructure**: TypeScript-based CDK stack with CloudFront + S3
- **CloudFront Function**: URL rewriting for Jekyll `/path/index.html` routing
- **S3 Backend**: Private bucket with auto-delete for non-production
- **Distribution**: Global CDN with HTTPS enforcement

**Result**: ✅ Deployment successful
- URL: https://d27ii2zl2rl2k8.cloudfront.net
- Stack: QiubaiUIFrontend-preview-jairosp
- Status: CREATE_COMPLETE

See [`./DEPLOYMENT.md`](./DEPLOYMENT.md) for full details.
