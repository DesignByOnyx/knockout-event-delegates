define([
    "knockout",
    "jquery",
    "underscore"
], function (ko, $, _) {
    ko.bindingHandlers.delegatedEvents = {
        init: function(element, valueAccessor, allBindings, viewModel) {
            var disposeQueue = {},
                $element = $(element),
                events = ko.unwrap( valueAccessor() ),
                eventsArray = "blur focus focusin focusout resize click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup".split(" "),
                eventRegex = new RegExp("(.*) ?(" + eventsArray.join("|") + ")$"),
                matchedBinding, eventNamespace;
            
            _.each(events, function(handler, eventKey) {
                matchedBinding = eventKey.match( eventRegex );
                if( matchedBinding ) {
                    //console.log( "Binding", matchedBinding[2], "event delegate for '", (matchedBinding[1] ? matchedBinding[1] : "ALL"), "' elements");
                    
                    if( typeof handler === "string" ) {
                        handler = viewModel[ handler ];
                    }
                    
                    if( typeof handler !== "function" ) { return; }
                    
                    var handlerWrap = function(ev) {
                        var returnValue = handler.call(viewModel, ko.contextFor(this).$data, ev);
                        if( returnValue !== true ) {
                            ev.preventDefault();
                        }
                    };
                    
                    eventNamespace = matchedBinding[2] + "." + matchedBinding[0].replace(/[^\w]/g, "");
                    disposeQueue[ eventNamespace ] = handlerWrap;
                    $element.on(eventNamespace, matchedBinding[1], handlerWrap);
                }
            });
            
            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                // unbind any event delegates
                ko.utils.objectForEach(disposeQueue, function(eventNamespace, handler) {
                    //console.log("Unbinding event: ", eventNamespace);
                    $element.off(eventNamespace, handler);
                    disposeQueue[ eventNamespace ] = null;
                });
            });
        }
    };
});
