import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const nonce = "testing";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
  throw new Error("Unknown bundler");
}

/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
  mode: "development",
  devtool: false,
  entry: {
    main: "./src/index",
  },
  optimization: {
    splitChunks: {
      chunks: "async",
    },
  },
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    headers: {
      "Content-Security-Policy": `img-src * data:; script-src 'nonce-${nonce}' 'strict-dynamic'; style-src 'nonce-${nonce}' 'strict-dynamic';`,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      templateContent: ({ htmlWebpackPlugin }) => `
    <html>
      <head>
        <script nonce="${nonce}" src="main.js"></script>
      </head>
      <body>
        ${htmlWebpackPlugin.tags.bodyTags}
      </body>
    </html>
  `,
    }),
  ],
  output: {
    clean: true,
    trustedTypes: true,
    path: isRunningWebpack
      ? path.resolve(__dirname, "webpack-dist")
      : path.resolve(__dirname, "rspack-dist"),
    filename: "[name].js",
  },
  experiments: {
    css: true,
  },
};

export default config;
