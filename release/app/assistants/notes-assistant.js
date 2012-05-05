var NotesAssistant;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
NotesAssistant = (function() {
  __extends(NotesAssistant, BaseAssistant);
  function NotesAssistant(params) {
    if (params == null) {
      params = {};
    }
    this.deselectThing = __bind(this.deselectThing, this);
    this.selectThing = __bind(this.selectThing, this);
    this.itemTapped = __bind(this.itemTapped, this);
    this.handleLoadNotesResponse = __bind(this.handleLoadNotesResponse, this);
    this.addNewNote = __bind(this.addNewNote, this);
    this.loadNotes = __bind(this.loadNotes, this);
    this.saveNotes = __bind(this.saveNotes, this);
    this.handleDeleteItem = __bind(this.handleDeleteItem, this);
    this.textFieldChanged = __bind(this.textFieldChanged, this);
    this.dragDrop = __bind(this.dragDrop, this);
    this.dragHover = __bind(this.dragHover, this);
    this.dragLeave = __bind(this.dragLeave, this);
    this.dragEnter = __bind(this.dragEnter, this);
    this.dragStartHandler = __bind(this.dragStartHandler, this);
    NotesAssistant.__super__.constructor.apply(this, arguments);
    this.notes = {
      items: []
    };
    this.event = params.event;
    Mojo.Log.info(JSON.stringify(this.event));
  }
  NotesAssistant.prototype.setupMenu = function() {
    var menu_items;
    menu_items = [
      {
        label: "About",
        command: 'about-scene'
      }
    ];
    return this.controller.setupWidget(Mojo.Menu.appMenu, {
      omitDefaultItems: true
    }, {
      visible: true,
      items: menu_items
    });
  };
  NotesAssistant.prototype.setup = function() {
    NotesAssistant.__super__.setup.apply(this, arguments);
    this.controller.setupWidget("textFieldId", this.attributes = {
      hintText: $L("Add a note"),
      enterSubmits: true,
      requiresEnterKey: true,
      autoFocus: false
    }, this.model = {
      value: '',
      disabled: false
    });
    this.controller.setupWidget("list-scroller", {
      mode: 'vertical'
    }, {});
    this.setupMenu();
    return this.controller.setupWidget("list", {
      itemTemplate: "notes/note",
      swipeToDelete: false,
      hasNoWidgets: true,
      initialAverageRowHeight: 48,
      reorderable: true
    }, this.notes);
  };
  NotesAssistant.prototype.activate = function(event) {
    NotesAssistant.__super__.activate.apply(this, arguments);
    this.addListeners([this.controller.get("list"), Mojo.Event.listTap, this.itemTapped], [this.controller.get("textFieldId"), Mojo.Event.propertyChange, this.textFieldChanged], [this.controller.get("list"), Mojo.Event.dragStart, this.dragStartHandler]);
    if (this.notes.items.length === 0) {
      return this.loadNotes();
    }
  };
  NotesAssistant.prototype.dragStartHandler = function(event) {
    var draggy, node;
    if (Math.abs(event.filteredDistance.x) > Math.abs(event.filteredDistance.y) * 2) {
      this.crossing_off = true;
      node = event.target.up(".thing");
      node.insert('<div class="draggable-thingy"></div>', {
        position: 'before'
      });
      Mojo.Drag.setupDropContainer(node, this);
      draggy = node.down(".draggable-thingy");
      draggy.style.left = event.x;
      draggy.style.top = event.y;
      node._dragObj = Mojo.Drag.startDragging(this.controller, draggy, event.down, {
        preventVertical: false,
        draggingClass: "draggy",
        preventDropReset: false
      });
      return event.stop();
    }
  };
  NotesAssistant.prototype.dragEnter = function(element) {
    return Banner.send("drag enter");
  };
  NotesAssistant.prototype.dragLeave = function(element) {
    Banner.send("drag leave");
    return this.crossing_off = false;
  };
  NotesAssistant.prototype.dragHover = function(element) {};
  NotesAssistant.prototype.dragDrop = function(element) {
    var content, el;
    Banner.send("drag drop: " + this.crossing_off);
    if (this.crossing_off) {
      el = element.up(".thing").down(".event-holder");
      content = "<s>" + el.innerHTML + "</s>";
      el.update(content);
      return this.crossing_off = false;
    }
  };
  NotesAssistant.prototype.deactivate = function(event) {
    return NotesAssistant.__super__.deactivate.apply(this, arguments);
  };
  NotesAssistant.prototype.cleanup = function(event) {
    return NotesAssistant.__super__.cleanup.apply(this, arguments);
  };
  NotesAssistant.prototype.ready = function() {
    this.controller.get('content-area').style.height = "" + (this.controller.window.innerHeight - 50) + "px";
    return this.controller.get('list-scroller').style.height = "" + (this.controller.window.innerHeight - 50) + "px";
  };
  NotesAssistant.prototype.textFieldChanged = function(event) {
    var value;
    value = this.controller.get('textFieldId').mojo.getValue();
    if (value !== "") {
      this.controller.get('textFieldId').mojo.setValue("");
      this.addNewNote(value);
    }
    return this.controller.window.setTimeout(__bind(function() {
      return this.controller.get('textFieldId').mojo.focus();
    }, this), 10);
  };
  NotesAssistant.prototype.handleDeleteItem = function(event) {
    this.notes.items.splice(event.index, 1);
    return this.saveNotes();
  };
  NotesAssistant.prototype.saveNotes = function() {
    return this.depot.add("notes" + this.event.id, JSON.stringify(this.notes.items));
  };
  NotesAssistant.prototype.loadNotes = function() {
    return this.depot = new Mojo.Depot({
      name: "notes" + this.event.id
    }, __bind(function() {
      return this.depot.get("notes" + this.event.id, this.handleLoadNotesResponse, __bind(function() {}, this));
    }, this), __bind(function() {}, this));
  };
  NotesAssistant.prototype.addNewNote = function(string) {
    Mojo.Log.info(string);
    this.notes.items.push({
      text: string,
      event_id: this.event.id
    });
    this.controller.get("list").mojo.invalidateItems(0);
    this.controller.modelChanged(this.notes);
    return this.saveNotes();
  };
  NotesAssistant.prototype.handleLoadNotesResponse = function(response) {
    var notes;
    Mojo.Log.info("notes");
    Mojo.Log.info(JSON.stringify(response));
    if (response !== null) {
      notes = JSON.parse(response);
      this.notes.items = _.select(notes, __bind(function(note) {
        return note.event_id === this.event.id;
      }, this));
    }
    return this.controller.modelChanged(this.notes);
  };
  NotesAssistant.prototype.itemTapped = function(event) {
    var element_tapped, thing;
    element_tapped = event.originalEvent.target;
    Banner.send('note tapped');
    thing = this.controller.get("list").mojo.getNodeByIndex(event.index);
    return this.selectThing(thing);
  };
  NotesAssistant.prototype.selectThing = function(thing) {
    this.addOptions(thing);
    return thing.addClassName('selected');
  };
  NotesAssistant.prototype.deselectThing = function(thing) {
    thing.removeClassName('selected');
    if (thing.down(".event-options")) {
      return thing.down(".event-options").remove();
    }
  };
  NotesAssistant.prototype.handleCommand = function(event) {
    if (event.type !== Mojo.Event.command) {
      return;
    }
    switch (event.command) {
      case 'about-scene':
        return this.controller.stageController.pushScene({
          name: "about"
        }, {});
      case 'donation-cmd':
        return AppAssistant.open_donation_link();
      case 'purchase-cmd':
        return AppAssistant.open_purchase_link();
    }
  };
  return NotesAssistant;
})();