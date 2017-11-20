module.exports = function (config) {
    config.set({
        basePath: './',
        exclude: ['node_modules', '*.d.ts'],
        files: ['*.ts', '*.spec.ts'],
        preprocessors: {
            '**/*.ts': 'karma-typescript'
        },
        browsers: ['Chrome'],
        frameworks: ['jasmine', 'karma-typescript'],
        reporters: ['karma-typescript', 'progress']
    });
}