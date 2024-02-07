---
layout: post
title: 利用Github Action + COS全球加速的高效率传输实践
date: 2024-01-31 12:19:06 +0800
category: tech
thumb: IMG_PATH/hulatang1.jpg
tags: [COS, 腾讯云]
---

## 创建 API 密钥

API 密钥代表账号身份和所拥有的权限，使用腾讯云 API 可以操作所有腾讯云资源

- 操作：访问管理 —— 访问密钥 —— API密钥管理

![创建SecretKey][p1]

## 创建 COS 储存桶

为了防止流量盗用，这里我设置了私有读写

![创建COS储存桶][p2]

## 配置 GitHub Actions
- 操作：Gthub仓库 —— Settings —— Actions —— Repository secrets


![配置 GitHub Actions][p3]

这里不使用 Webpack，选择 Set up a workflow yourself 自己配置

- 操作：Gthub仓库 —— Actions —— New workflow —— set up a workflow yourself

yml配置

    name: Upload to COS

    on: [push]

    jobs:
    build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v1
        - name: Install coscmd
    run: sudo pip install coscmd
        - name: Configure coscmd
    env: 
        SECRET_ID: ${{ secrets.SecretId }}
        SECRET_KEY: ${{ secrets.SecretKey }}
        BUCKET: 存储桶名称
        REGION: 所属地域
        run: coscmd config
        -a $SECRET_ID
        -s $SECRET_KEY
        -b $BUCKET
        -r $REGION
        - name: Upload
        run: coscmd upload  -rs --delete -f ./ / --ignore "./.git/*






[p1]: {{ site.IMG_PATH }}/foundSecretKey.jpg_640 "创建SecretKey"
[p2]: {{ site.IMG_PATH }}/foundCOS.jpg_640 "创建COS储存桶"
[p3]: {{ site.IMG_PATH }}/repositorySecrets.jpg_640 "创建COS储存桶"