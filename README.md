# Github Release Notifier

```yaml
version: "3"
services:
    grn:
        image: netfloex/github-release-notifier:v1.0.0
        container_name: grn
        environment:
            GITHUB_TOKEN: **
            REPOSITORIES: |
                Netfloex/Nginx
                Netfloex/Spel
            DISCORD_WEBHOOKS: https://discord.com/api/webhooks/**
```
