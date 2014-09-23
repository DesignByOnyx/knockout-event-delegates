knockout-event-delegates
========================

Intelligent event binding for KnockoutJS.  The idea here is that all event information for a view is defined in one place: the root node of the template.  All events are bound using event delegation (extremely efficient) and are properly unbound whenever the node is removed.

```html
<div data-bind="delegatedEvents: { '.edit click': handleEditClicks, '.remove click': handleRemoveClicks }">
  <ul data-bind="foreach: people">
    <li>
      <h3 data-bind="text: name"></h3>
      <div class="actions">
        <button class="edit">Edit</button>
        <button class="remove">Remove</button>
      </div>
    </li>
  </ul>
</div>
```

```javascript
var PeopleViewModel = {
    people: ko.observableArray([{
      id: 1,
      name: 'Bob'
    }, {
      id: 2,
      name: 'Jane'
    }]),
    
    handleEditClicks: function(item, ev) {
      // item is the person
      // ev - the click event. ev.target === [button.edit]
    },
    
    handleRemoveClicks(item, ev) {
      // item is the person
      // ev - the click event. ev.target === [button.remove]
    }
};

ko.applyBindings(PeopleViewModel);
```

Available events: **blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu**.

##Benefits

- **All events are delegated to a single node.** Normally the above code would have been written like this:

```html
  <ul data-bind="foreach: people">
    <li>
      <h3 data-bind="text: name"></h3>
      <div class="actions">
        <button class="edit" data-bind="click: $parent.handleEditClick">Edit</button>
        <button class="remove" data-bind="click: $parent.handleRemoveClick">Remove</button>
      </div>
    </li>
  </ul>
```

But now the browser has to manage a separate click event for every edit and remove button.  As soon as you have 200+ people listed on the page the browser will have to manage 400+ event bindings.  On top of that, every time an item is added or removed knockout is binding and unbinding the events over and over.  With event delegation, there are only two events being managed by the browser (and knockout) - even if you have 1000 people listed on the page.  Any time a person is added or removed, no events need to be bound or unbound - the delegate will handle it.

- **All events are properly unbound.** As soon as the view is removed from the DOM, all events bound with this plugin will be properly unbound.  This helps prevent potential memory leaks from mismanaged event binding.

- **No need to worry about $parent, $parents[n], or $root references.** If you have several levels of nested templates it can be combersome to remember how to reference a function or observable in a parent context.  With this plugin, binding events is as easy as styling your templates.  For example, lets say you have a template with two grids: `.grid-1` and `.grid-2` - both grids are composed of several levels of nested templates which will eventually render an "edit" button on each row.  Here's how you can use this plugin:

```html
<!-- at the template root level -->
<div data-bind="delegatedEvents: { '.grid-1 .edit click': handleGrid1Edit, 'grid-2 .edit click': handleGrid2Edit }">
    <div class="grid-1" data-bind="template: {name: 'grid_1'}"></div>
    <div class="grid-2" data-bind="template: {name: 'grid_2'}"></div>
</div>

<!-- or grid-level delegation -->
<div>
    <div data-bind="template: {name: 'grid_1'}, delegatedEvents: { '.edit click': handleGrid1Edit }"></div>
    <div data-bind="template: {name: 'grid_2'}, delegatedEvents: { '.edit click': handleGrid2Edit }"></div>
</div>
```

- **Update your templates now.** You should be able to update your templates now without touching your view models.  A function parameters and contexts will remain the same
  
