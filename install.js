"use strict";

const https = require("follow-redirects").https;
const tar = require("tar");
const shell = require("shelljs");
const HttpsProxyAgent = require("https-proxy-agent");
const version = require("./package.json")["psc-package-version"];
const platform = { win32: "win64", darwin: "macos" }[process.platform] || "linux64";

console.log(require('https-proxy-agent'),'require');

// agent's address
const proxy = 'http://172.23.240.1:7890';  // 替换为你的代理地址和端口
const agent = new HttpsProxyAgent(proxy);

https.get({
  hostname: 'github.com',
  port: 443,
  path: `/purescript/psc-package/releases/download/${version}/${platform}.tar.gz`,
  agent: agent  // 使用代理代理请求
}, res => res.pipe(
    tar.x({"C": 'psc-package', strip: 1}).on("finish", () => {
      if (shell.test("-f", "./psc-package/psc-package")) {
        shell.mv("./psc-package/psc-package", "./psc-package/psc-package.exe")
      }
    })
  )
);
