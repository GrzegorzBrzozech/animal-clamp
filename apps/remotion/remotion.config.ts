import path from "path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setConcurrency(null);
Config.setOverwriteOutput(true);

Config.overrideWebpackConfig((config) => {
  const srcAlias = path.resolve(process.cwd(), "src");
  const puppetAlias = path.resolve(process.cwd(), "../../packages/puppet/src");
  const existing = config.resolve?.alias;

  const aliases = Array.isArray(existing)
    ? [...existing, { name: "~", alias: srcAlias }, { name: "@animal-clamp/puppet", alias: puppetAlias }]
    : { ...(existing ?? {}), "~": srcAlias, "@animal-clamp/puppet": puppetAlias };

  return {
    ...config,
    resolve: { ...config.resolve, alias: aliases },
  };
});
