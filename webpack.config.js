'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const CssModulePlugin_1 = require('@dojo/webpack-contrib/css-module-plugin/CssModulePlugin');
const fs = require('fs');
const path = require('path');
const webpack_1 = require('webpack');
const emit = require('@dojo/webpack-contrib/emit-all-plugin/EmitAllPlugin');
const postcssPresetEnv = require('postcss-preset-env');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssImport = require('postcss-import');
const postcssModules = require('postcss-modules');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TemplatedPathPlugin = require('webpack/lib/TemplatedPathPlugin');
const cssvariables = require('postcss-css-variables');
const postcssCustomProperties = require('postcss-custom-properties');
const blah = require('./blah');

const removeEmpty = (items) => items.filter((item) => item);

function webpackConfigFactory(args) {
	const basePath = process.cwd();
	const packageJsonPath = path.join(basePath, 'package.json');
	const packageJson = fs.existsSync(packageJsonPath) ? require(packageJsonPath) : {};
	const themes = ['dojo', 'material'];
	const themeVersion = '0.0.1'; // args.release || packageJson.version;
	const themesPath = path.join(basePath, 'src', 'theme');
	const outputPath = path.join(basePath, 'output', 'theme');
	const allPaths = themesPath;

	const postcssPresetConfig = {
		browsers: ['last 2 versions', 'ie >= 10'],
		features: {
			'nesting-rules': true
		},
		autoprefixer: {
			grid: true
		},
		importFrom: themes.map((theme) => {
			return path.join(themesPath, theme, 'variables.css');
		})
	};

	const emitAll = emit.emitAllFactory({
		legacy: false,
		inlineSourceMaps: false,
		basePath: path.join(basePath, 'src', 'theme'),
		assetFilter: (() => {})()
	});

	const compilerOptions = { target: 'es6', module: 'esnext' };

	const tsLoaderOptions = {
		instance: 'dojo',
		onlyCompileBundledFiles: true,
		compilerOptions: {
			...compilerOptions,
			declaration: true,
			rootDir: path.resolve('./src'),
			outDir: path.resolve(`./output/`)
		},
		getCustomTransformers(program) {
			return {
				before: removeEmpty([emitAll && emitAll.transformer])
			};
		}
	};

	return {
		entry: themes.reduce((entry, theme) => {
			entry[theme] = [path.join(themesPath, theme, 'index.ts')];
			return entry;
		}, {}),
		output: {
			filename: `[name]/[name]-${packageJson.version}.js`,
			path: outputPath,
			library: '[name]',
			libraryTarget: 'umd'
		},
		resolve: {
			modules: [basePath, path.join(basePath, 'node_modules')],
			extensions: ['.ts', '.js']
		},
		devtool: 'source-map',
		plugins: [
			// new CssModulePlugin_1.default(basePath),
			new MiniCssExtractPlugin({
				filename: `[name]/[name]-${packageJson.version}.css`,
				sourceMap: true
			}),
			new TemplatedPathPlugin(),
			emitAll.plugin
		],
		module: {
			rules: removeEmpty([
				{
					include: allPaths,
					test: /.*\.ts?$/,
					enforce: 'pre',
					loader: `@dojo/webpack-contrib/css-module-dts-loader?type=ts&instanceName=0_dojo`
				},
				{
					include: allPaths,
					test: /.*\.m\.css?$/,
					enforce: 'pre',
					loader: '@dojo/webpack-contrib/css-module-dts-loader?type=css'
				},
				{
					include: allPaths,
					test: /.*\.ts(x)?$/,
					use: removeEmpty([
						{
							loader: 'ts-loader',
							options: tsLoaderOptions
						}
					])
				},
				{
					include: allPaths,
					test: /.*\.(gif|png|jpe?g|svg|eot|ttf|woff|woff2)$/i,
					loader: 'file-loader',
					options: {
						name: (file) => {
							const fileDir = path
								.dirname(file.replace(path.join(basePath, 'src', 'theme'), ''))
								.replace(/^(\/|\\)/, '');
							return `${fileDir}/[hash:base64:8].[ext]`;
						},
						publicPath: (url, resourcePath, context) => {
							console.log(url, resourcePath, context);
							return url.replace(new RegExp('(dojo|material|default)(/|\\\\)'), '');
						},
						hash: 'sha512',
						digest: 'hex'
					}
				},
				{
					test: /\.css$/,
					exclude: allPaths,
					use: [MiniCssExtractPlugin.loader, 'css-loader?sourceMap'] // MiniCssExtractPlugin.loader,
				},
				{
					test: /\.m\.css.js$/,
					exclude: allPaths,
					use: ['json-css-module-loader']
				},
				{
					include: allPaths,
					test: /.*\.css?$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {}
						},
						'@dojo/webpack-contrib/css-module-decorator-loader',
						'./blah',
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1,
								modules: true,
								localIdentName: '[name]__[local]__[hash:base64:5]',
								sourceMap: true
							}
						},
						{
							loader: 'postcss-loader?sourceMap',
							options: {
								ident: 'postcss',
								plugins: [
									postcssModules({
										getJSON: (filename, json) => {
											blah.classesMap.set(filename, json);
										},
										generateScopedName: '[local]'
									}),
									postcssPresetEnv(postcssPresetConfig)
								]
							}
						}
					]
				}
			])
		}
	};
}
exports.default = webpackConfigFactory;
