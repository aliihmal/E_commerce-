import ImageKit from "imagekit";
import config from "../config";

const imagekit = new ImageKit({
    publicKey: config.imagekitConfig.publicKey!,
    privateKey: config.imagekitConfig.privateKey!,
    urlEndpoint: config.imagekitConfig.urlEndpoint!
});

export default imagekit;