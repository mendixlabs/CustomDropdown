export default args => {
    return args.configDefaultConfig.map(config => {
        return {
            ...config,
            external
        };
    });
};

// original externals: [/^mendix($|\/)/, /^react($|\/)/, /^react-dom($|\/)/, /^big.js$/]
// we want react/jsx-runtime to be outside the bundle
const external = [/^mendix($|\/)/, /^react$/, /^react-dom($|\/)/, /^big.js$/];
