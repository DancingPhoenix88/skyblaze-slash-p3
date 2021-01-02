/*
    Publisher:     var events = new PubSub();
    Subscriber: events.subscribe( 'event-1', func1 );
                 events.subscribe( 'event-2', func2 );
    Publisher:  events.publish( new PubSubEvent( 'event-1' ) );
    Subscriber: events.unsubscribe();
 */
function PubSub () {
    this.subscribers = {};
}
//-----------------------------------------------------------------------------------------------------------
PubSub.prototype = {
    subscribe : function (eventName, s, callback) {
        var sub = new Subscriber( s, callback );
        if (!(eventName in this.subscribers)) {
            this.subscribers[ eventName ] = [ sub ];
        } else {
            this.subscribers[ eventName ].push( sub );
        }
    },
    //-------------------------------------------------------------------------------------------------------
    unsubscribe : function (s, eventName) {
        if (eventName in this.subscribers) {
            this.subscribers[ eventName ] = removeItemAll( this.subscribers[ eventName ], s );
        }
    },
    //-------------------------------------------------------------------------------------------------------
    unsubscribe : function (s) {
        for (const eventName in this.subscribers) {
            this.subscribers[ eventName ] = removeItemAll( this.subscribers[ eventName ], s );
        }
    },
    //-------------------------------------------------------------------------------------------------------
    unsubscribeAll : function () {
        this.subscribers = {};
    },
    //-------------------------------------------------------------------------------------------------------
    publish : function (e) {
        var eventName = e.name;
        if (!(eventName in this.subscribers)) {
            return;
        }
        var subs = this.subscribers[ eventName ];
        for (var i = 0; i < subs.length; ++i) {
            subs[i].callbackFunc.call( subs[i].obj, e );
        }
    }
};
//-----------------------------------------------------------------------------------------------------------
function Subscriber (obj, callbackFunc) {
    this.obj = obj;
    this.callbackFunc = callbackFunc || obj.onEvent;
}
//-----------------------------------------------------------------------------------------------------------
function PubSubEvent (name, data) {
    this.name = name;
    this.data = data;
}
//-----------------------------------------------------------------------------------------------------------
PubSubEvent.prototype.withData = function (data) {
    this.data = data;
    return this;
}