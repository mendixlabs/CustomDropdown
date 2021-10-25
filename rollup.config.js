export default args => {
    return args.configDefaultConfig.map(config => {
        return {
            ...config,
            external,
            extensions
        };
    });
};

// original externals: [/^mendix($|\/)/, /^react($|\/)/, /^react-dom($|\/)/, /^big.js$/]
// we want react/jsx-runtime to be outside the bundle
const external = [/^mendix($|\/)/, /^react$/, /^react-dom($|\/)/, /^big.js$/];
const extensions = [".js", ".jsx", ".tsx", ".ts", ".css", ".scss", ".sass"];