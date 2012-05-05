class ComingUpAssistant extends BaseAssistant
  
  constructor: (params = {}) ->
    super
    
    @events = { items : [] }
    @params = params
    @bodyModel = { value : '' }
    
    Mojo.Log.info(JSON.stringify(@params))
    
  setupMenu: ->
    menu_items = [
      {label: "Preferences", command: Mojo.Menu.prefsCmd}
      {label: "About", command: 'about-scene'}
    ]

    @controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, {visible: true, items: menu_items})
  
  setupDates: ->
    @today = Date.today()
    @tomorrow = Date.today().addDays(1)
    @after_tomorrow = Date.today().addDays(2)
    @in_a_week = Date.today().addWeeks(1)
    @first_day_of_next_month = Date.today().moveToLastDayOfMonth().addDays(1)
    @new_years_day = Date.today().moveToMonth(0)
    
    @month_names = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
    
  setup: ->
    super
    
    @controller.setupWidget("bodyTextFieldId",
      { focusMode : Mojo.Widget.focusSelectMode, multiline: true },
      @bodyModel
    )
    
    @controller.setupWidget("textFieldId"
      @attributes =
        hintText: $L("I want to...")
        enterSubmits: true
        requiresEnterKey: true
        autoFocus: false
      @model =
        value: ''
        disabled: false
    )
    
    @controller.setupWidget("list-scroller",{mode: 'vertical'},{})
        
    @setupDates()
    @setupMenu()
    
    @controller.setupWidget("list", {
      itemTemplate: "coming-up/event"
      swipeToDelete: false
      hasNoWidgets: true
      initialAverageRowHeight: 48
      reorderable: true
      dividerFunction: @dividerFunction
      dividerTemplate: "coming-up/divider-template"
      formatters: 
        when: @whenFormatter
        priority: @priorityFormatter
      }, @events)
    
  dividerFunction: (model) =>   
    w = Date.parse(model.when.substr(0,4) + "-" + model.when.substr(4,2) + "-" + model.when.substr(6,2))
    
    return 'earlier' if @today.isAfter(w)
    return 'today' if @tomorrow.isAfter(w)
    return 'tomorrow' if @after_tomorrow.isAfter(w)
    return 'in next week' if @in_a_week.isAfter(w)
    return 'this month' if @first_day_of_next_month.isAfter(w)
    return 'next year' if w.isAfter(@new_years_day)
    return @month_names[w.getMonth()]
      
    'later'

  activate: (event) ->
    super
    @controller.get("floater").hide()
    
    @addListeners(
      [@controller.get("list"), Mojo.Event.listTap, @itemTapped]
      [@controller.get("list"), Mojo.Event.listDelete, @handleDeleteItem]
      [@controller.get("textFieldId"), Mojo.Event.propertyChange, @textFieldChanged]
      [@controller.get("list"), Mojo.Event.dragStart, @dragStartHandler]
      [@controller.get("cancel"), Mojo.Event.tap, @tapCancel]
      [@controller.get("ok"), Mojo.Event.tap, @tapOk]
    )

    if @events.items.length is 0
      @loadEvents()

  tapCancel: (event) =>
    @controller.get("floater").hide()
    
  tapOk: (event) =>
    @events.items[@editIndex].event = @controller.get('bodyTextFieldId').mojo.getValue()
    @saveEvents()
    @controller.get('list').mojo.noticeUpdatedItems(@editIndex, [@events.items[@editIndex]])
    @controller.get('bodyTextFieldId').mojo.setValue("")
    @controller.get("floater").hide()
          
  dragStartHandler: (event) =>
    if (Math.abs(event.filteredDistance.x) > Math.abs(event.filteredDistance.y) * 2)
      @crossing_off = true
      node = event.target.up(".thing")
      node.insert('<div class="draggable-thingy"></div>', { position: 'before' })
      Mojo.Drag.setupDropContainer(node, @)
      
      draggy = node.down(".draggable-thingy")
      draggy.style.left = event.x
      draggy.style.top = event.y

      node._dragObj = Mojo.Drag.startDragging(@controller, draggy, event.down, {
        preventVertical: false,
        draggingClass: "draggy",
        preventDropReset: false
      })

      event.stop()
      
  dragEnter: (element) =>
    Banner.send "drag enter"
    
  dragLeave: (element) =>
    Banner.send "drag leave"
    @crossing_off = false

  dragHover: (element) =>
  #   if (element.offsetLeft > 200 or element.offsetLeft < -200)
  #     Mojo.Log.info "true?"
  #     #@swipeMenu.show = true
  #   else
  #     @crossing_off = false
  #     Mojo.Log.info "false?"
  #     #@swipeMenu.show = false  
  
  markThingAsDone: (index) ->
    thing = @controller.get("list").mojo.getNodeByIndex(index)
    event = @events.items[index]
    event.crossed_off = true
    event.event = "<s><s><s>#{event.event}</s></s></s>"
    @saveEvents()
    
    el = thing.down(".event-holder")
    el.update(event.event)
    @crossing_off = false

  dragDrop: (element) =>
    Banner.send "drag drop: #{@crossing_off}"
    
    if @crossing_off
      el = element.up(".thing").down(".event-holder")
      content = "<s>" + el.innerHTML + "</s>"
      el.update(content)
      @crossing_off = false
  
  deactivate: (event) ->
    super
  
  cleanup: (event) ->
    super
    
  ready: ->
    @controller.get('content-area').style.height = "#{@controller.window.innerHeight - 50}px"
    @controller.get('list-scroller').style.height = "#{@controller.window.innerHeight - 50}px"
    
  textFieldChanged: (event) =>
    value = @controller.get('textFieldId').mojo.getValue()
    
    if value isnt ""
      @controller.get('textFieldId').mojo.setValue("")
      @addNewEvent(value)
      
    @controller.window.setTimeout(
      =>
        @controller.get('textFieldId').mojo.focus()
      10
    )
  
  whenFormatter: (propertyValue, model) =>
    return "" unless model.when?
    w = model.when
    
    string = w.substr(0,4) + '/' + w.substr(4,2) + '/' + w.substr(6,2) + ' at ' + w.substr(8,2) 
    string
    
  priorityFormatter: (propertyValue, model) =>
    return "priority" if model.priority is true
    ""
    
  handleDeleteItem: (event) =>
    @events.items.splice(event.index, 1)
    @saveEvents()
  
  saveEvents: ->
    @depot.add('events', JSON.stringify(@events.items))
      
  loadEvents: ->
    @depot = new Mojo.Depot(
      {name: 'events'}
      =>
        @depot.get('events', @handleLoadEventsResponse, =>)
      =>
    )
    
  processDateString: (string) ->
    Date.parse(string).toString("yyyyMMdd");
    
  processTimeString: (string) ->
    Date.parse(string).toString("HHmmss")
    
  processNewEvent: (event) ->
    event = event.replace(/\%20/g, " ")
    Mojo.Log.info "add new event!"
    Mojo.Log.info JSON.stringify(event)
    Mojo.Log.info JSON.stringify(event.replace(/\%20/g, " "))
    terms = []
    on_terms = []
    event_string = ""
    date_string = Date.today().toString("yyyyMMdd")
    time_string = "000000"

    event = event.replace('tomorrow', 'on tomorrow')
    event = event.replace('yesterday', 'on yesterday')
    event = event.replace('today', 'on today')

    indexOfOn = event.indexOf(" on ")
    
    event += " on today" if indexOfOn is -1
    indexOfOn = event.indexOf(" on ")

    if indexOfOn > -1
      on_terms.push(event.substring(0, indexOfOn))
      on_terms.push(event.substring(indexOfOn+1))

    for term in on_terms
      indexOfAt = term.indexOf(" at ")

      if indexOfAt > -1
        terms.push(term.substring(0, indexOfAt))
        terms.push(term.substring(indexOfAt+1))
      else
        terms.push(term)
        
    Mojo.Log.info(JSON.stringify(terms))
       
    _.each terms, (term) =>
      if term.indexOf("on ") is 0
        date_string = @processDateString(term)
      else if term.indexOf("at ") is 0
        time_string = @processTimeString(term)
      else
        event_string = term
    
    datetime_string = date_string + time_string
    {event: event_string, when: datetime_string, priority: false, id: new Date().getTime()}
    
  addNewEvent: (string) =>
    event = @processNewEvent(string)
    Mojo.Log.info(JSON.stringify(event))
    @events.items.push(event)
    @events.items = _.sortBy @events.items, (item) -> item.when
    @controller.get("list").mojo.invalidateItems(0)
    @controller.modelChanged(@events)
    @saveEvents()
  
  handleLoadEventsResponse: (response) =>
    Mojo.Log.info(JSON.stringify(response))
    
    if response isnt null
      @events.items = JSON.parse(response)
      
    if @params?.action? and @params?.action? isnt "" and @params.action isnt "undefined"
      event = @processNewEvent(@params.action)
      Mojo.Log.info(JSON.stringify(event))
      @events.items.push(event)
      
    # todo: sort events by time here...
    
    @events.items = _.sortBy @events.items, (item) -> item.when
    @controller.modelChanged(@events)
    @saveEvents()
    
  togglePriority: (index) ->
    item = @events.items[index]
    thing = @controller.get("list").mojo.getNodeByIndex(index)
    item.priority = not item.priority
    @saveEvents()
    
    if item.priority
      thing.addClassName('priority')
    else
      thing.removeClassName('priority')
  
  itemTapped: (event) =>
    note = @events.items[event.index]
    
    return if note.crossed_off is true
    
    element_tapped = event.originalEvent.target
    thing = @controller.get("list").mojo.getNodeByIndex(event.index)

    if element_tapped.className.indexOf('event-option') isnt -1
      if element_tapped.className.indexOf('option-priority') isnt -1
        @togglePriority(event.index)
      else if element_tapped.className.indexOf('option-reminder') isnt -1
        Banner.send('reminder')
      else if element_tapped.className.indexOf('option-notes') isnt -1
        @controller.stageController.pushScene({name:"notes"}, {event: @events.items[event.index]})
      else if element_tapped.className.indexOf('option-edit') isnt -1
        @editIndex = event.index
        @controller.get("floater").show()
        text = @events.items[event.index].event
        @controller.get('bodyTextFieldId').mojo.setValue(text)
        Mojo.Log.info @controller.get('bodyTextFieldId').innerHTML
        @controller.get("floater").show()
        @controller.get('bodyTextFieldId').mojo.focus()
      else if element_tapped.className.indexOf('option-done') isnt -1
        @markThingAsDone(event.index)
        @deselectThing(thing)
        
      return
    
    if thing.hasClassName("selected")
      @deselectThing(thing)
      @selectedIndex = null
      return
      
    if @selectedIndex?
      old_thing = @controller.get("list").mojo.getNodeByIndex(@selectedIndex) 
      @deselectThing(old_thing) if old_thing.hasClassName("selected")
      @selectedIndex = null

    @selectThing(thing)
    @selectedIndex = event.index
  
  selectThing: (thing) =>
    @addOptions(thing)
    thing.addClassName('selected')
    
  deselectThing: (thing) =>
    thing.removeClassName('selected')
    thing.down(".event-options").remove() if thing.down(".event-options")
    
  addOptions: (thing) =>
    thing.insert('<div class="event-options">
      <div class="event-option option-priority">Priority</div>
      <div class="event-option option-reminder">Reminder</div>
      <div class="event-option option-notes">Notes</div>
      <div class="event-option option-edit">Edit</div>
      <div class="event-option option-done">Done</div>
    </div>')
  
  handleCommand: (event) ->
    return if event.type isnt Mojo.Event.command
    
    switch event.command
      when Mojo.Menu.prefsCmd
        @controller.stageController.pushScene({name:"prefs"}, {})
      when 'about-scene'
        @controller.stageController.pushScene({name:"about"}, {})
      when 'donation-cmd'
        AppAssistant.open_donation_link()
      when 'purchase-cmd'
        AppAssistant.open_purchase_link()
