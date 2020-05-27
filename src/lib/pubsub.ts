var events: object = (function () {
    var topics: any = {};
    var hOP: any = topics.hasOwnProperty;
    
    return {
        subscribe: function (topic: string, listener: object) {
            if (!hOP.call(topics, topic))
                topics[topic] = [];

            var index: any = topics[topic].push(listener) - 1;

            return {
                remove: function () {
                    delete topics[topic][index];
                }
            };
        },
        publish: function (topic: string, info: object) {
            if (!hOP.call(topics, topic))
                return;

            topics[topic].forEach(function (item: any) {
                item(info != undefined ? info : {});
            });
        }
    };
})();

export { events };