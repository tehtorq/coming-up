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
    this.itemTapped = __bind(this.itemTapped, this);
    this.handleLoadNotesResponse = __bind(this.handleLoadNotesResponse, this);
    this.addNewNote = __bind(this.addNewNote, this);
    this.loadNotes = __bind(this.loadNotes, this);
    this.saveNotes = __bind(this.saveNotes, this);
    this.handleDeleteItem = __bind(this.handleDeleteItem, this);
    this.textFieldChanged = __bind(this.textFieldChanged, this);
    this.dragEndHandler = __bind(this.dragEndHandler, this);
    this.draggingHandler = __bind(this.draggingHandler, this);
    this.dragStartHandler = __bind(this.dragStartHandler, this);
    this.tapOk = __bind(this.tapOk, this);
    this.tapCancel = __bind(this.tapCancel, this);
    NotesAssistant.__super__.constructor.apply(this, arguments);
    this.notes = {
      items: []
    };
    this.event = params.event;
    this.bodyModel = {
      value: ''
    };
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
    this.controller.setupWidget("bodyTextFieldId", {
      focusMode: Mojo.Widget.focusAppendMode,
      multiline: true
    }, this.bodyModel);
    if (this.showBackNavigation()) {
      this.viewMenuModel = {
        items: [
          {
            label: $L('Back'),
            icon: '',
            command: 'back',
            width: 80
          }
        ]
      };
      this.controller.setupWidget(Mojo.Menu.commandMenu, {
        menuClass: 'no-fade'
      }, this.viewMenuModel);
    }
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
      reorderable: true
    }, this.notes);
  };
  NotesAssistant.prototype.activate = function(event) {
    NotesAssistant.__super__.activate.apply(this, arguments);
    this.controller.get("edit-floater").hide();
    this.addListeners([this.controller.get("list"), Mojo.Event.listTap, this.itemTapped], [this.controller.get("textFieldId"), Mojo.Event.propertyChange, this.textFieldChanged], [this.controller.get("list"), Mojo.Event.dragStart, this.dragStartHandler], [this.controller.get("list"), Mojo.Event.dragging, this.draggingHandler], [this.controller.get("list"), Mojo.Event.dragEnd, this.dragEndHandler], [this.controller.get("edit-cancel"), Mojo.Event.tap, this.tapCancel], [this.controller.get("edit-ok"), Mojo.Event.tap, this.tapOk]);
    if (this.notes.items.length === 0) {
      return this.loadNotes();
    }
  };
  NotesAssistant.prototype.tapCancel = function(event) {
    return this.controller.get("edit-floater").hide();
  };
  NotesAssistant.prototype.tapOk = function(event) {
    this.notes.items[this.editIndex].text = this.controller.get('bodyTextFieldId').mojo.getValue();
    this.saveNotes();
    this.controller.get('list').mojo.noticeUpdatedItems(this.editIndex, [this.notes.items[this.editIndex]]);
    this.controller.get('bodyTextFieldId').mojo.setValue("");
    return this.controller.get("edit-floater").hide();
  };
  NotesAssistant.prototype.dragStartHandler = function(event) {
    var node, note;
    if (node = event.target.up(".note")) {
      note = this.controller.get('list').mojo.getItemByNode(node);
      this.dragging = true;
      return this.drag = {
        start: {
          x: event.down.x,
          y: event.down.y,
          note_id: note.id
        },
        end: {}
      };
    }
  };
  NotesAssistant.prototype.draggingHandler = function(event) {
    var node, note;
    if (node = event.target.up(".note")) {
      note = this.controller.get('list').mojo.getItemByNode(node);
      this.drag.end.x = event.move.x;
      this.drag.end.y = event.move.y;
      return this.drag.end.note_id = note.id;
    }
  };
  NotesAssistant.prototype.dragEndHandler = function(event) {
    var index;
    if (this.dragging) {
      this.dragging = false;
      if (this.drag.start.note_id === this.drag.end.note_id) {
        index = -1;
        _.each(this.notes.items, __bind(function(note, i) {
          if (note.id === this.drag.end.note_id) {
            return index = i;
          }
        }, this));
        if (this.drag.start.x < (this.drag.end.x - 50)) {
          return this.markNoteAsDone(index);
        } else if (this.drag.start.x > (this.drag.end.x + 50)) {
          return this.markNoteAsUndone(index);
        }
      }
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
      event_id: this.event.id,
      id: new Date().getTime()
    });
    this.controller.get("list").mojo.invalidateItems(0);
    this.controller.modelChanged(this.notes);
    return this.saveNotes();
  };
  NotesAssistant.prototype.markNoteAsDone = function(index) {
    var el, node, note;
    node = this.controller.get("list").mojo.getNodeByIndex(index);
    note = this.notes.items[index];
    if (note.crossed_off === true) {
      return;
    }
    note.text = "<s><s><s>" + note.text + "</s></s></s>";
    note.crossed_off = true;
    this.saveNotes();
    el = node.down(".note-content");
    return el.update(note.text);
  };
  NotesAssistant.prototype.markNoteAsUndone = function(index) {
    var el, node, note;
    node = this.controller.get("list").mojo.getNodeByIndex(index);
    note = this.notes.items[index];
    if (note.crossed_off !== true) {
      return;
    }
    note.text = note.text.replace(/\<s\>/g, "").replace(/\<\/s\>/g, "");
    note.crossed_off = false;
    this.saveNotes();
    el = node.down(".note-content");
    return el.update(note.text);
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
    var element_tapped, text;
    if (this.dragging) {
      this.dragging = false;
      if (this.drag.start.note_id === this.drag.end.note_id) {
        if (this.drag.start.x < (this.drag.end.x - 50)) {
          this.markNoteAsDone(event.index);
        } else if (this.drag.start.x > (this.drag.end.x + 50)) {
          this.markNoteAsUndone(event.index);
        }
      }
      return;
    }
    element_tapped = event.originalEvent.target;
    this.editIndex = event.index;
    this.controller.get("edit-floater").show();
    text = this.notes.items[event.index].text;
    this.controller.get('bodyTextFieldId').mojo.setValue(text);
    Mojo.Log.info(this.controller.get('bodyTextFieldId').innerHTML);
    this.controller.get("edit-floater").show();
    return this.controller.get('bodyTextFieldId').mojo.focus();
  };
  NotesAssistant.prototype.handleCommand = function(event) {
    if (event.type !== Mojo.Event.command) {
      return;
    }
    switch (event.command) {
      case 'back':
        return this.controller.stageController.popScene();
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