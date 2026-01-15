#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { execSync } from "child_process";
import { FrontendStack } from "../lib/stacks/frontend-stack";
import { PipelineStack } from "../lib/stacks/pipeline-stack";

const app = new cdk.App();

const getDefaultEnvironment = (): string => {
  try {
    const username = process.env.USER || execSync("whoami").toString().trim();
    return `preview-${username}`;
  } catch {
    return "preview-local";
  }
};

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION || "us-east-1";

const codeConnectionArn = app.node.tryGetContext("codeConnectionArn");
const repositoryName = app.node.tryGetContext("repositoryName") || "PawRush/qiubaiying-blog";
const branchName = app.node.tryGetContext("branchName") || "deploy-to-aws";

// Deploy preview/dev stacks without pipeline
if (!codeConnectionArn) {
  const environment = app.node.tryGetContext("environment") || getDefaultEnvironment();
  const buildOutputPath = app.node.tryGetContext("buildPath") || "../_site";

  new FrontendStack(app, `QiubaiUIFrontend-${environment}`, {
    env: { account, region },
    environment,
    buildOutputPath,
    description: `Qiubaiying blog static website hosting - ${environment}`,
    terminationProtection: environment === "prod",
  });
}

// Deploy pipeline stack
if (codeConnectionArn) {
  new PipelineStack(app, "QiubaiUIPipelineStack", {
    env: { account, region },
    description: "CI/CD Pipeline for QiubaiUI Blog",
    codeConnectionArn,
    repositoryName,
    branchName,
    terminationProtection: true,
  });
}

cdk.Tags.of(app).add("Project", "QiubaiUI");
cdk.Tags.of(app).add("ManagedBy", "CDK");
if (!codeConnectionArn) {
  cdk.Tags.of(app).add("Stack", "Frontend");
} else {
  cdk.Tags.of(app).add("Stack", "Pipeline");
}
