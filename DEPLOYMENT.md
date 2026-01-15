# Deployment Summary

Your app is deployed to AWS with a 'preview' URL that doesn't change when you update GitHub. Share this link with others.

To connect deployments to GitHub changes, ask your coding agent to `setup an AWS CodePipeline`.

Services used: CloudFront, S3, CloudFormation, IAM

Questions? Ask your Coding Agent:
 - What resources were deployed to AWS?
 - How do I update my deployment?

## Deployment Details

- **Deployment URL**: https://d27ii2zl2rl2k8.cloudfront.net
- **Stack Name**: QiubaiUIFrontend-preview-jairosp
- **Distribution ID**: E3SQXXHLN6H65
- **S3 Bucket**: qiubaiuifrontend-preview-jai-websitebucket75c24d94-dzdxuilvhgg0
- **Region**: us-east-1
- **Framework**: Jekyll Static Site Generator
- **Deployment Method**: AWS CDK + CloudFormation

## Quick Commands

```bash
# View deployment status
aws cloudformation describe-stacks --stack-name QiubaiUIFrontend-preview-jairosp --query 'Stacks[0].StackStatus' --output text --no-cli-pager

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E3SQXXHLN6H65 --paths "/*" --no-cli-pager

# View CloudFront access logs (last hour)
aws s3 ls s3://qiubaiuifrontend-preview-jai-websitebucket75c24d94-dzdxuilvhgg0/ --recursive | tail -20

# Redeploy
./scripts/deploy.sh
```

## Production Readiness

For production deployments, consider:
- WAF Protection: Add AWS WAF with managed rules (Core Rule Set, Known Bad Inputs) and rate limiting
- CSP Headers: Configure Content Security Policy in CloudFront response headers (`script-src 'self'`, `frame-ancestors 'none'`)
- Custom Domain: Set up Route 53 and ACM certificate
- Monitoring: CloudWatch alarms for 4xx/5xx errors and CloudFront metrics
- Auth Redirect URLs: If using an auth provider (Auth0, Supabase, Firebase, Lovable, etc.), add your CloudFront URL to allowed redirect URLs

## Architecture

```
+----------+
| GitHub   | (Source)
+-----+----+
      |
      v
+-----+---+
| S3      | (Website Content - Private)
| Bucket  |
+-----+---+
      ^
      |
+-----+-----+
| CloudFront| (CDN + URL Rewriting for Jekyll)
|Distribution|
+-----+-----+
      ^
      |
   Users
```

CloudFront serves the content with:
- **CloudFront Function**: Rewrites paths like `/about` to `/about/index.html` for Jekyll static site compatibility
- **Security**: HTTPS enforced, S3 bucket is private
- **Logging**: Access logs stored in S3 for auditing

## Rollback Procedure

If deployment fails or needs revert:

```bash
# Destroy the stack (removes all AWS resources)
cd infra
cdk destroy --all

# Or manually delete via AWS Console
aws cloudformation delete-stack --stack-name QiubaiUIFrontend-preview-jairosp
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build output not found | Verify `jekyll build` succeeds and `_site/` directory exists |
| CloudFront 403 errors | Check S3 bucket policy - S3 bucket must be private, CloudFront uses OAC |
| Stale content after deploy | Run: `aws cloudfront create-invalidation --distribution-id E3SQXXHLN6H65 --paths "/*"` |
| Routes return 404 instead of homepage | Verify CloudFront Function is attached (check in AWS Console) |

## Next Steps

1. Share the deployment URL: https://d27ii2zl2rl2k8.cloudfront.net
2. Test the site and verify all pages work correctly
3. (Optional) Set up a custom domain with Route 53
4. (Optional) Set up CI/CD pipeline for automatic deployments on GitHub changes
