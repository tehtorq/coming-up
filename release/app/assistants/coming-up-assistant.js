var ComingUpAssistant;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
ComingUpAssistant = (function() {
  __extends(ComingUpAssistant, BaseAssistant);
  function ComingUpAssistant(params) {
    if (params == null) {
      params = {};
    }
    this.itemTapped = __bind(this.itemTapped, this);
    this.handleActionSelection = __bind(this.handleActionSelection, this);
    this.handleLoadEventsResponse = __bind(this.handleLoadEventsResponse, this);
    this.addNewEvent = __bind(this.addNewEvent, this);
    this.handleDeleteItem = __bind(this.handleDeleteItem, this);
    this.priorityFormatter = __bind(this.priorityFormatter, this);
    this.whenFormatter = __bind(this.whenFormatter, this);
    this.textChanged = __bind(this.textChanged, this);
    this.dateChanged = __bind(this.dateChanged, this);
    this.timeChanged = __bind(this.timeChanged, this);
    this.textFieldChanged = __bind(this.textFieldChanged, this);
    this.dividerFunction = __bind(this.dividerFunction, this);
    this.handleUpdate = __bind(this.handleUpdate, this);
    this.handleMoved = __bind(this.handleMoved, this);
    ComingUpAssistant.__super__.constructor.apply(this, arguments);
    this.events = {
      items: []
    };
    this.params = params;
    Mojo.Log.info(JSON.stringify(this.params));
  }
  ComingUpAssistant.prototype.setupMenu = function() {
    var menu_items;
    menu_items = [
      {
        label: "Preferences",
        command: Mojo.Menu.prefsCmd
      }, {
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
  ComingUpAssistant.prototype.setupDates = function() {
    this.today = Date.today();
    this.tomorrow = Date.today().addDays(1);
    this.after_tomorrow = Date.today().addDays(2);
    this.in_a_week = Date.today().addWeeks(1);
    this.first_day_of_next_month = Date.today().moveToLastDayOfMonth().addDays(1);
    this.new_years_day = Date.today().moveToMonth(0);
    return this.month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  };
  ComingUpAssistant.prototype.setup = function() {
    ComingUpAssistant.__super__.setup.apply(this, arguments);
    this.controller.setupWidget("textFieldId", this.attributes = {
      hintText: $L("I want to..."),
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
    this.setupDates();
    this.setupMenu();
    this.dateModel = {
      date: new Date()
    };
    this.controller.setupWidget('datepicker', {
      modelProperty: 'date'
    }, this.dateModel);
    this.controller.listen('datepicker', Mojo.Event.propertyChange, this.dateChanged);
    this.timeModel = {
      time: new Date()
    };
    this.controller.setupWidget('timepicker', {
      modelProperty: 'time'
    }, this.timeModel);
    this.controller.listen('timepicker', Mojo.Event.propertyChange, this.timeChanged);
    this.controller.setupWidget('textField', {
      textFieldName: 'username',
      hintText: 'Description',
      modelProperty: 'value'
    }, {});
    this.controller.listen('textField', Mojo.Event.propertyChange, this.textChanged);
    this.controller.setupWidget("list", {
      itemTemplate: "coming-up/event",
      emptyTemplate: "coming-up/emptylist",
      nullItemTemplate: "list/null_item_template",
      swipeToDelete: false,
      dividerFunction: this.dividerFunction,
      dividerTemplate: "coming-up/divider-template",
      formatters: {
        when: this.whenFormatter,
        priority: this.priorityFormatter
      }
    }, this.events);
    return this.controller.setupWidget("horizontal-scroller", {
      mode: 'horizontal-snap'
    }, this.model = {
      snapElements: {
        x: $$('.scrollerItem')
      },
      snapIndex: 0
    });
  };
  ComingUpAssistant.prototype.handleMoved = function(done, position) {
    if (done) {
      return Mojo.Log.info("Done: ", done, "Position: ", Object.toJSON(position));
    }
  };
  ComingUpAssistant.prototype.handleUpdate = function(event) {
    return event.addListener({
      moved: this.handleMoved
    });
  };
  ComingUpAssistant.prototype.dividerFunction = function(model) {
    var w;
    w = Date.parse(model.when.substr(0, 4) + "-" + model.when.substr(4, 2) + "-" + model.when.substr(6, 2));
    if (this.today.isAfter(w)) {
      return 'earlier';
    }
    if (this.tomorrow.isAfter(w)) {
      return 'today';
    }
    if (this.after_tomorrow.isAfter(w)) {
      return 'tomorrow';
    }
    if (this.in_a_week.isAfter(w)) {
      return 'in next week';
    }
    if (this.first_day_of_next_month.isAfter(w)) {
      return 'this month';
    }
    if (w.isAfter(this.new_years_day)) {
      return 'next year';
    }
    return this.month_names[w.getMonth()];
    return 'later';
  };
  ComingUpAssistant.prototype.activate = function(event) {
    ComingUpAssistant.__super__.activate.apply(this, arguments);
    this.addListeners([this.controller.get("list"), Mojo.Event.listTap, this.itemTapped], [this.controller.get("list"), Mojo.Event.listDelete, this.handleDeleteItem], [this.controller.get("textFieldId"), Mojo.Event.propertyChange, this.textFieldChanged]);
    Mojo.Log.info(this.controller.get('debugger').innerHTML);
    if (this.events.items.length === 0) {
      return this.loadEvents();
    }
  };
  ComingUpAssistant.prototype.deactivate = function(event) {
    return ComingUpAssistant.__super__.deactivate.apply(this, arguments);
  };
  ComingUpAssistant.prototype.cleanup = function(event) {
    return ComingUpAssistant.__super__.cleanup.apply(this, arguments);
  };
  ComingUpAssistant.prototype.ready = function() {
    this.controller.get('horizontally-scrolled-container').style.width = "" + ((this.controller.window.innerWidth + 2) * 2) + "px";
    this.controller.get('content-area').style.height = "" + (this.controller.window.innerHeight - 50) + "px";
    this.controller.get('horizontal-scroller').style.height = "" + (this.controller.window.innerHeight - 50) + "px";
    this.controller.get('list-scroller').style.height = "" + (this.controller.window.innerHeight - 50) + "px";
    return this.controller.get('horizontal-scroller').mojo.setSnapIndex(0, false);
  };
  ComingUpAssistant.prototype.textFieldChanged = function(event) {
    var value;
    value = this.controller.get('textFieldId').mojo.getValue();
    if (value !== "") {
      this.controller.get('textFieldId').mojo.setValue("");
      this.controller.window.setTimeout(__bind(function() {
        return this.controller.get('textFieldId').mojo.focus();
      }, this), 10);
      return this.addNewEvent(value);
    }
  };
  ComingUpAssistant.prototype.timeChanged = function() {};
  ComingUpAssistant.prototype.dateChanged = function() {};
  ComingUpAssistant.prototype.textChanged = function(propertyChangeEvent) {
    var originalEvent;
    originalEvent = propertyChangeEvent.originalEvent;
    if (originalEvent.typeisblur) {} else {
      return Mojo.Log.info("The user made a property change event. This must be the result of the user pressing the enter key");
    }
  };
  ComingUpAssistant.prototype.whenFormatter = function(propertyValue, model) {
    var string, w;
    if (model.when == null) {
      return "";
    }
    w = model.when;
    string = w.substr(0, 4) + '/' + w.substr(4, 2) + '/' + w.substr(6, 2) + ' at ' + w.substr(8, 2);
    return string;
  };
  ComingUpAssistant.prototype.priorityFormatter = function(propertyValue, model) {
    if (model.priority === true) {
      return "priority";
    }
    return "";
  };
  ComingUpAssistant.prototype.handleDeleteItem = function(event) {
    this.events.items.splice(event.index, 1);
    return this.saveEvents();
  };
  ComingUpAssistant.prototype.saveEvents = function() {
    return this.depot.add('events', JSON.stringify(this.events.items));
  };
  ComingUpAssistant.prototype.subredditsLoaded = function() {
    return Subreddit.cached_list.length > 0;
  };
  ComingUpAssistant.prototype.loadEvents = function() {
    return this.depot = new Mojo.Depot({
      name: 'events'
    }, __bind(function() {
      return this.depot.get('events', this.handleLoadEventsResponse, __bind(function() {}, this));
    }, this), __bind(function() {}, this));
  };
  ComingUpAssistant.prototype.processDateString = function(string) {
    return Date.parse(string).toString("yyyyMMdd");
  };
  ComingUpAssistant.prototype.processTimeString = function(string) {
    return Date.parse(string).toString("HHmmss");
  };
  ComingUpAssistant.prototype.processNewEvent = function(event) {
    var date_string, datetime_string, event_string, indexOfAt, indexOfOn, on_terms, term, terms, time_string, _i, _len;
    event = event.replace(/\%20/g, " ");
    Mojo.Log.info("add new event!");
    Mojo.Log.info(JSON.stringify(event));
    Mojo.Log.info(JSON.stringify(event.replace(/\%20/g, " ")));
    terms = [];
    on_terms = [];
    event_string = "";
    date_string = Date.today().toString("yyyyMMdd");
    time_string = "000000";
    event = event.replace('tomorrow', 'on tomorrow');
    event = event.replace('yesterday', 'on yesterday');
    event = event.replace('today', 'on today');
    indexOfOn = event.indexOf(" on ");
    if (indexOfOn > -1) {
      on_terms.push(event.substring(0, indexOfOn));
      on_terms.push(event.substring(indexOfOn + 1));
    }
    for (_i = 0, _len = on_terms.length; _i < _len; _i++) {
      term = on_terms[_i];
      indexOfAt = term.indexOf(" at ");
      if (indexOfAt > -1) {
        terms.push(term.substring(0, indexOfAt));
        terms.push(term.substring(indexOfAt + 1));
      } else {
        terms.push(term);
      }
    }
    Mojo.Log.info(JSON.stringify(terms));
    _.each(terms, __bind(function(term) {
      if (term.indexOf("on ") === 0) {
        return date_string = this.processDateString(term);
      } else if (term.indexOf("at ") === 0) {
        return time_string = this.processTimeString(term);
      } else {
        return event_string = term;
      }
    }, this));
    datetime_string = date_string + time_string;
    return {
      event: event_string,
      when: datetime_string,
      priority: false
    };
  };
  ComingUpAssistant.prototype.addNewEvent = function(string) {
    var event;
    event = this.processNewEvent(string);
    Mojo.Log.info(JSON.stringify(event));
    this.events.items.push(event);
    this.events.items = _.sortBy(this.events.items, function(item) {
      return item.when;
    });
    this.controller.modelChanged(this.events);
    return this.saveEvents();
  };
  ComingUpAssistant.prototype.handleLoadEventsResponse = function(response) {
    var event, _ref, _ref2;
    Mojo.Log.info(JSON.stringify(response));
    if (response !== null) {
      this.events.items = JSON.parse(response);
    }
    if ((((_ref = this.params) != null ? _ref.action : void 0) != null) && (((_ref2 = this.params) != null ? _ref2.action : void 0) != null) !== "" && this.params.action !== "undefined") {
      event = this.processNewEvent(this.params.action);
      Mojo.Log.info(JSON.stringify(event));
      this.events.items.push(event);
    }
    this.events.items = _.sortBy(this.events.items, function(item) {
      return item.when;
    });
    this.controller.modelChanged(this.events);
    return this.saveEvents();
  };
  ComingUpAssistant.prototype.handleActionSelection = function(command) {
    var params;
    if (command == null) {
      return;
    }
    return params = command.split(' ');
  };
  ComingUpAssistant.prototype.findArticleIndex = function(article_name) {
    var index;
    index = -1;
    _.each(this.articles.items, function(item, i) {
      if (item.data.name === article_name) {
        return index = i;
      }
    });
    return index;
  };
  ComingUpAssistant.prototype.findArticleByName = function(name) {
    return _.first(_.select(this.articles.items, function(article) {
      return article.data.name === name;
    }));
  };
  ComingUpAssistant.prototype.getEvent = function(index) {
    return this.controller.get("list").mojo.getNodeByIndex(event.index);
  };
  ComingUpAssistant.prototype.togglePriority = function(index) {
    var item, thing;
    item = this.events.items[index];
    thing = this.controller.get("list").mojo.getNodeByIndex(index);
    item.priority = !item.priority;
    this.saveEvents();
    if (item.priority) {
      return thing.addClassName('priority');
    } else {
      return thing.removeClassName('priority');
    }
  };
  ComingUpAssistant.prototype.itemTapped = function(event) {
    var element_tapped, thing;
    element_tapped = event.originalEvent.target;
    if (element_tapped.className.indexOf('event-option') !== -1) {
      if (element_tapped.className.indexOf('option-priority') !== -1) {
        this.togglePriority(event.index);
      } else if (element_tapped.className.indexOf('option-reminder') !== -1) {
        Banner.send('reminder');
      } else if (element_tapped.className.indexOf('option-notes') !== -1) {
        Banner.send('notes');
      }
      return;
    }
    if (this.selectedIndex === event.index) {
      thing = this.controller.get("list").mojo.getNodeByIndex(event.index);
      this.selectedIndex = null;
      thing.removeClassName('selected');
      return thing.down('.event-options').style.opacity = 0;
    } else {
      if (this.selectedIndex != null) {
        thing = this.controller.get("list").mojo.getNodeByIndex(this.selectedIndex);
        thing.removeClassName('selected');
        thing.down('.event-options').style.opacity = 0;
      }
      thing = this.controller.get("list").mojo.getNodeByIndex(event.index);
      this.selectedIndex = event.index;
      thing.addClassName('selected');
      return thing.down('.event-options').style.opacity = 1;
    }
  };
  ComingUpAssistant.prototype.handleCommand = function(event) {
    if (event.type !== Mojo.Event.command) {
      return;
    }
    switch (event.command) {
      case Mojo.Menu.prefsCmd:
        return this.controller.stageController.pushScene({
          name: "prefs"
        }, {});
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
  return ComingUpAssistant;
})();