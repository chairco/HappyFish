/*global cordova, module*/
module.exports = {
    startP2PTunnel: function (uid, successCallback, errorCallback) {
        //alert('start');
        cordova.exec(successCallback, errorCallback, "P2PTunnel", "startP2PTunnel", [uid]);
    },
    stopP2PTunnel: function (successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "P2PTunnel", "stopP2PTunnel", []);
    }
};
//function startP2PTunnel(uid, successCallback, errorCallback) {
//        alert('start');
//        cordova.exec(successCallback, errorCallback, "P2PTunnel", "startP2PTunnel", [uid]);
//    }
//function stopP2PTunnel(successCallback, errorCallback) {
//        cordova.exec(successCallback, errorCallback, "P2PTunnel", "stopP2PTunnel", []);
//    }
