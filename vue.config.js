module.exports = {
    css: {
        loaderOptions: {
            sass: {
                prependData: `
                @import "@/main.scss";
                `
            }
        }
    }
};