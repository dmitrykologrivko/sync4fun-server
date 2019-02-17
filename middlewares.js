const path = require('path');

function revManifest(manifestPath) {
    let manifest = {};
    
    try {
        manifest = require(path.resolve(__dirname, manifestPath));
    } catch (error) {
        console.error('Cannot open rev-manifest', error);
    }

    return (req, res, next) => {
        res.locals.assetPath = (assetPath) => {
            return manifest[assetPath] || assetPath;
        };

        next();
    }
}

module.exports = {
    revManifest: revManifest
};
