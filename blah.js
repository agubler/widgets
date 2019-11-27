const postcss = require('postcss');
const postcssModules = require('postcss-modules');

const map = new Map();

module.exports.classesMap = map;

// exports.classMapLoader = function classMapLoader(content, map) {
// 	console.log(content);
// 	callback(null, content, map);
// };

// exports.default = async function composeCssLoader(content, sourceMap) {
// 	const callback = this.async();

// 	const resourcePath = this.resourcePath;

// 	const plugin = postcssModules({
// 		getJSON: (filename, json) => {
// 			classesMap.set(resourcePath, json);
// 		},
// 		generateScopedName: '[local]'
// 	});

// 	let result = await postcss([plugin]).process(content, {
// 		from: this.resourcePath,
// 		map: { inline: false }
// 	});
// 	callback(null, JSON.stringify(result.css), JSON.stringify(result.css));
// };

module.exports.default = function blah(content) {
	const resourcePath = this.resourcePath;
	const localsRexExp = /exports.locals = ({[.\s\S]*});/;
	const matches = content.match(localsRexExp);
	const transformedClassNames = JSON.parse(matches[1]);
	// console.log(transformedClassNames);
	const moduleMappings = map.get(resourcePath);
	// console.log(moduleMappings);
	const updatedModuleMappings = Object.keys(moduleMappings).reduce((updated, className) => {
		const classNamesString = moduleMappings[className];
		const classNames = classNamesString.split(' ');
		updated[className] = classNames
			.map((lookup) => {
				return transformedClassNames[lookup];
			})
			.join(' ');
		return updated;
	}, {});

	const response = content.replace(
		localsRexExp,
		`exports.locals = ${JSON.stringify(updatedModuleMappings)};`
	);
	console.log(response);
	return response;
};
